# OliverSales Deployment Guide

This guide walks you through deploying the complete OliverSales e-commerce platform to production.

## Prerequisites

- Node.js 16+ installed
- Git installed
- Domain name (optional)
- Hosting account (Heroku/DigitalOcean/AWS)

## Option 1: Deploy to Heroku (Easiest)

### Step 1: Prepare for Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login
```

### Step 2: Create Heroku App

```bash
# Create app
heroku create olivershop-store

# Or with custom name
heroku create your-shop-name
```

### Step 3: Configure Environment

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set ALLOWED_ORIGINS=https://your-domain.com
```

### Step 4: Deploy

```bash
# Push to Heroku
git push heroku copilot/implement-missing-functionality:main

# Or if on main branch
git push heroku main

# Run database initialization
heroku run npm run init-db

# Check logs
heroku logs --tail
```

### Step 5: Test

```bash
# Your API is live at
https://your-app-name.herokuapp.com/api/health
```

### Step 6: Deploy Frontend

Frontend options:
1. **Same Heroku app**: Add static file serving
2. **Netlify**: Drag & drop the folder
3. **GitHub Pages**: Push to gh-pages branch
4. **Vercel**: Connect repository

## Option 2: Deploy to DigitalOcean

### Step 1: Create Droplet

1. Go to DigitalOcean
2. Create new Droplet (Ubuntu 22.04)
3. Choose $5/month plan
4. Add SSH key
5. Create Droplet

### Step 2: Connect & Setup

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install nginx
apt install -y nginx
```

### Step 3: Deploy Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/olivershop.git
cd olivershop

# Install dependencies
npm install

# Initialize database
npm run init-db

# Start with PM2
pm2 start server/index.js --name olivershop
pm2 save
pm2 startup
```

### Step 4: Configure Nginx

```bash
# Create nginx config
nano /etc/nginx/sites-available/olivershop
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/olivershop;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/olivershop /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 5: Add SSL with Let's Encrypt

```bash
# Install certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

## Option 3: Deploy to Railway

### Step 1: Sign Up

1. Go to railway.app
2. Sign up with GitHub
3. Connect your repository

### Step 2: Create Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose olivershop repository
4. Railway auto-detects Node.js

### Step 3: Configure

1. Add environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your-secret`
   - `PORT=3000`

2. Add start command:
   - `npm run init-db && npm start`

### Step 4: Deploy

- Railway auto-deploys on git push
- You get a URL like: `olivershop.up.railway.app`

## Database Migration (Production)

For production, migrate from SQLite to PostgreSQL:

### Step 1: Install PostgreSQL Driver

```bash
npm install pg
npm uninstall better-sqlite3
```

### Step 2: Update Connection

```javascript
// server/database/connection.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = { pool };
```

### Step 3: Update Queries

Replace sqlite3 syntax with PostgreSQL:
- `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
- `DATETIME DEFAULT CURRENT_TIMESTAMP` → `TIMESTAMP DEFAULT NOW()`

## Frontend Deployment

### Option A: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir .
```

### Option B: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option C: GitHub Pages

```bash
# Push to gh-pages branch
git checkout -b gh-pages
git push origin gh-pages
```

Enable GitHub Pages in repository settings.

## Environment Variables

Production `.env`:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=use-openssl-rand-base64-32
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Optional: Payment gateways
STRIPE_SECRET_KEY=sk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...

# Optional: Email service
SENDGRID_API_KEY=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

## Security Checklist

- [ ] Change JWT_SECRET to random 32+ character string
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS (SSL certificate)
- [ ] Configure CORS properly
- [ ] Use strong database password
- [ ] Enable firewall (ufw on Linux)
- [ ] Set up rate limiting
- [ ] Configure CSP headers
- [ ] Implement backup strategy
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Review and update dependencies

## Monitoring

### Add Logging

```javascript
// server/index.js
const morgan = require('morgan');
app.use(morgan('combined'));
```

### Add Error Tracking

```javascript
const Sentry = require('@sentry/node');
Sentry.init({ 
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV
});
```

### Health Check Endpoint

Already included: `GET /api/health`

Monitor this endpoint with:
- UptimeRobot (free)
- Pingdom
- Better Uptime

## Backup Strategy

### Database Backups

```bash
# PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# SQLite
cp server/database/olivershop.db backup/olivershop-$(date +%Y%m%d).db
```

### Automated Backups

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

## Performance Optimization

### 1. Enable Gzip Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching Headers

```javascript
app.use(express.static('.', {
    maxAge: '1d',
    etag: true
}));
```

### 3. Database Indexing

```sql
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status);
```

### 4. CDN for Static Assets

Use Cloudflare or AWS CloudFront for:
- Images
- CSS
- JavaScript

## Testing Production

```bash
# Health check
curl https://your-domain.com/api/health

# Test API
curl https://your-domain.com/api/products?limit=5

# Load testing
npm install -g artillery
artillery quick --count 100 --num 10 https://your-domain.com/api/products
```

## Troubleshooting

### Server won't start
```bash
# Check logs
pm2 logs olivershop
heroku logs --tail

# Check port
netstat -tulpn | grep 3000
```

### Database connection failed
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### CORS errors
```bash
# Update ALLOWED_ORIGINS in .env
ALLOWED_ORIGINS=https://your-frontend.com
```

## Rollback Strategy

### Heroku
```bash
heroku releases
heroku rollback v123
```

### PM2
```bash
# Keep previous version
pm2 delete olivershop
pm2 start old-version/server/index.js
```

## Post-Deployment

1. **Test all features**:
   - [ ] Browse products
   - [ ] Add to cart
   - [ ] Checkout
   - [ ] View orders
   - [ ] Wishlist
   - [ ] Newsletter

2. **Configure analytics**:
   - Google Analytics
   - Facebook Pixel
   - Hotjar

3. **Set up email notifications**:
   - Order confirmations
   - Shipping updates
   - Newsletter

4. **Add payment gateway**:
   - Stripe
   - PayPal
   - Square

## Support

For deployment issues:
1. Check application logs
2. Review error messages
3. Test API endpoints
4. Verify environment variables
5. Check firewall/security groups

---

**Ready for production! 🚀**
