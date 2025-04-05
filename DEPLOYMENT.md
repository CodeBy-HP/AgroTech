# AgroTech Deployment Guide

This guide provides instructions for securely deploying the AgroTech application.

## Environment Setup

### Backend Setup

1. Create a secure `.env` file in the `backend` directory using the template:

```bash
# Copy the template
cp backend/.env.template backend/.env

# Generate a secure random key
SECRET_KEY=$(openssl rand -hex 32)
```

2. Edit the `.env` file with your production settings:

```
# Security
SECRET_KEY=your_generated_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=your_production_database_url
# Example for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/agrotech

# CORS Settings
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# External API Keys
CROP_DISEASE_API_KEY=your_crop_disease_api_key_here
CROP_DISEASE_API_URL=https://api.crop-disease-detection.example.com/v1
KINDWISE_API_KEY=your_kindwise_api_key_here
```

3. Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### Frontend Setup

1. Create a `.env.local` file in the `frontend` directory:

```bash
# Copy the template
cp frontend/.env.template frontend/.env.local
```

2. Edit the `.env.local` file with your production API URL and API keys:

```
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# External API Keys
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_MARKET_PRICE_API_KEY=your_market_price_api_key
```

3. Obtain necessary API keys:
   - **OpenWeather API**: Register at [OpenWeather](https://openweathermap.org/api) to get an API key for weather forecasts
   - **Market Price API**: Register at [data.gov.in](https://data.gov.in/) to access the agricultural commodities market price API
   - **KindWise API**: Register at [KindWise](https://kindwise.com/) to obtain an API key for crop disease detection
   - **Crop Disease API**: If using a different third-party API for crop disease detection, obtain credentials from the provider

4. Install dependencies and build:

```bash
cd frontend
npm install
npm run build
```

## Deployment Options

### Backend Deployment (FastAPI)

#### Option 1: Deploy with Gunicorn and Nginx

1. Install Gunicorn:

```bash
pip install gunicorn
```

2. Create a service file (e.g., `/etc/systemd/system/agrotech-api.service`):

```
[Unit]
Description=AgroTech API Server
After=network.target

[Service]
User=username
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app -b 0.0.0.0:8000
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

3. Configure Nginx as a reverse proxy:

```
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option 2: Deploy with Docker

Create a `Dockerfile` in the backend directory:

```Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Deployment (Next.js)

#### Option 1: Deploy with Vercel

```bash
npx vercel
```

#### Option 2: Deploy with Nginx

1. Build the Next.js app:

```bash
npm run build
```

2. Configure Nginx:

```
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/frontend/.next;
        try_files $uri $uri/ /index.html;
    }
}
```

## Security Checklist

- [x] Use environment variables for all secrets (API keys, database credentials)
- [x] Generate a strong, random secret key for JWT authentication
- [x] Configure proper CORS settings to restrict access
- [x] Implement HTTPS with proper SSL certificates
- [x] Ensure database connection is secure and credentials are not exposed
- [x] Add appropriate items to .gitignore to prevent committing sensitive files
- [x] Set up proper file permissions on the server
- [x] Implement rate limiting to prevent abuse
- [x] Regular security updates and patches

## Maintenance

- Regularly update dependencies to patch security vulnerabilities
- Monitor application logs for suspicious activity
- Backup the database regularly
- Consider implementing automated deployment with CI/CD pipelines 