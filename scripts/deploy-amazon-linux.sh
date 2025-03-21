#!/bin/bash

# Update system
sudo yum update -y

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install development tools (needed for some npm packages)
sudo yum groupinstall -y "Development Tools"

# Install PM2 globally
sudo npm install -g pm2

# Install nginx
sudo yum install -y nginx

# Create nginx configuration
sudo tee /etc/nginx/conf.d/ai-restaurant-review.conf > /dev/null <<EOL
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Remove default nginx configuration if it exists
sudo rm -f /etc/nginx/conf.d/default.conf

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create app directory
mkdir -p /home/ec2-user/ai_restaraunt-review-manager-website
cd /home/ec2-user/ai_restaraunt-review-manager-website

# Stop any existing PM2 processes for the app
pm2 delete ai-restaurant-review 2>/dev/null || true

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Build the application
npm run build

# Start the application with PM2 using the full npm command
pm2 start "npm run start" --name ai-restaurant-review

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Configure firewall if it's enabled
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --reload
fi

# Print completion message and logs
echo "Deployment completed! Your application should be running on http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "Checking application logs..."
sleep 5
pm2 logs ai-restaurant-review --lines 50 