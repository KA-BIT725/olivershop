/**
 * Email Service
 * 
 * Handles sending transactional emails for:
 * - Order confirmations
 * - Shipping notifications
 * - Newsletter updates
 * - Password resets
 * 
 * Supports multiple providers:
 * - SendGrid (recommended for production)
 * - NodeMailer (SMTP - works with Gmail, etc.)
 * - Console logging (development mode)
 */

class EmailService {
    constructor() {
        this.mode = process.env.NODE_ENV || 'development';
        this.emailProvider = process.env.EMAIL_PROVIDER || 'console'; // console, sendgrid, smtp
    }

    /**
     * Send order confirmation email
     */
    async sendOrderConfirmation(orderData) {
        const { email, orderNumber, firstName, items, total, subtotal, shipping } = orderData;

        const subject = `Order Confirmation - ${orderNumber}`;
        const html = this._generateOrderConfirmationHTML(orderData);
        const text = this._generateOrderConfirmationText(orderData);

        return await this._sendEmail({
            to: email,
            subject,
            html,
            text
        });
    }

    /**
     * Send shipping notification email
     */
    async sendShippingNotification(shippingData) {
        const { email, orderNumber, trackingNumber, carrier, estimatedDelivery } = shippingData;

        const subject = `Your Order ${orderNumber} Has Shipped!`;
        const html = this._generateShippingNotificationHTML(shippingData);
        const text = this._generateShippingNotificationText(shippingData);

        return await this._sendEmail({
            to: email,
            subject,
            html,
            text
        });
    }

    /**
     * Send newsletter email
     */
    async sendNewsletter(newsletterData) {
        const { email, subject, content } = newsletterData;

        const html = this._generateNewsletterHTML(newsletterData);
        const text = this._generateNewsletterText(newsletterData);

        return await this._sendEmail({
            to: email,
            subject,
            html,
            text
        });
    }

    /**
     * Send welcome email to new subscribers
     */
    async sendWelcomeEmail(subscriberData) {
        const { email } = subscriberData;

        const subject = 'Welcome to OliverSales Newsletter!';
        const html = this._generateWelcomeEmailHTML();
        const text = this._generateWelcomeEmailText();

        return await this._sendEmail({
            to: email,
            subject,
            html,
            text
        });
    }

