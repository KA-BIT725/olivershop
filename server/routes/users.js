const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST register new user
router.post('/register', async (req, res) => {
    try {
        const db = getDatabase();
        const { email, password, first_name, last_name, phone } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Check if user already exists
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User already exists with this email'
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert user
        const result = db.prepare(`
            INSERT INTO users (email, password_hash, first_name, last_name, phone)
            VALUES (?, ?, ?, ?, ?)
        `).run(email, password_hash, first_name || null, last_name || null, phone || null);

        // Generate JWT token
        const token = jwt.sign(
            { user_id: result.lastInsertRowid, email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            data: {
                user_id: result.lastInsertRowid,
                email,
                token
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to register user'
        });
    }
});

// POST login user
router.post('/login', async (req, res) => {
    try {
        const db = getDatabase();
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Find user
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                user_id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                token
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to login'
        });
    }
});

// GET user profile
router.get('/profile/:id', (req, res) => {
    try {
        const db = getDatabase();
        const user = db.prepare(`
            SELECT id, email, first_name, last_name, phone, created_at 
            FROM users WHERE id = ?
        `).get(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user profile'
        });
    }
});

// PATCH update user profile
router.patch('/profile/:id', (req, res) => {
    try {
        const db = getDatabase();
        const { first_name, last_name, phone } = req.body;

        db.prepare(`
            UPDATE users 
            SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(first_name, last_name, phone, req.params.id);

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update profile'
        });
    }
});

module.exports = router;
