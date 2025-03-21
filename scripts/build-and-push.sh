#!/bin/bash

# Exit on any error
set -e

# Configuration
DOCKER_USERNAME="$1"
IMAGE_NAME="ai-restaurant-review-manager-website"
TAG="${2:-latest}"

if [ -z "$DOCKER_USERNAME" ]; then
    echo "Error: Docker username is required"
    echo "Usage: $0 <docker-username> [tag]"
    exit 1
fi

FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$TAG"

echo "Building image: $FULL_IMAGE_NAME"

# Build the image
echo "Building Docker image..."
docker build -t "$FULL_IMAGE_NAME" .

# Log in to Docker Hub (will prompt for password)
echo "Please log in to Docker Hub:"
docker login

# Push the image
echo "Pushing image to Docker Hub..."
docker push "$FULL_IMAGE_NAME"

echo -e "\nBuild and push completed successfully!"
echo "Image: $FULL_IMAGE_NAME"
echo -e "\nNext steps:"
echo "1. Deploy to EC2: ./scripts/deploy-docker.sh $DOCKER_USERNAME $TAG"
echo "2. For future updates: ./scripts/update-docker.sh $DOCKER_USERNAME $TAG" 