    /**
     * Internal method to send email
     */
    async _sendEmail({ to, subject, html, text }) {
        try {
            switch (this.emailProvider) {
                case 'sendgrid':
                    return await this._sendViaSendGrid({ to, subject, html, text });
                case 'smtp':
                    return await this._sendViaSMTP({ to, subject, html, text });
                default:
                    return await this._sendViaConsole({ to, subject, html, text });
            }
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    /**
     * Send via SendGrid
     */
    async _sendViaSendGrid({ to, subject, html, text }) {
        if (!process.env.SENDGRID_API_KEY) {
            console.warn('SendGrid API key not configured. Falling back to console logging.');
            return this._sendViaConsole({ to, subject, html, text });
        }

        // Production code (requires @sendgrid/mail):
        /*
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: to,
            from: process.env.SENDGRID_FROM_EMAIL || 'noreply@oliversales.com',
            subject: subject,
            text: text,
            html: html,
        };

        await sgMail.send(msg);
        console.log(`Email sent via SendGrid to ${to}`);
        */

        console.log(`[SendGrid Mock] Email sent to ${to}: ${subject}`);
        return { success: true, provider: 'sendgrid' };
    }

    /**
     * Send via SMTP (NodeMailer)
     */
    async _sendViaSMTP({ to, subject, html, text }) {
        if (!process.env.SMTP_HOST) {
            console.warn('SMTP configuration not found. Falling back to console logging.');
            return this._sendViaConsole({ to, subject, html, text });
        }

        // Production code (requires nodemailer):
        /*
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"OliverSales" <noreply@oliversales.com>',
            to: to,
            subject: subject,
            text: text,
            html: html
        });

        console.log(`Email sent via SMTP: ${info.messageId}`);
        */

        console.log(`[SMTP Mock] Email sent to ${to}: ${subject}`);
        return { success: true, provider: 'smtp' };
    }

    /**
     * Console logging (development mode)
     */
    async _sendViaConsole({ to, subject, html, text }) {
        console.log('\n========================================');
        console.log('📧 EMAIL (Development Mode)');
        console.log('========================================');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('----------------------------------------');
        console.log(text);
        console.log('========================================\n');
        return { success: true, provider: 'console' };
    }

    /**
     * HTML Templates
     */
    _generateOrderConfirmationHTML(orderData) {
        const { orderNumber, firstName, items, total, subtotal, shipping } = orderData;

        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; margin-top: 15px; padding-top: 15px; border-top: 2px solid #1e3a5f; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
        </div>
        <div class="content">
            <p>Hi ${firstName},</p>
            <p>Thank you for your order! We've received your order and will send you a shipping notification when your items are on the way.</p>
            
            <div class="order-details">
                <h3>Order #${orderNumber}</h3>
                ${items.map(item => `
                    <div class="item">
                        <strong>${item.name || item.product_name}</strong><br>
                        Quantity: ${item.quantity} × $${item.price}
                    </div>
                `).join('')}
                
                <div style="margin-top: 15px;">
                    <div>Subtotal: $${subtotal}</div>
                    <div>Shipping: $${shipping}</div>
                    <div class="total">Total: $${total}</div>
                </div>
            </div>
            
            <p>You can track your order status at any time by visiting your <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}/orders.html">Orders page</a>.</p>
        </div>
        <div class="footer">
            <p>© 2025 OliverSales. All rights reserved.</p>
            <p>Questions? Contact us at support@oliversales.com</p>
        </div>
    </div>
</body>
</html>`;
    }

    _generateOrderConfirmationText(orderData) {
        const { orderNumber, firstName, items, total, subtotal, shipping } = orderData;

        return `
Hi ${firstName},

Thank you for your order!

Order #${orderNumber}

${items.map(item => `${item.name || item.product_name} - Qty: ${item.quantity} × $${item.price}`).join('\n')}

Subtotal: $${subtotal}
Shipping: $${shipping}
Total: $${total}

You can track your order at: ${process.env.FRONTEND_URL || 'http://localhost:8000'}/orders.html

Thanks for shopping with OliverSales!
`;
    }

    _generateShippingNotificationHTML(shippingData) {
        const { orderNumber, trackingNumber, carrier, estimatedDelivery } = shippingData;

        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .tracking-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #1e3a5f; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Your Order Has Shipped!</h1>
        </div>
        <div class="content">
            <p>Great news! Your order #${orderNumber} is on its way.</p>
            
            <div class="tracking-box">
                <p><strong>Carrier:</strong> ${carrier}</p>
                <p><strong>Tracking Number:</strong></p>
                <div class="tracking-number">${trackingNumber}</div>
                ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>` : ''}
            </div>
            
            <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}/orders.html" 
                   style="background: #1e3a5f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Track Your Order
                </a>
            </p>
        </div>
        <div class="footer">
            <p>© 2025 OliverSales. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
    }

    _generateShippingNotificationText(shippingData) {
        const { orderNumber, trackingNumber, carrier, estimatedDelivery } = shippingData;

        return `
Your Order Has Shipped!

Order #${orderNumber} is on its way.

Carrier: ${carrier}
Tracking Number: ${trackingNumber}
${estimatedDelivery ? `Estimated Delivery: ${estimatedDelivery}` : ''}

Track your order at: ${process.env.FRONTEND_URL || 'http://localhost:8000'}/orders.html
`;
    }

    _generateNewsletterHTML(newsletterData) {
        const { content, unsubscribeLink } = newsletterData;

        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>OliverSales Newsletter</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>© 2025 OliverSales. All rights reserved.</p>
            <p><a href="${unsubscribeLink || '#'}">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>`;
    }

    _generateNewsletterText(newsletterData) {
        return newsletterData.content.replace(/<[^>]*>/g, '');
    }

    _generateWelcomeEmailHTML() {
        return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to OliverSales!</h1>
        </div>
        <div class="content">
            <p>Thank you for subscribing to our newsletter!</p>
            <p>You'll be the first to know about:</p>
            <ul>
                <li>New arrivals and exclusive collections</li>
                <li>Special discounts and promotions</li>
                <li>Parenting tips and style guides</li>
                <li>Early access to sales</li>
            </ul>
            <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}/shop.html" 
                   style="background: #1e3a5f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Start Shopping
                </a>
            </p>
        </div>
        <div class="footer">
            <p>© 2025 OliverSales. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
    }

    _generateWelcomeEmailText() {
        return `
Welcome to OliverSales!

Thank you for subscribing to our newsletter!

You'll receive updates about:
- New arrivals and exclusive collections
- Special discounts and promotions
- Parenting tips and style guides
- Early access to sales

Start shopping: ${process.env.FRONTEND_URL || 'http://localhost:8000'}/shop.html
`;
    }
}

module.exports = new EmailService();
