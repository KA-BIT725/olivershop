const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const emailService = require('../services/emailService');

// GET all orders (with optional user filter)
router.get('/', (req, res) => {
    try {
        const db = getDatabase();
        const { user_id, email } = req.query;
        
        let query = 'SELECT * FROM orders WHERE 1=1';
        const params = [];

        if (user_id) {
            query += ' AND user_id = ?';
            params.push(user_id);
        }

        if (email) {
            query += ' AND email = ?';
            params.push(email);
        }

        query += ' ORDER BY created_at DESC';

        const orders = db.prepare(query).all(...params);

        // Get order items for each order
        const ordersWithItems = orders.map(order => {
            const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
            return { ...order, items };
        });

        res.json({
            success: true,
            data: ordersWithItems
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
});

// GET single order by ID or order number
router.get('/:identifier', (req, res) => {
    try {
        const db = getDatabase();
        const { identifier } = req.params;
        
        // Check if identifier is a number (ID) or string (order number)
        const isId = !isNaN(identifier);
        const query = isId 
            ? 'SELECT * FROM orders WHERE id = ?'
            : 'SELECT * FROM orders WHERE order_number = ?';
        
        const order = db.prepare(query).get(identifier);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Get order items
        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
        
        res.json({
            success: true,
            data: { ...order, items }
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order'
        });
    }
});

// POST create new order
router.post('/', async (req, res) => {
    try {
        const db = getDatabase();
        const {
            user_id,
            email,
            first_name,
            last_name,
            address,
            city,
            state,
            zip_code,
            phone,
            payment_method,
            items,
            subtotal,
            shipping,
            total
        } = req.body;

        // Validate required fields
        if (!email || !first_name || !last_name || !address || !city || !state || !zip_code || !phone) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Order must contain at least one item'
            });
        }

        // Generate unique order number
        const orderNumber = `ORD-${Date.now()}`;

        // Start transaction
        const insertOrder = db.transaction((orderData, orderItems) => {
            // Insert order
            const orderResult = db.prepare(`
                INSERT INTO orders (
                    user_id, order_number, email, first_name, last_name,
                    address, city, state, zip_code, phone, payment_method,
                    subtotal, shipping, total, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                orderData.user_id || null,
                orderData.order_number,
                orderData.email,
                orderData.first_name,
                orderData.last_name,
                orderData.address,
                orderData.city,
                orderData.state,
                orderData.zip_code,
                orderData.phone,
                orderData.payment_method,
                orderData.subtotal,
                orderData.shipping,
                orderData.total,
                'Processing'
            );

            const orderId = orderResult.lastInsertRowid;

            // Insert order items
            const insertItem = db.prepare(`
                INSERT INTO order_items (
                    order_id, product_id, product_name, price, quantity, size, color
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            for (const item of orderItems) {
                // Extract product ID from item name if it contains size/color
                const productId = item.product_id || item.id || 0;
                const productName = item.name || item.product_name;
                const price = parseFloat(String(item.price).replace('$', ''));
                
                insertItem.run(
                    orderId,
                    productId,
                    productName,
                    price,
                    item.quantity,
                    item.size || null,
                    item.color || null
                );
            }

            return orderId;
        });

        const orderId = insertOrder(
            {
                user_id,
                order_number: orderNumber,
                email,
                first_name,
                last_name,
                address,
                city,
                state,
                zip_code,
                phone,
                payment_method,
                subtotal,
                shipping,
                total
            },
            items
        );

        // Send order confirmation email
        try {
            await emailService.sendOrderConfirmation({
                email,
                orderNumber,
                firstName: first_name,
                items,
                total,
                subtotal,
                shipping
            });
            console.log(`Order confirmation email sent to ${email}`);
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Don't fail the order creation if email fails
        }

        res.status(201).json({
            success: true,
            data: {
                order_id: orderId,
                order_number: orderNumber
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create order',
            details: error.message
        });
    }
});

// PATCH update order status
router.patch('/:id/status', (req, res) => {
    try {
        const db = getDatabase();
        const { status } = req.body;
        
        const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        db.prepare(`
            UPDATE orders 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `).run(status, req.params.id);

        res.json({
            success: true,
            message: 'Order status updated'
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update order status'
        });
    }
});

module.exports = router;
