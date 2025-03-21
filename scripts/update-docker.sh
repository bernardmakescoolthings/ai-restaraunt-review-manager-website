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

# Navigate to app directory
APP_DIR="/home/ec2-user/ai_restaraunt-review-manager-website"
echo "Navigating to application directory: $APP_DIR"
cd "$APP_DIR"

# Pull latest changes
echo "Pulling latest changes from repository..."
git pull

# Stop existing containers and clean up
echo "Stopping existing containers..."
docker-compose down --remove-orphans
docker system prune -f

# Pull and restart containers
echo "Pulling latest images and starting containers..."
docker-compose pull
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
echo -e "\nUpdate completed!"
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