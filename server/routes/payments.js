const express = require('express');
const router = express.Router();

// Note: In production, install stripe package: npm install stripe
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Payment Gateway Routes
 * 
 * This module provides payment processing endpoints for:
 * - Stripe (Credit Card)
 * - PayPal
 * - Cash on Delivery (COD)
 */

// Create Stripe Payment Intent
router.post('/stripe/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', metadata = {} } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount'
            });
        }

        // For development/demo: Return mock payment intent
        if (process.env.NODE_ENV !== 'production' || !process.env.STRIPE_SECRET_KEY) {
            return res.json({
                success: true,
                data: {
                    clientSecret: 'pi_mock_secret_' + Date.now(),
                    paymentIntentId: 'pi_mock_' + Date.now(),
                    amount: amount,
                    currency: currency,
                    status: 'requires_payment_method'
                },
                message: 'Mock payment intent created (development mode)'
            });
        }

        // Production code (uncomment when Stripe is configured):
        /*
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency,
            metadata: metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status
            }
        });
        */

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment intent'
        });
    }
});

// Confirm Stripe Payment
router.post('/stripe/confirm-payment', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                error: 'Payment intent ID is required'
            });
        }

        // For development/demo
        if (process.env.NODE_ENV !== 'production' || !process.env.STRIPE_SECRET_KEY) {
            return res.json({
                success: true,
                data: {
                    paymentIntentId: paymentIntentId,
                    status: 'succeeded',
                    amount: 0,
                    currency: 'usd'
                },
                message: 'Mock payment confirmed (development mode)'
            });
        }

        // Production code:
        /*
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.json({
            success: true,
            data: {
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency
            }
        });
        */

    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to confirm payment'
        });
    }
});

// Create PayPal Order
router.post('/paypal/create-order', async (req, res) => {
    try {
        const { amount, currency = 'USD' } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount'
            });
        }

        // For development/demo
        if (process.env.NODE_ENV !== 'production' || !process.env.PAYPAL_CLIENT_ID) {
            return res.json({
                success: true,
                data: {
                    orderId: 'PAYPAL_MOCK_' + Date.now(),
                    amount: amount,
                    currency: currency,
                    status: 'CREATED'
                },
                message: 'Mock PayPal order created (development mode)'
            });
        }

        // Production code (requires paypal-rest-sdk):
        /*
        const paypal = require('paypal-rest-sdk');
        
        paypal.configure({
            'mode': process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
            'client_id': process.env.PAYPAL_CLIENT_ID,
            'client_secret': process.env.PAYPAL_SECRET
        });

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": process.env.FRONTEND_URL + "/payment/success",
                "cancel_url": process.env.FRONTEND_URL + "/payment/cancel"
            },
            "transactions": [{
                "amount": {
                    "currency": currency,
                    "total": amount.toFixed(2)
                },
                "description": "OliverSales Purchase"
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                res.json({
                    success: true,
                    data: {
                        orderId: payment.id,
                        approvalUrl: payment.links.find(link => link.rel === 'approval_url').href
                    }
                });
            }
        });
        */

    } catch (error) {
        console.error('Error creating PayPal order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create PayPal order'
        });
    }
});

// Capture PayPal Payment
router.post('/paypal/capture-payment', async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                error: 'Order ID is required'
            });
        }

        // For development/demo
        if (process.env.NODE_ENV !== 'production' || !process.env.PAYPAL_CLIENT_ID) {
            return res.json({
                success: true,
                data: {
                    orderId: orderId,
                    status: 'COMPLETED',
                    captureId: 'CAPTURE_MOCK_' + Date.now()
                },
                message: 'Mock PayPal payment captured (development mode)'
            });
        }

        // Production code:
        /*
        const paypal = require('paypal-rest-sdk');
        
        paypal.payment.execute(orderId, { payer_id: req.body.payerId }, function (error, payment) {
            if (error) {
                throw error;
            } else {
                res.json({
                    success: true,
                    data: {
                        orderId: payment.id,
                        status: payment.state,
                        captureId: payment.transactions[0].related_resources[0].sale.id
                    }
                });
            }
        });
        */

    } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to capture PayPal payment'
        });
    }
});

// Process Cash on Delivery
router.post('/cod/create-order', async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        if (!orderId || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Order ID and amount are required'
            });
        }

        // COD doesn't require payment processing
        // Just mark the order as COD payment pending
        res.json({
            success: true,
            data: {
                orderId: orderId,
                paymentMethod: 'COD',
                amount: amount,
                status: 'pending',
                message: 'Order placed successfully. Payment will be collected on delivery.'
            }
        });

    } catch (error) {
        console.error('Error processing COD order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process COD order'
        });
    }
});

// Webhook endpoint for Stripe events
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        
        if (process.env.NODE_ENV !== 'production' || !process.env.STRIPE_WEBHOOK_SECRET) {
            console.log('Mock webhook received (development mode)');
            return res.json({ received: true });
        }

        // Production code:
        /*
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('PaymentIntent was successful!', paymentIntent.id);
                // Update order status in database
                break;
            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('Payment failed:', failedPayment.id);
                // Handle failed payment
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        */

        res.json({ received: true });

    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({
            success: false,
            error: 'Webhook processing failed'
        });
    }
});

module.exports = router;
