const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/connection');

// GET wishlist items
router.get('/', (req, res) => {
    try {
        const db = getDatabase();
        const { user_id, session_id } = req.query;

        if (!user_id && !session_id) {
            return res.status(400).json({
                success: false,
                error: 'user_id or session_id is required'
            });
        }

        let query = `
            SELECT w.*, p.name, p.price, p.image_url, p.rating, p.review_count
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE 1=1
        `;
        const params = [];

        if (user_id) {
            query += ' AND w.user_id = ?';
            params.push(user_id);
        } else if (session_id) {
            query += ' AND w.session_id = ?';
            params.push(session_id);
        }

        query += ' ORDER BY w.created_at DESC';

        const wishlistItems = db.prepare(query).all(...params);

        res.json({
            success: true,
            data: wishlistItems
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch wishlist'
        });
    }
});

// POST add item to wishlist
router.post('/', (req, res) => {
    try {
        const db = getDatabase();
        const { user_id, session_id, product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                error: 'product_id is required'
            });
        }

        if (!user_id && !session_id) {
            return res.status(400).json({
                success: false,
                error: 'user_id or session_id is required'
            });
        }

        // Check if product exists
        const product = db.prepare('SELECT id FROM products WHERE id = ?').get(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Check if already in wishlist
        let checkQuery = 'SELECT id FROM wishlist WHERE product_id = ?';
        const checkParams = [product_id];
        
        if (user_id) {
            checkQuery += ' AND user_id = ?';
            checkParams.push(user_id);
        } else {
            checkQuery += ' AND session_id = ?';
            checkParams.push(session_id);
        }

        const existing = db.prepare(checkQuery).get(...checkParams);
        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'Product already in wishlist'
            });
        }

        // Add to wishlist
        const result = db.prepare(`
            INSERT INTO wishlist (user_id, session_id, product_id)
            VALUES (?, ?, ?)
        `).run(user_id || null, session_id || null, product_id);

        res.status(201).json({
            success: true,
            data: { id: result.lastInsertRowid }
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add to wishlist'
        });
    }
});

// DELETE remove item from wishlist
router.delete('/:id', (req, res) => {
    try {
        const db = getDatabase();
        
        db.prepare('DELETE FROM wishlist WHERE id = ?').run(req.params.id);

        res.json({
            success: true,
            message: 'Item removed from wishlist'
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove from wishlist'
        });
    }
});

// DELETE remove by product_id
router.delete('/product/:product_id', (req, res) => {
    try {
        const db = getDatabase();
        const { user_id, session_id } = req.query;

        if (!user_id && !session_id) {
            return res.status(400).json({
                success: false,
                error: 'user_id or session_id is required'
            });
        }

        let query = 'DELETE FROM wishlist WHERE product_id = ?';
        const params = [req.params.product_id];

        if (user_id) {
            query += ' AND user_id = ?';
            params.push(user_id);
        } else {
            query += ' AND session_id = ?';
            params.push(session_id);
        }

        db.prepare(query).run(...params);

        res.json({
            success: true,
            message: 'Product removed from wishlist'
        });
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove product from wishlist'
        });
    }
});

module.exports = router;
