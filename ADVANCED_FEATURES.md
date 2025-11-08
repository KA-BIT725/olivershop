# Advanced Features Setup Guide

This guide covers setup for the three advanced features added to OliverSales:
1. Payment Gateway Integration (Stripe & PayPal)
2. Email Notifications (Order confirmations & newsletters)
3. Deployment Configurations (Multiple platforms)

---

## 1. Payment Gateway Integration

### Stripe Setup

#### Step 1: Create Stripe Account
1. Go to https://stripe.com and create an account
2. Get your API keys from the Dashboard

#### Step 2: Configure Environment Variables
```bash
# Add to .env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### Step 3: Install Stripe SDK (Production)
```bash
npm install stripe
```

#### Step 4: Uncomment Production Code
In `server/routes/payments.js`, uncomment the Stripe implementation code blocks.

#### Step 5: Test Payment
```bash
# Test endpoint
curl -X POST http://localhost:3000/api/payments/stripe/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 105.98, "currency": "usd"}'
```

#### Step 6: Set Up Webhooks
1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `.env`

###PayPal Setup

#### Step 1: Create PayPal Business Account
1. Go to https://developer.paypal.com
2. Create a sandbox or live app

#### Step 2: Get API Credentials
1. Go to Dashboard > My Apps & Credentials
2. Copy Client ID and Secret

#### Step 3: Configure Environment
```bash
# Add to .env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret
PAYPAL_MODE=sandbox  # or 'live' for production
```

#### Step 4: Install PayPal SDK (Production)
```bash
npm install paypal-rest-sdk
```

#### Step 5: Test PayPal
```bash
curl -X POST http://localhost:3000/api/payments/paypal/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 105.98, "currency": "USD"}'
```

### Cash on Delivery (COD)

COD is ready to use - no setup required! Orders are marked as "payment pending" and payment is collected on delivery.

### Frontend Integration

Add Stripe to your checkout page:
```html
<!-- Add to checkout.html or index.html -->
<script src="https://js.stripe.com/v3/"></script>
<script>
const stripe = Stripe('YOUR_PUBLISHABLE_KEY');

// Create payment intent
fetch('/api/payments/stripe/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: totalAmount })
})
.then(res => res.json())
.then(data => {
    // Use Stripe Elements or redirect to checkout
    stripe.confirmCardPayment(data.data.clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: { name: customerName }
        }
    });
});
</script>
```

---

## 2. Email Notifications

### Option A: SendGrid (Recommended)

#### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com
2. Create a free account (100 emails/day)
3. Verify your sender identity

#### Step 2: Get API Key
1. Go to Settings > API Keys
2. Create new API key with "Mail Send" permissions
3. Copy the key

#### Step 3: Configure Environment
```bash
# Add to .env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

#### Step 4: Install SendGrid SDK (Production)
```bash
npm install @sendgrid/mail
```

#### Step 5: Uncomment Production Code
In `server/services/emailService.js`, uncomment the SendGrid implementation.

#### Step 6: Test Email
```bash
# Create an order to trigger confirmation email
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "items": [...]
  }'
```

### Option B: SMTP (Gmail, etc.)

#### Step 1: Enable App Password (Gmail)
1. Go to Google Account > Security
2. Enable 2-factor authentication
3. Generate App Password

#### Step 2: Configure Environment
```bash
# Add to .env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
SMTP_FROM="OliverSales" <noreply@yourdomain.com>
FRONTEND_URL=https://yourdomain.com
```

#### Step 3: Install Nodemailer (Production)
```bash
npm install nodemailer
```

#### Step 4: Uncomment Production Code
In `server/services/emailService.js`, uncomment the SMTP implementation.

### Development Mode (Console Logging)

By default, emails are logged to console in development:
```bash
# No setup required
EMAIL_PROVIDER=console
```

### Email Templates Available

1. **Order Confirmation**
   - Triggered: When order is created
   - Includes: Order details, items, total, tracking link

2. **Shipping Notification**
   - Triggered: When order status changes to "Shipped"
   - Includes: Tracking number, carrier, estimated delivery

3. **Welcome Email**
   - Triggered: When user subscribes to newsletter
   - Includes: Welcome message, benefits, shop link

4. **Newsletter**
   - Triggered: Manually or scheduled
   - Includes: Custom content, unsubscribe link

### Customize Email Templates

Edit templates in `server/services/emailService.js`:
```javascript
_generateOrderConfirmationHTML(orderData) {
    // Customize HTML template here
    return `<html>...</html>`;
}
```

