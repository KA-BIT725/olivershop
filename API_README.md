# OliverSales E-Commerce Backend API

Backend server for the OliverSales kids' clothing e-commerce platform.

## Tech Stack

- **Node.js** with Express.js
- **SQLite** database (better-sqlite3)
- **JWT** authentication
- **bcrypt** password hashing

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
npm run init-db
```

This will create the SQLite database and seed it with 24 products.

### 3. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Products

- `GET /api/products` - Get all products (with filtering, search, pagination)
  - Query params: `category`, `minPrice`, `maxPrice`, `search`, `sort`, `page`, `limit`
- `GET /api/products/:id` - Get single product
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/categories/list` - Get all categories

### Orders

- `GET /api/orders` - Get all orders (filter by user_id or email)
- `GET /api/orders/:identifier` - Get order by ID or order number
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile
- `PATCH /api/users/profile/:id` - Update user profile

### Wishlist

- `GET /api/wishlist` - Get wishlist items (requires user_id or session_id)
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist
- `DELETE /api/wishlist/product/:product_id` - Remove product from wishlist

### Newsletter

- `GET /api/newsletter` - Get all subscribers
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./server/database/olivershop.db
JWT_SECRET=your-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

## Database Schema

### Tables

- **users** - User accounts
- **products** - Product catalog
- **orders** - Customer orders
- **order_items** - Items in each order
- **wishlist** - User wishlists
- **newsletter_subscribers** - Newsletter subscriptions
- **reviews** - Product reviews

## Integration with Frontend

The frontend can be updated to use the API by replacing localStorage calls with API requests:

```javascript
// Example: Fetch products
fetch('http://localhost:3000/api/products?category=tops&page=1&limit=12')
  .then(res => res.json())
  .then(data => {
    console.log(data.data); // Products array
    console.log(data.pagination); // Pagination info
  });

// Example: Create order
fetch('http://localhost:3000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'customer@example.com',
    first_name: 'John',
    last_name: 'Doe',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    phone: '555-1234',
    payment_method: 'Credit Card',
    items: [...],
    subtotal: 99.99,
    shipping: 5.99,
    total: 105.98
  })
})
.then(res => res.json())
.then(data => console.log('Order created:', data));
```

## Payment Gateway Integration

To integrate payment processing:

1. **Stripe**: Add Stripe SDK and use their API
2. **PayPal**: Add PayPal SDK and use their REST API
3. Update `.env` with your API keys
4. Create payment route in `server/routes/payments.js`

## Production Deployment

### Options:

1. **Heroku**: Easy deployment with free tier
2. **DigitalOcean**: VPS with more control
3. **AWS**: Scalable cloud infrastructure
4. **Vercel/Netlify**: Frontend + Serverless functions

### Steps:

1. Change `JWT_SECRET` to a secure random string
2. Set `NODE_ENV=production`
3. Use PostgreSQL or MySQL instead of SQLite for production
4. Set up SSL/TLS
5. Configure CORS for your domain
6. Set up monitoring and logging

## API Testing

Test the API using curl, Postman, or any HTTP client:

```bash
# Health check
curl http://localhost:3000/api/health

# Get products
curl http://localhost:3000/api/products

# Subscribe to newsletter
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## License

MIT License
