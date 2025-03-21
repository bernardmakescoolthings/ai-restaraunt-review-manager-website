#!/bin/bash

# Navigate to app directory
cd /home/ec2-user/ai_restaraunt-review-manager-website

# Pull latest changes
git pull

# Stop the current process
pm2 delete ai-restaurant-review 2>/dev/null || true

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Build the application
npm run build

# Start the application with PM2
pm2 start "npm run start" --name ai-restaurant-review

# Save PM2 process list
pm2 save

# Print completion message and logs
echo "Update completed! Your application has been rebuilt and restarted."
echo "Checking application logs..."
sleep 5
pm2 logs ai-restaurant-review --lines 50 