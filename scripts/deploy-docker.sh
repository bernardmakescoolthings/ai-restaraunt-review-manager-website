#!/bin/bash

# Exit on any error
set -e

# Check for required arguments
if [ -z "$1" ]; then
    echo "Error: Docker username is required"
    echo "Usage: $0 <docker-username> [tag]"
    exit 1
fi

DOCKER_USERNAME="$1"
export DOCKER_USERNAME
export TAG="${2:-latest}"

echo "Starting deployment process..."

# Function to stop processes using a port
stop_port() {
    local port=$1
    echo "Checking for processes using port $port..."
    
    # Try multiple methods to find and kill processes
    if sudo lsof -i ":$port"; then
        echo "Found processes using port $port, stopping them..."
        sudo kill -9 $(sudo lsof -t -i":$port") 2>/dev/null || true
        sudo fuser -k "${port}/tcp" 2>/dev/null || true
    else
        echo "No processes found using port $port"
    fi
    
    # Double check
    sleep 2
    if sudo lsof -i ":$port" >/dev/null 2>&1; then
        echo "WARNING: Port $port is still in use. Attempting forceful cleanup..."
        sudo pkill -9 -f ".*:${port}" 2>/dev/null || true
        sleep 2
    fi
}

# Update system
echo "Updating system packages..."
sudo yum update -y

# Install Docker
echo "Installing Docker..."
if ! command -v docker &> /dev/null; then
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ec2-user
    echo "Docker installed successfully"
else
    echo "Docker already installed"
fi

# Install Docker Compose
echo "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully"
else
    echo "Docker Compose already installed"
fi

# Create and navigate to app directory
APP_DIR="/home/ec2-user/ai_restaraunt-review-manager-website"
echo "Setting up application directory: $APP_DIR"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Stop all Docker containers and clean up
echo "Stopping all Docker containers..."
docker-compose down --remove-orphans || true
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

# Remove old volumes and networks
echo "Cleaning up Docker system..."
docker system prune -f --volumes

# Stop processes on required ports
stop_port 3000
stop_port 80

# Verify ports are free
echo "Verifying ports are free..."
if sudo lsof -i :3000 >/dev/null 2>&1 || sudo lsof -i :80 >/dev/null 2>&1; then
    echo "ERROR: Unable to free required ports. Please check manually or restart the instance."
    exit 1
fi

# Copy configuration files
echo "Copying configuration files..."
cat > docker-compose.yml <<EOL
version: '3.8'

services:
  app:
    image: ${DOCKER_USERNAME}/ai-restaurant-review-manager-website:\${TAG:-latest}
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3000
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      app:
        condition: service_healthy
    restart: always
EOL

cat > nginx.conf <<EOL
upstream nextjs_upstream {
    server app:3000;
}

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Add timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOL

# Pull the latest images
echo "Pulling latest images..."
docker-compose pull

# Start containers
echo "Starting containers..."
docker-compose up -d

# Wait for health checks
echo "Waiting for services to be healthy..."
sleep 20

# Check container status
echo "Checking container status..."
docker-compose ps

# Get the public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Print completion message
echo -e "\nDeployment completed!"
echo "Your application should be running at http://$PUBLIC_IP"
echo -e "\nContainer logs:"
docker-compose logs --tail=50

# Verify services are running
echo -e "\nVerifying services..."
if curl -s -f "http://localhost" > /dev/null; then
    echo "Application is responding successfully"
else
    echo "Warning: Application is not responding on port 80"
    echo "Checking container logs for potential issues..."
    docker-compose logs
fi

echo -e "\nUseful commands:"
echo "- View logs in real-time: docker-compose logs -f"
echo "- Restart services: docker-compose restart"
echo "- Stop services: docker-compose down"
echo "- Check status: docker-compose ps" 