#!/bin/bash

# Navigate to app directory
cd /home/ec2-user/judy-app

# Pull latest changes
git pull

# Install dependencies
npm install

# Build the application
npm run build

# Restart the application
pm2 restart judy-app

# Print completion message
echo "Update completed! Your application has been rebuilt and restarted." 