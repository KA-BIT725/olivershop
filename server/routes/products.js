const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/connection');

// GET all products
router.get('/', (req, res) => {
    try {
        const db = getDatabase();
        const { category, minPrice, maxPrice, search, sort = 'featured', page = 1, limit = 12 } = req.query;
        
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        // Filter by category
        if (category && category !== 'all') {
            query += ' AND category = ?';
            params.push(category);
        }

        // Filter by price range
        if (minPrice) {
            query += ' AND price >= ?';
            params.push(parseFloat(minPrice));
        }
        if (maxPrice) {
            query += ' AND price <= ?';
            params.push(parseFloat(maxPrice));
        }

        // Search functionality
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // Sorting
        switch (sort) {
            case 'price-low':
                query += ' ORDER BY price ASC';
                break;
            case 'price-high':
                query += ' ORDER BY price DESC';
                break;
            case 'newest':
                query += ' ORDER BY created_at DESC';
                break;
            case 'rating':
                query += ' ORDER BY rating DESC';
                break;
            default:
                query += ' ORDER BY id ASC';
        }

        // Get total count for pagination
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const totalResult = db.prepare(countQuery).get(...params);
        const total = totalResult.total;

        // Add pagination
        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const products = db.prepare(query).all(...params);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
});

// GET single product by ID
router.get('/:id', (req, res) => {
    try {
        const db = getDatabase();
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
});

// GET product reviews
router.get('/:id/reviews', (req, res) => {
    try {
        const db = getDatabase();
        const reviews = db.prepare(`
            SELECT r.*, u.first_name, u.last_name 
            FROM reviews r
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `).all(req.params.id);

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch reviews'
        });
    }
});

// POST add product review
router.post('/:id/reviews', (req, res) => {
    try {
        const db = getDatabase();
        const { user_id, rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: 'Rating must be between 1 and 5'
            });
        }

        const result = db.prepare(`
            INSERT INTO reviews (product_id, user_id, rating, comment)
            VALUES (?, ?, ?, ?)
        `).run(req.params.id, user_id || null, rating, comment || null);

        // Update product rating and review count
        db.prepare(`
            UPDATE products 
            SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?),
                review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(req.params.id, req.params.id, req.params.id);

        res.status(201).json({
            success: true,
            data: { id: result.lastInsertRowid }
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add review'
        });
    }
});

// GET categories
router.get('/categories/list', (req, res) => {
    try {
        const db = getDatabase();
        const categories = db.prepare('SELECT DISTINCT category FROM products').all();
        
        res.json({
            success: true,
            data: categories.map(c => c.category)
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

module.exports = router;
