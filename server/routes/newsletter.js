const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/connection');

// GET all newsletter subscribers
router.get('/', (req, res) => {
    try {
        const db = getDatabase();
        const subscribers = db.prepare('SELECT * FROM newsletter_subscribers WHERE is_active = 1 ORDER BY subscribed_at DESC').all();

        res.json({
            success: true,
            data: subscribers
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch subscribers'
        });
    }
});

// POST subscribe to newsletter
router.post('/subscribe', (req, res) => {
    try {
        const db = getDatabase();
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Check if already subscribed
        const existing = db.prepare('SELECT * FROM newsletter_subscribers WHERE email = ?').get(email);
        
        if (existing) {
            if (existing.is_active) {
                return res.status(409).json({
                    success: false,
                    error: 'Email already subscribed'
                });
            } else {
                // Reactivate subscription
                db.prepare('UPDATE newsletter_subscribers SET is_active = 1 WHERE email = ?').run(email);
                return res.json({
                    success: true,
                    message: 'Subscription reactivated'
                });
            }
        }

        // Add new subscriber
        const result = db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email);

        res.status(201).json({
            success: true,
            data: { id: result.lastInsertRowid },
            message: 'Successfully subscribed to newsletter'
        });
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to subscribe to newsletter'
        });
    }
});

// POST unsubscribe from newsletter
router.post('/unsubscribe', (req, res) => {
    try {
        const db = getDatabase();
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        db.prepare('UPDATE newsletter_subscribers SET is_active = 0 WHERE email = ?').run(email);

        res.json({
            success: true,
            message: 'Successfully unsubscribed from newsletter'
        });
    } catch (error) {
        console.error('Error unsubscribing from newsletter:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to unsubscribe from newsletter'
        });
    }
});

module.exports = router;
