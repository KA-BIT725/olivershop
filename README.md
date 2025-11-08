# OliverSales E-Commerce Website

A complete, full-stack e-commerce platform for kids' clothing built with Node.js, Express, SQLite, and vanilla JavaScript.

## 🚀 Features

### Frontend
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Shopping Cart** - Add items, manage quantities with +/- controls
- **Complete Checkout** - Multi-step form with payment method selection
- **Product Details** - Size/color selection, ratings, reviews
- **Order Tracking** - View order history and shipping status
- **Wishlist** - Save favorite products
- **Product Ratings** - 5-star system with review counts
- **Pagination** - 12 products per page with smart navigation
- **Newsletter** - Email subscription system
- **Search & Filters** - Category, price range, and search functionality

### Backend API
- **RESTful API** - Complete REST API with Express.js
- **SQLite Database** - Persistent data storage
- **User Authentication** - JWT-based auth with bcrypt
- **Order Management** - Full order processing and tracking
- **Product Catalog** - Advanced filtering and search
- **Wishlist System** - Per-user wishlist management
- **Newsletter** - Subscriber management

## 📁 Project Structure

```
olivershop/
├── index.html              # Homepage
├── shop.html              # Shop page with pagination
├── orders.html            # Order history page
├── wishlist.html          # Wishlist page
├── about.html             # About page
├── contact.html           # Contact page
├── css/
│   └── style.css          # All styling
├── js/
│   ├── script.js          # Main JavaScript (cart, checkout, modals)
│   ├── shop.js            # Shop page functionality
│   ├── orders.js          # Orders page functionality
│   ├── wishlist.js        # Wishlist page functionality
│   ├── contact.js         # Contact form functionality
│   └── api.js             # API integration helpers
├── server/
│   ├── index.js           # Express server
│   ├── database/
│   │   ├── init.js        # Database initialization
│   │   └── connection.js  # Database connection
│   └── routes/
│       ├── products.js    # Product endpoints
│       ├── orders.js      # Order endpoints
│       ├── users.js       # User auth endpoints
│       ├── wishlist.js    # Wishlist endpoints
│       └── newsletter.js  # Newsletter endpoints
├── package.json           # Node.js dependencies
├── .env                   # Environment configuration
├── README.md              # This file
└── API_README.md          # Backend API documentation
```

## 🎨 Current Features

### Complete E-Commerce Functionality

1. **Shopping Experience**
   - 24 products across 4 categories
   - Product quick view modals
   - Size selection (5 options)
   - Color selection (5 colors with swatches)
   - Quantity controls in cart
   - Real-time total calculation

2. **Checkout Process**
   - Contact information form
   - Shipping address collection
   - Payment method selection (Credit Card, PayPal, COD)
   - Order summary with itemized list
   - Shipping cost calculation
   - Order confirmation with unique order number

3. **Order Management**
   - Order history page
   - Order status tracking (Processing, Shipped, Delivered)
   - Timeline visualization
   - Order details modal
   - Carrier tracking information

4. **User Features**
   - Wishlist functionality
   - Move items between wishlist and cart
   - Newsletter subscription
   - Product search and filtering
   - Sort by price, rating, newest

## 🖥️ Quick Start

### Frontend Only (No Backend Required)

1. Open `index.html` in a web browser
2. All features work with localStorage

### With Backend API

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Initialize Database

```bash
npm run init-db
```

This creates the SQLite database and seeds 24 products.

#### 3. Start Backend Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:3000`

#### 4. Open Frontend

Open `index.html` in a browser or use:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve
```

## 🔌 API Integration

The backend API is ready to use. To connect the frontend:

1. Include the API helper:
```html
<script src="js/api.js"></script>
```

2. Use the API methods:
```javascript
// Example: Fetch products
const result = await ProductAPI.getProducts({
    category: 'tops',
    page: 1,
    limit: 12
});

// Example: Create order
const order = await OrderAPI.createOrder({
    email: 'customer@example.com',
    first_name: 'John',
    last_name: 'Doe',
    // ... other fields
    items: cartItems,
    total: 105.98
});
```

See `API_README.md` for complete API documentation.

## 🛠️ Customization

### Change Colors:
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-navy: #1e3a5f;
    --primary-beige: #e8dcc8;
    --accent-brown: #8b6f47;
}
```

### Add/Edit Products:
```bash
# Connect to database
sqlite3 server/database/olivershop.db

# Add product
INSERT INTO products (name, price, category, rating, review_count, stock)
VALUES ('New Product', 29.99, 'tops', 4.5, 50, 100);
```

## 📱 Features Breakdown

### Navigation
- Sticky header
- Mobile-responsive menu
- Cart count badge
- Quick links to Orders and Wishlist

### Product Discovery
- Category filtering
- Price range filtering
- Size filtering
- Keyword search
- Sort by: Featured, Price (Low/High), Newest, Rating
- Pagination (12 products per page)

### Shopping Cart
- Quantity adjustment (+/-)
- Remove items
- Persistent storage
- Live total calculation
- Proceed to checkout

### Checkout
- Multi-step form
- Shipping address
- Payment methods (Card/PayPal/COD)
- Order summary
- Order confirmation

## 🔧 Tech Stack

### Frontend
- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- LocalStorage for offline functionality
- Font Awesome icons
- Unsplash images

### Backend
- Node.js v16+
- Express.js 4.18
- better-sqlite3 (SQLite)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- cors, body-parser

## 📊 Database Schema

- **users** - User accounts with authentication
- **products** - Product catalog (24 pre-seeded items)
- **orders** - Customer orders with full details
- **order_items** - Line items for each order
- **wishlist** - User wishlists
- **newsletter_subscribers** - Email subscriptions
- **reviews** - Product reviews and ratings

## 🚀 Deployment

### Frontend Options:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

### Backend Options:
- Heroku (free tier available)
- DigitalOcean
- AWS EC2
- Railway
- Render

### Production Checklist:
- [ ] Change JWT_SECRET in .env
- [ ] Set NODE_ENV=production
- [ ] Use PostgreSQL/MySQL instead of SQLite
- [ ] Set up SSL/TLS
- [ ] Configure CORS for your domain
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Configure backup strategy

## 🔐 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for authentication
- SQL injection protection (parameterized queries)
- CORS configuration
- Input validation
- XSS protection

## 📝 Environment Variables

Create `.env` file:
```env
PORT=3000
NODE_ENV=development
DB_PATH=./server/database/olivershop.db
JWT_SECRET=your-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

## 🎯 Payment Integration (Ready)

The checkout flow is ready for payment gateways:

### Stripe:
```javascript
// Add Stripe.js
<script src="https://js.stripe.com/v3/"></script>

// In checkout form
const stripe = Stripe('your_publishable_key');
// Handle payment...
```

### PayPal:
```javascript
// Add PayPal SDK
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

// Render PayPal button
paypal.Buttons({...}).render('#paypal-button-container');
```

## 📞 API Endpoints

- `GET /api/products` - List products
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `POST /api/wishlist` - Add to wishlist
- `POST /api/newsletter/subscribe` - Subscribe

See `API_README.md` for full documentation.

## 🔧 Browser Compatibility

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ for OliverSales**

For backend API details, see [API_README.md](API_README.md)
