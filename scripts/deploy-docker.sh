#!/bin/bash

# Exit on any error
set -e

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

# Stop any existing containers and remove old images
echo "Cleaning up existing containers and images..."
docker-compose down --remove-orphans
docker system prune -f

# Build and start containers
echo "Building and starting containers..."
docker-compose build --no-cache
docker-compose up -d

# Wait for health checks
echo "Waiting for services to be healthy..."
sleep 10

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
fi

echo -e "\nUseful commands:"
echo "- View logs in real-time: docker-compose logs -f"
echo "- Restart services: docker-compose restart"
echo "- Stop services: docker-compose down"
echo "- Check status: docker-compose ps" 