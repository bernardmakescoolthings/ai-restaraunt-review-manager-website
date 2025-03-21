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

# Stop any process using port 3000
echo "Checking for processes using port 3000..."
if sudo lsof -i :3000; then
    echo "Stopping processes using port 3000..."
    sudo fuser -k 3000/tcp || true
fi

# Stop any process using port 80
echo "Checking for processes using port 80..."
if sudo lsof -i :80; then
    echo "Stopping processes using port 80..."
    sudo fuser -k 80/tcp || true
fi

# Stop and remove all containers
echo "Stopping and removing all containers..."
docker-compose down --remove-orphans || true
docker rm -f $(docker ps -aq) || true

# Remove old volumes and networks
echo "Cleaning up Docker system..."
docker system prune -f --volumes

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