# Deployment Guide for MyChords

This guide provides instructions for deploying MyChords in different environments.

## Local Production Build

To create a production build for local deployment:

1. Build the client
```bash
cd client
npm run build
```

2. Configure environment variables for production
```bash
# Create a .env file in the root directory
echo "NODE_ENV=production" > .env
echo "PORT=5000" >> .env
```

3. Start the production server
```bash
npm start
```

4. Access the application at `http://localhost:5000`

## Deploying to a VPS or Dedicated Server

### Prerequisites
- Node.js (v18+)
- PM2 (process manager)
- Nginx (web server)
- Domain name (optional)

### Steps

1. Clone the repository
```bash
git clone https://github.com/bmj2728/mychords.git
cd mychords
```

2. Install dependencies and build the client
```bash
npm install
cd client
npm install
npm run build
cd ..
```

3. Configure PM2 to manage the Node.js process
```bash
npm install -g pm2
pm2 start server/server.js --name "mychords"
pm2 save
pm2 startup
```

4. Configure Nginx as a reverse proxy

Create a new Nginx site configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com; # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. Enable the configuration and restart Nginx
```bash
sudo ln -s /etc/nginx/sites-available/mychords /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. Set up SSL with Let's Encrypt (optional but recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Docker Deployment

For a containerized deployment, you can use Docker:

1. Create a Dockerfile in the project root
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy client package.json
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy all files
COPY . .

# Build client
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
```

2. Build and run the Docker container
```bash
docker build -t mychords .
docker run -p 5000:5000 -v /path/to/data:/app/data mychords
```

## Managing Song Files

When deploying MyChords, ensure your song files are properly managed:

1. The application expects song files in the following directories:
   - `/data/songs/chordpro` - For ChordPro files
   - `/data/songs/plaintext` - For plaintext files

2. For persistent storage with Docker, mount a volume to the /app/data directory

3. To back up your song files, simply copy the entire data directory.

## Updating the Application

To update to a new version:

1. Pull the latest changes
```bash
git pull origin main
```

2. Rebuild the client
```bash
cd client
npm install
npm run build
cd ..
```

3. Restart the server
```bash
# If using PM2
pm2 restart mychords

# If using systemd
sudo systemctl restart mychords
```

## Troubleshooting

### Server won't start
- Check if port 5000 is already in use with `lsof -i :5000`
- Ensure all dependencies are installed
- Check the logs with `pm2 logs mychords`

### Can't access the application
- Verify that the server is running
- Check Nginx configuration and logs
- Ensure firewall settings allow access to port 80/443 