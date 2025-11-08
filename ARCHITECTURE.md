# OliverSales - Complete Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  HTML5   │  │   CSS3   │  │JavaScript│  │LocalStorage│  │
│  │  Pages   │  │  Styles  │  │   ES6+   │  │   Cache   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       │              │              │              │        │
│       └──────────────┴──────────────┴──────────────┘       │
│                          │                                   │
│                    js/api.js (API Helper)                   │
│                          │                                   │
└──────────────────────────┼─────────────────────────────────┘
                           │
                     HTTP REST API
                           │
┌──────────────────────────┼─────────────────────────────────┐
│                   Backend API Server                         │
│                          │                                   │
│              ┌───────────┴───────────┐                      │
│              │   Express.js Server   │                      │
│              │    (Node.js 16+)      │                      │
│              └───────────┬───────────┘                      │
│                          │                                   │
│         ┌────────────────┼────────────────┐                │
│         │                │                │                 │
│    ┌────▼─────┐    ┌────▼─────┐    ┌────▼─────┐          │
│    │ Products │    │  Orders  │    │  Users   │          │
│    │   API    │    │   API    │    │   API    │          │
│    └────┬─────┘    └────┬─────┘    └────┬─────┘          │
│         │                │                │                 │
│    ┌────▼─────┐    ┌────▼─────┐                           │
│    │Wishlist  │    │Newsletter│                           │
│    │   API    │    │   API    │                           │
│    └────┬─────┘    └────┬─────┘                           │
│         │                │                                  │
│         └────────────────┼────────────────────────┐        │
│                          │                         │        │
│              ┌───────────▼────────────┐           │        │
│              │   SQLite Database      │           │        │
│              │  (olivershop.db)       │           │        │
│              └────────────────────────┘           │        │
│                                                    │        │
│  Tables: users, products, orders, order_items,   │        │
│          wishlist, newsletter_subscribers, reviews │       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Browse Products
```
User → shop.html → js/shop.js → js/api.js 
  → GET /api/products?category=tops&page=1&limit=12
  → SQLite products table → JSON response → Display
```

### 2. Add to Cart
```
User clicks "Add to Cart" → js/script.js 
  → localStorage.setItem('cart', JSON.stringify(cart))
  → Cart badge updates
```

### 3. Checkout
```
User → Cart → Checkout Form → js/script.js → js/api.js
  → POST /api/orders (with items, address, payment)
  → SQLite orders & order_items tables
  → Order confirmation with order number
```

### 4. View Orders
```
User → orders.html → js/orders.js → js/api.js
  → GET /api/orders?email=user@example.com
  → SQLite orders table → JSON response → Display order history
```

### 5. Add to Wishlist
```
User → Product Modal → "Add to Wishlist"
  → js/script.js → js/api.js
  → POST /api/wishlist {product_id, session_id}
  → SQLite wishlist table
```

### 6. Newsletter Signup
```
User → index.html → Newsletter Form → js/script.js
  → js/api.js → POST /api/newsletter/subscribe
  → SQLite newsletter_subscribers table
```

## API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products with filters |
| GET | `/api/products/:id` | Get single product details |
| POST | `/api/products/:id/reviews` | Add product review |
| GET | `/api/orders` | Get user orders |
| POST | `/api/orders` | Create new order |
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user (JWT) |
| GET | `/api/wishlist` | Get wishlist items |
| POST | `/api/wishlist` | Add to wishlist |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |

## Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, Variables
- **Vanilla JavaScript** - ES6+ features
- **LocalStorage** - Client-side caching
- **Font Awesome** - Icons
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js v16+** - JavaScript runtime
- **Express.js 4.18** - Web framework
- **better-sqlite3** - SQLite driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Database
- **SQLite** - Embedded database
- **7 tables** - Normalized schema
- **Transactions** - ACID compliance
- **Foreign keys** - Referential integrity

## Development Workflow

1. **Frontend Development**
   ```bash
   # Open index.html in browser
   # Or use a static server
   python3 -m http.server 8000
   ```

2. **Backend Development**
   ```bash
   npm install          # Install dependencies
   npm run init-db      # Create database
   npm run dev          # Start with nodemon
   ```

3. **Full Stack Testing**
   ```bash
   # Terminal 1: Backend
   npm run dev
   
   # Terminal 2: Frontend
   python3 -m http.server 8000
   
   # Browser: http://localhost:8000
   ```

## Deployment Options

### Frontend
- **GitHub Pages** - Free static hosting
- **Netlify** - Free with CI/CD
- **Vercel** - Free with edge network
- **AWS S3 + CloudFront** - Scalable CDN

### Backend
- **Heroku** - Free tier, easy deploy
- **Railway** - Modern deployment
- **DigitalOcean** - $5/month VPS
- **AWS EC2** - Scalable compute
- **Render** - Free tier available

### Database
- **Development**: SQLite (embedded)
- **Production**: PostgreSQL or MySQL
- **Migration**: Simple SQL schema update

## Security Features

✅ **Password Security**: bcrypt with 10 salt rounds
✅ **Authentication**: JWT tokens with expiry
✅ **SQL Injection**: Parameterized queries
✅ **XSS Protection**: Input sanitization
✅ **CORS**: Configurable origins
✅ **Environment Variables**: Sensitive data in .env
✅ **HTTPS Ready**: SSL/TLS support

## Performance

- **Database**: Indexed primary keys
- **API**: Efficient SQL queries
- **Frontend**: Lazy loading, caching
- **Assets**: Minification ready
- **CDN**: Static file serving

## Monitoring & Logging

```javascript
// Add to server/index.js
const morgan = require('morgan');
app.use(morgan('combined'));

// Add error tracking
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Future Enhancements

- [ ] Real-time inventory updates (WebSocket)
- [ ] Email notifications (SendGrid/Mailgun)
- [ ] SMS notifications (Twilio)
- [ ] Advanced analytics (Google Analytics)
- [ ] Search optimization (Elasticsearch)
- [ ] Image optimization (Cloudinary)
- [ ] Rate limiting (express-rate-limit)
- [ ] API documentation (Swagger)
- [ ] Unit tests (Jest)
- [ ] E2E tests (Playwright)

## Getting Help

- **API Docs**: See `API_README.md`
- **Frontend Guide**: See `README.md`
- **Database**: See `server/database/init.js`
- **Environment**: See `.env` file

---

**🎉 Complete full-stack e-commerce platform ready for production!**
