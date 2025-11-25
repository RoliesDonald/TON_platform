# 🚀 TON Platform Deployment Guide

**Complete deployment guide for the TON Fleet Management System in production and development environments.**

## Table of Contents

1. [Environment Preparation](#environment-preparation)
2. [Database Setup](#database-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Docker Deployment (Recommended)](#docker-deployment-recommended)
6. [Environment Configuration](#environment-configuration)
7. [SSL/HTTPS Setup](#sslhttps-setup)
8. [Monitoring & Logging](#monitoring--logging)
9. [Backup Strategy](#backup-strategy)
10. [Security Considerations](#security-considerations)

## Environment Preparation

### System Requirements

**Minimum Requirements:**
- **CPU**: 2 cores
- **Memory**: 4GB RAM
- **Storage**: 20GB available space
- **OS**: Linux (Ubuntu 20.04+), macOS, or Windows 10+

**Recommended Requirements:**
- **CPU**: 4+ cores
- **Memory**: 8GB+ RAM
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 22.04 LTS or CentOS 8+

### Prerequisites Installation

#### Ubuntu/Debian
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Go 1.21+
wget https://golang.org/dl/go1.21.6.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.6.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Install Docker & Docker Compose
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js, Go, and Docker
brew install node@18 go docker docker-compose

# Add Go to PATH
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.zshrc
source ~/.zshrc
```

## Database Setup

### PostgreSQL Installation & Configuration

#### Installation
```bash
# Ubuntu/Debian
sudo apt-get install -y postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql
```

#### Database Creation
```bash
# Switch to postgres user
sudo -u postgres psql

-- Create database and user
CREATE DATABASE ton_platform;
CREATE USER ton_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ton_platform TO ton_user;
ALTER USER ton_user CREATEDB;

-- Exit PostgreSQL
\q
```

#### Database Configuration
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Update these settings:
listen_addresses = 'localhost'
port = 5432
max_connections = 100
shared_buffers = 256MB

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Redis Setup (Optional, for caching)
```bash
# Ubuntu/Debian
sudo apt-get install -y redis-server

# macOS
brew install redis
brew services start redis

# Configure Redis
sudo nano /etc/redis/redis.conf

# Update settings:
bind 127.0.0.1
port 6379
requirepass your_redis_password

# Restart Redis
sudo systemctl restart redis-server
```

## Backend Deployment

### Option 1: Direct Deployment

#### Build and Run
```bash
# Navigate to backend directory
cd /home/rdonald/Documents/TON/backend

# Install Go dependencies
go mod download

# Build the application
go build -o bin/server cmd/server/main.go

# Run database migrations
go run cmd/migrate/main.go

# Start the server
./bin/server
```

#### Create Systemd Service
```bash
# Create service file
sudo nano /etc/systemd/system/ton-backend.service
```

```ini
[Unit]
Description=TON Platform Backend
After=network.target postgresql.service

[Service]
Type=simple
User=ton_user
WorkingDirectory=/opt/ton-platform/backend
ExecStart=/opt/ton-platform/backend/bin/server
Restart=always
RestartSec=5
Environment=GIN_MODE=release

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable ton-backend
sudo systemctl start ton-backend
sudo systemctl status ton-backend
```

### Option 2: Docker Deployment
```bash
# Build Docker image
cd /home/rdonald/Documents/TON/backend
docker build -t ton-backend .

# Run container
docker run -d \
  --name ton-backend \
  --restart unless-stopped \
  -p 8080:8080 \
  --env-file .env \
  ton-backend
```

## Frontend Deployment

### Option 1: Node.js Deployment

#### Build for Production
```bash
# Navigate to frontend directory
cd /home/rdonald/Documents/TON/frontend

# Install dependencies
npm ci --production=false

# Build application
npm run build

# Start production server
npm start
```

#### Create Systemd Service
```bash
# Create service file
sudo nano /etc/systemd/system/ton-frontend.service
```

```ini
[Unit]
Description=TON Platform Frontend
After=network.target

[Service]
Type=simple
User=ton_user
WorkingDirectory=/opt/ton-platform/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable ton-frontend
sudo systemctl start ton-frontend
sudo systemctl status ton-frontend
```

### Option 2: Docker Deployment
```bash
# Build Docker image
cd /home/rdonald/Documents/TON/frontend
docker build -t ton-frontend .

# Run container
docker run -d \
  --name ton-frontend \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  ton-frontend
```

### Option 3: Nginx Reverse Proxy

#### Install Nginx
```bash
# Ubuntu/Debian
sudo apt-get install -y nginx

# macOS
brew install nginx
```

#### Configure Nginx
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ton-platform
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ton-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Docker Deployment (Recommended)

### Full Stack with Docker Compose

#### Production Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ton_platform
      POSTGRES_USER: ton_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - ton-network

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - ton-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - SERVER_PORT=8080
      - GIN_MODE=release
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=ton_user
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=ton_platform
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - ton-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - ton-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - ton-network

volumes:
  postgres_data:
  redis_data:

networks:
  ton-network:
    driver: bridge
```

#### Deploy with Docker Compose
```bash
# Create environment file
cat > .env << EOF
DB_PASSWORD=your_secure_db_password
REDIS_PASSWORD=your_secure_redis_password
JWT_SECRET=your_jwt_secret_key
DOMAIN=your-domain.com
EOF

# Deploy application
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Environment Configuration

### Backend Environment (.env)
```bash
# Server Configuration
SERVER_PORT=8080
GIN_MODE=release
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=ton_user
DB_PASSWORD=your_secure_password
DB_NAME=ton_platform
DB_SSLMODE=disable
DB_MAX_CONNECTIONS=25

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_ACCESS_EXPIRE_TIME=15
JWT_REFRESH_EXPIRE_TIME=168

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# File Upload Configuration
MAX_UPLOAD_SIZE=10MB
UPLOAD_PATH=/opt/ton-platform/uploads

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=/var/log/ton-platform/backend.log
```

### Frontend Environment (.env.local)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Application Configuration
NEXT_PUBLIC_APP_NAME=TON Platform
NEXT_PUBLIC_APP_VERSION=1.0.0

# Google Maps API (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_MAPS=true
```

## SSL/HTTPS Setup

### Let's Encrypt with Certbot

#### Installation
```bash
# Ubuntu/Debian
sudo apt-get install -y certbot python3-certbot-nginx

# macOS
brew install certbot
```

#### Generate SSL Certificate
```bash
# Generate certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Update Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    # ... (rest of the configuration)
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### Application Monitoring

#### PM2 (for Node.js applications)
```bash
# Install PM2
npm install -g pm2

# Start application with PM2
cd /home/rdonald/Documents/TON/frontend
pm2 start npm --name "ton-frontend" -- start

# Setup PM2 startup script
pm2 startup
pm2 save

# Monitor application
pm2 monit
```

#### System Monitoring
```bash
# Install monitoring tools
sudo apt-get install -y htop iotop nethogs

# Log management with logrotate
sudo nano /etc/logrotate.d/ton-platform
```

```
/var/log/ton-platform/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ton_user ton_user
}
```

### Health Checks

#### Backend Health Check Endpoint
```bash
# Add to your Go application
// health_check.go
func HealthCheck(c *gin.Context) {
    c.JSON(200, gin.H{
        "status": "healthy",
        "timestamp": time.Now(),
        "version": "1.0.0",
    })
}
```

#### Frontend Health Check
```bash
# Create health check script
#!/bin/bash
# health_check.sh

# Check backend health
curl -f http://localhost:8080/health || exit 1

# Check frontend health
curl -f http://localhost:3000 || exit 1

echo "All services are healthy"
```

## Backup Strategy

### Database Backup

#### Automated Backup Script
```bash
#!/bin/bash
# backup_database.sh

BACKUP_DIR="/opt/backups/ton-platform"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="ton_platform"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U ton_user -d $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove old backups (keep last 30 days)
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Database backup completed: $BACKUP_DIR/db_backup_$DATE.sql.gz"
```

#### Schedule Backups
```bash
# Add to crontab
sudo crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup_database.sh

# Weekly backup on Sundays at 3 AM
0 3 * * 0 /opt/scripts/full_backup.sh
```

### Application Backup
```bash
#!/bin/bash
# backup_application.sh

BACKUP_DIR="/opt/backups/ton-platform"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/opt/ton-platform"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C $APP_DIR .

# Backup configuration files
cp /etc/nginx/sites-available/ton-platform $BACKUP_DIR/nginx_config_$DATE

echo "Application backup completed: $BACKUP_DIR/app_backup_$DATE.tar.gz"
```

## Security Considerations

### Firewall Configuration
```bash
# Install UFW (Uncomplicated Firewall)
sudo apt-get install -y ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Application Security

#### Environment Variables Security
```bash
# Secure environment file
chmod 600 .env
chown ton_user:ton_user .env

# Encrypt sensitive data
echo "sensitive_data" | openssl enc -aes-256-cbc -base64 > encrypted_data.txt
```

#### Database Security
```sql
-- Create read-only user for reports
CREATE USER ton_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE ton_platform TO ton_readonly;
GRANT USAGE ON SCHEMA public TO ton_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ton_readonly;

-- Limit connections per user
ALTER USER ton_user CONNECTION LIMIT 10;
```

### API Rate Limiting
```go
// Add to your Go backend
func RateLimitMiddleware() gin.HandlerFunc {
    limiter := rate.NewLimiter(rate.Limit(100), 200) // 100 requests per second

    return func(c *gin.Context) {
        if !limiter.Allow() {
            c.JSON(429, gin.H{"error": "Too many requests"})
            c.Abort()
            return
        }
        c.Next()
    }
}
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U ton_user -d ton_platform -c "SELECT version();"

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### Application Not Starting
```bash
# Check application logs
sudo journalctl -u ton-backend -f
sudo journalctl -u ton-frontend -f

# Check port usage
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8080

# Check Docker logs (if using Docker)
docker logs ton-backend
docker logs ton-frontend
```

#### Nginx Issues
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Performance Optimization

#### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_workorders_status ON workorders(status);
CREATE INDEX idx_workorders_created_at ON workorders(created_at);
CREATE INDEX idx_vehicles_fleet_id ON vehicles(fleet_id);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM workorders WHERE status = 'active';
```

#### Application Optimization
```bash
# Enable gzip compression in Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Configure browser caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 🎯 Deployment Complete!

Your TON Platform is now deployed and ready for production use. For any issues or questions, refer to the troubleshooting section or check the application logs.

**Next Steps:**
1. Configure monitoring and alerting
2. Set up regular backups
3. Implement SSL certificates
4. Configure email notifications
5. Test all functionalities before going live