const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'olivershop.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
    console.log('🗄️  Initializing database...');

    // Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            phone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Products table
    db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            image_url TEXT,
            rating REAL DEFAULT 0,
            review_count INTEGER DEFAULT 0,
            stock INTEGER DEFAULT 0,
            sizes TEXT,
            colors TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Orders table
    db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            order_number TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            zip_code TEXT NOT NULL,
            phone TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            subtotal REAL NOT NULL,
            shipping REAL NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'Processing',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Order items table
    db.exec(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            size TEXT,
            color TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `);

    // Wishlist table
    db.exec(`
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            session_id TEXT,
            product_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
    `);

    // Newsletter subscribers table
    db.exec(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    `);

    // Reviews table
    db.exec(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            user_id INTEGER,
            rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
    `);

    console.log('✅ Database schema created successfully');
    
    // Seed initial products
    seedProducts();
}

// Seed products with data from frontend
function seedProducts() {
    const checkProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
    
    if (checkProducts.count > 0) {
        console.log('📦 Products already exist, skipping seed');
        return;
    }

    console.log('🌱 Seeding products...');

    const products = [
        { name: "Organic Cotton T-Shirt", price: 24.99, category: "tops", rating: 4.5, reviews: 127, stock: 50, description: "Soft organic cotton t-shirt for everyday comfort" },
        { name: "Comfortable Shorts", price: 19.99, category: "bottoms", rating: 4.8, reviews: 95, stock: 40, description: "Breathable shorts perfect for active kids" },
        { name: "Summer Dress", price: 34.99, category: "dresses", rating: 4.7, reviews: 203, stock: 30, description: "Light and airy summer dress" },
        { name: "Cozy Romper", price: 29.99, category: "new", rating: 4.6, reviews: 88, stock: 25, description: "One-piece romper for easy wear" },
        { name: "Striped Polo Shirt", price: 26.99, category: "tops", rating: 4.3, reviews: 67, stock: 35, description: "Classic polo with modern stripes" },
        { name: "Denim Jeans", price: 32.99, category: "bottoms", rating: 4.9, reviews: 156, stock: 45, description: "Durable denim for everyday adventures" },
        { name: "Flower Print Dress", price: 38.99, category: "dresses", rating: 4.7, reviews: 112, stock: 20, description: "Beautiful floral pattern dress" },
        { name: "Cozy Hoodie", price: 42.99, category: "new", rating: 4.8, reviews: 145, stock: 30, description: "Warm and comfortable hoodie" },
        { name: "Basic Tee Pack (3)", price: 39.99, category: "tops", rating: 4.6, reviews: 234, stock: 60, description: "Value pack of 3 essential tees" },
        { name: "Cargo Pants", price: 29.99, category: "bottoms", rating: 4.4, reviews: 78, stock: 35, description: "Practical cargo pants with pockets" },
        { name: "Party Dress", price: 45.99, category: "dresses", rating: 4.9, reviews: 189, stock: 15, description: "Special occasion party dress" },
        { name: "Sleep Set", price: 35.99, category: "new", rating: 4.7, reviews: 92, stock: 40, description: "Comfortable sleepwear set" },
        { name: "Graphic Tee", price: 22.99, category: "tops", rating: 4.5, reviews: 167, stock: 50, description: "Fun graphic print t-shirt" },
        { name: "Swim Shorts", price: 24.99, category: "bottoms", rating: 4.6, reviews: 121, stock: 30, description: "Quick-dry swim shorts" },
        { name: "Casual Dress", price: 31.99, category: "dresses", rating: 4.4, reviews: 98, stock: 25, description: "Versatile casual dress" },
        { name: "Winter Jacket", price: 54.99, category: "new", rating: 4.8, reviews: 176, stock: 20, description: "Warm winter jacket" },
        { name: "Long Sleeve Shirt", price: 28.99, category: "tops", rating: 4.5, reviews: 89, stock: 40, description: "Classic long sleeve shirt" },
        { name: "Leggings", price: 18.99, category: "bottoms", rating: 4.7, reviews: 213, stock: 55, description: "Stretchy comfortable leggings" },
        { name: "Tutu Dress", price: 42.99, category: "dresses", rating: 4.9, reviews: 156, stock: 18, description: "Adorable tutu-style dress" },
        { name: "Overalls", price: 39.99, category: "new", rating: 4.6, reviews: 134, stock: 25, description: "Classic denim overalls" },
        { name: "Tank Top", price: 16.99, category: "tops", rating: 4.3, reviews: 87, stock: 45, description: "Cool tank top for summer" },
        { name: "Joggers", price: 26.99, category: "bottoms", rating: 4.7, reviews: 198, stock: 40, description: "Comfortable jogger pants" },
        { name: "Maxi Dress", price: 48.99, category: "dresses", rating: 4.8, reviews: 165, stock: 15, description: "Elegant maxi dress" },
        { name: "Sweater Set", price: 44.99, category: "new", rating: 4.6, reviews: 142, stock: 22, description: "Cozy sweater and pants set" }
    ];

    const insert = db.prepare(`
        INSERT INTO products (name, price, category, rating, review_count, stock, description, 
                             sizes, colors, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const sizes = '0-6M,6-12M,1-2Y,2-4Y,4-6Y';
    const colors = 'Beige,Navy,White,Pink,Gray';

    const insertMany = db.transaction((products) => {
        for (const product of products) {
            insert.run(
                product.name,
                product.price,
                product.category,
                product.rating,
                product.reviews,
                product.stock,
                product.description,
                sizes,
                colors,
                `https://images.unsplash.com/photo-${Math.random().toString().slice(2, 15)}?w=600&h=600&fit=crop`
            );
        }
    });

    insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
}

// Run initialization
if (require.main === module) {
    initializeDatabase();
    console.log('✅ Database initialization complete');
    db.close();
}

module.exports = { db, initializeDatabase };
