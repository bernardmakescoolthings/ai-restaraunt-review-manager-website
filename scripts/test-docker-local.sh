#!/bin/bash

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down

# Build the containers
echo "Building containers..."
docker-compose build --no-cache

# Start the containers
echo "Starting containers..."
docker-compose up -d

# Check container status
echo -e "\nChecking container status..."
docker-compose ps

# Show logs
echo -e "\nShowing container logs..."
docker-compose logs --tail=50

echo -e "\nApplication should now be running at http://localhost"
echo "To view logs in real-time, run: docker-compose logs -f"
echo "To stop the application, run: docker-compose down" 