---

## 3. Deployment Configurations

### Option A: Heroku (Easiest)

#### Step 1: Install Heroku CLI
```bash
# macOS
brew install heroku/brew/heroku

# Windows
choco install heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### Step 2: Create App
```bash
heroku login
heroku create olivershop-app
```

#### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set ALLOWED_ORIGINS=https://your-frontend-domain.com
heroku config:set FRONTEND_URL=https://your-frontend-domain.com

# Add email config
heroku config:set EMAIL_PROVIDER=sendgrid
heroku config:set SENDGRID_API_KEY=your_key

# Add payment config
heroku config:set STRIPE_SECRET_KEY=your_key
```

#### Step 4: Deploy
```bash
git push heroku copilot/implement-missing-functionality:main
```

#### Step 5: Initialize Database
```bash
heroku run npm run init-db
```

#### Step 6: Open App
```bash
heroku open
```

**Configuration File**: `Procfile` (already created)

### Option B: Railway

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login & Init
```bash
railway login
railway init
```

#### Step 3: Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set EMAIL_PROVIDER=sendgrid
railway variables set SENDGRID_API_KEY=your_key
```

#### Step 4: Deploy
```bash
railway up
```

**Configuration File**: `railway.json` (already created)

### Option C: Vercel (API only)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
vercel --prod
```

#### Step 3: Set Environment Variables
```bash
vercel env add NODE_ENV production
vercel env add JWT_SECRET your-secret
vercel env add EMAIL_PROVIDER sendgrid
```

**Configuration File**: `vercel.json` (already created)

### Option D: DigitalOcean

See `DEPLOYMENT_GUIDE.md` for complete DigitalOcean setup with nginx and SSL.

### Option E: AWS

#### For Elastic Beanstalk:
1. Install EB CLI: `pip install awsebcli`
2. Initialize: `eb init`
3. Create environment: `eb create olivershop-env`
4. Deploy: `eb deploy`

---

## Testing All Features

### 1. Test Backend
```bash
npm start
```

### 2. Test Payments
```bash
# Stripe
curl -X POST http://localhost:3000/api/payments/stripe/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.00}'

# PayPal
curl -X POST http://localhost:3000/api/payments/paypal/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.00}'

# COD
curl -X POST http://localhost:3000/api/payments/cod/create-order \
  -H "Content-Type: application/json" \
  -d '{"orderId": "ORD-123", "amount": 100.00}'
```

### 3. Test Emails
```bash
# Order confirmation (automatically sent when creating order)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "address": "123 Main St",
    "city": "NYC",
    "state": "NY",
    "zip_code": "10001",
    "phone": "555-1234",
    "payment_method": "Credit Card",
    "items": [{"name": "Test", "quantity": 1, "price": 10}],
    "subtotal": 10,
    "shipping": 5,
    "total": 15
  }'

# Newsletter welcome (automatically sent when subscribing)
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "subscriber@example.com"}'
```

Check console for email output (development mode) or your inbox (production).

---

## Production Checklist

### Security
- [ ] Change JWT_SECRET to secure random string
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for your domain only
- [ ] Use environment-specific API keys (live, not test)
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)

### Database
- [ ] Migrate from SQLite to PostgreSQL/MySQL
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Add database indexes

### Email
- [ ] Verify sender domain
- [ ] Set up DKIM/SPF records
- [ ] Configure unsubscribe links
- [ ] Test all email templates
- [ ] Monitor delivery rates

### Payments
- [ ] Switch to live API keys
- [ ] Test with real transactions
- [ ] Configure webhook endpoints
- [ ] Set up payment failure notifications
- [ ] Add refund functionality

### Performance
- [ ] Enable gzip compression
- [ ] Add caching headers
- [ ] Use CDN for static assets
- [ ] Optimize database queries
- [ ] Add load balancing

---

## Support Resources

### Stripe
- Documentation: https://stripe.com/docs
- Testing cards: https://stripe.com/docs/testing

### PayPal
- Documentation: https://developer.paypal.com/docs
- Sandbox: https://developer.paypal.com/dashboard

### SendGrid
- Documentation: https://docs.sendgrid.com
- API Reference: https://docs.sendgrid.com/api-reference

### Deployment
- Heroku: https://devcenter.heroku.com
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs

---

**All three features are now configured and ready to use!** 🎉

For questions or issues:
1. Check console logs for errors
2. Verify environment variables
3. Test API endpoints individually
4. Review configuration files
5. Check provider status pages
