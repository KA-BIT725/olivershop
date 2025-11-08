// Orders page functionality

document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
});

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const container = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-shopping-bag"></i>
                <h2>No Orders Yet</h2>
                <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = orders.map(order => {
        const date = new Date(order.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Order ${order.orderNumber}</h3>
                        <p class="order-date">Placed on ${formattedDate}</p>
                    </div>
                    <div class="order-status ${order.status.toLowerCase().replace(' ', '-')}">
                        ${order.status}
                    </div>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <div class="order-item-info">
                                <h4>${item.name}</h4>
                                <p>Quantity: ${item.quantity}</p>
                            </div>
                            <div class="order-item-price">
                                ${item.price}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        <span>Total:</span>
                        <span class="total-amount">$${order.total.toFixed(2)}</span>
                    </div>
                    <div class="order-actions">
                        <button class="btn" onclick="trackOrder('${order.orderNumber}')">
                            <i class="fas fa-truck"></i> Track Order
                        </button>
                        <button class="btn" onclick="viewOrderDetails('${order.orderNumber}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function trackOrder(orderNumber) {
    const trackingHTML = `
        <div class="cart-modal">
            <div class="cart-content tracking-modal">
                <h2>Order Tracking</h2>
                <p class="order-number">Order #${orderNumber}</p>
                <div class="tracking-timeline">
                    <div class="tracking-step completed">
                        <div class="step-icon"><i class="fas fa-check"></i></div>
                        <div class="step-info">
                            <h4>Order Placed</h4>
                            <p>Your order has been received</p>
                        </div>
                    </div>
                    <div class="tracking-step completed">
                        <div class="step-icon"><i class="fas fa-check"></i></div>
                        <div class="step-info">
                            <h4>Processing</h4>
                            <p>We're preparing your items</p>
                        </div>
                    </div>
                    <div class="tracking-step active">
                        <div class="step-icon"><i class="fas fa-box"></i></div>
                        <div class="step-info">
                            <h4>Shipped</h4>
                            <p>Your order is on the way</p>
                        </div>
                    </div>
                    <div class="tracking-step">
                        <div class="step-icon"><i class="fas fa-home"></i></div>
                        <div class="step-info">
                            <h4>Delivered</h4>
                            <p>Estimated: 2-3 business days</p>
                        </div>
                    </div>
                </div>
                <div class="tracking-info">
                    <p><strong>Shipping Carrier:</strong> USPS</p>
                    <p><strong>Tracking Number:</strong> 9405511899562418245678</p>
                </div>
                <button class="btn btn-primary" onclick="closeTracking()">Close</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', trackingHTML);
    
    document.querySelector('.cart-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeTracking();
        }
    });
}

function closeTracking() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.remove();
    }
}

function viewOrderDetails(orderNumber) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (!order) return;
    
    const date = new Date(order.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const subtotal = order.total - 5.99;
    
    const detailsHTML = `
        <div class="cart-modal">
            <div class="cart-content order-details-modal">
                <h2>Order Details</h2>
                <div class="details-section">
                    <h3>Order Information</h3>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Order Date:</strong> ${formattedDate}</p>
                    <p><strong>Status:</strong> <span class="order-status ${order.status.toLowerCase().replace(' ', '-')}">${order.status}</span></p>
                </div>
                <div class="details-section">
                    <h3>Items Ordered</h3>
                    ${order.items.map(item => `
                        <div class="detail-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>${item.price}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="details-section">
                    <h3>Order Summary</h3>
                    <div class="detail-item">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="detail-item">
                        <span>Shipping:</span>
                        <span>$5.99</span>
                    </div>
                    <div class="detail-item total">
                        <span>Total:</span>
                        <span>$${order.total.toFixed(2)}</span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="closeOrderDetails()">Close</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', detailsHTML);
    
    document.querySelector('.cart-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeOrderDetails();
        }
    });
}

function closeOrderDetails() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.remove();
    }
}

// Add styles for orders page
const orderStyles = document.createElement('style');
orderStyles.textContent = `
    .orders-section {
        padding: 3rem 0;
        min-height: 60vh;
    }
    
    #orders-container {
        max-width: 900px;
        margin: 0 auto;
    }
    
    .empty-orders {
        text-align: center;
        padding: 4rem 2rem;
    }
    
    .empty-orders i {
        font-size: 5rem;
        color: var(--accent-brown);
        margin-bottom: 1.5rem;
    }
    
    .empty-orders h2 {
        color: var(--primary-navy);
        margin-bottom: 1rem;
    }
    
    .empty-orders p {
        color: #666;
        margin-bottom: 2rem;
    }
    
    .order-card {
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e0e0e0;
        margin-bottom: 1rem;
    }
    
    .order-info h3 {
        color: var(--primary-navy);
        margin-bottom: 0.25rem;
    }
    
    .order-date {
        color: #666;
        font-size: 0.9rem;
    }
    
    .order-status {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85rem;
        text-transform: uppercase;
    }
    
    .order-status.processing {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .order-status.shipped {
        background-color: #d1ecf1;
        color: #0c5460;
    }
    
    .order-status.delivered {
        background-color: #d4edda;
        color: #155724;
    }
    
    .order-items {
        margin-bottom: 1rem;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f5f5f5;
    }
    
    .order-item:last-child {
        border-bottom: none;
    }
    
    .order-item-info h4 {
        margin-bottom: 0.25rem;
        color: var(--primary-navy);
    }
    
    .order-item-info p {
        color: #666;
        font-size: 0.9rem;
    }
    
    .order-item-price {
        font-weight: 600;
        color: var(--accent-brown);
    }
    
    .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid #e0e0e0;
    }
    
    .order-total {
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .total-amount {
        color: var(--accent-brown);
    }
    
    .order-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .order-actions .btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    /* Tracking Modal */
    .tracking-modal {
        max-width: 600px;
    }
    
    .tracking-timeline {
        margin: 2rem 0;
    }
    
    .tracking-step {
        display: flex;
        align-items: flex-start;
        margin-bottom: 2rem;
        position: relative;
        padding-left: 3rem;
    }
    
    .tracking-step:not(:last-child)::before {
        content: '';
        position: absolute;
        left: 1.125rem;
        top: 2.5rem;
        width: 2px;
        height: calc(100% + 1rem);
        background-color: #e0e0e0;
    }
    
    .tracking-step.completed::before {
        background-color: #4CAF50;
    }
    
    .tracking-step.active::before {
        background-color: var(--accent-brown);
    }
    
    .step-icon {
        position: absolute;
        left: 0;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        border: 2px solid #e0e0e0;
        color: #999;
    }
    
    .tracking-step.completed .step-icon {
        background-color: #4CAF50;
        border-color: #4CAF50;
        color: white;
    }
    
    .tracking-step.active .step-icon {
        background-color: var(--accent-brown);
        border-color: var(--accent-brown);
        color: white;
    }
    
    .step-info h4 {
        margin-bottom: 0.25rem;
        color: var(--primary-navy);
    }
    
    .step-info p {
        color: #666;
        font-size: 0.9rem;
    }
    
    .tracking-info {
        background-color: #f9f9f9;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 1.5rem;
    }
    
    .tracking-info p {
        margin-bottom: 0.5rem;
    }
    
    /* Order Details Modal */
    .order-details-modal {
        max-width: 600px;
    }
    
    .details-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .details-section:last-of-type {
        border-bottom: none;
    }
    
    .details-section h3 {
        color: var(--primary-navy);
        margin-bottom: 1rem;
    }
    
    .details-section p {
        margin-bottom: 0.5rem;
        color: #666;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
    }
    
    .detail-item.total {
        border-top: 2px solid var(--primary-navy);
        padding-top: 1rem;
        margin-top: 0.5rem;
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--accent-brown);
    }
    
    @media (max-width: 768px) {
        .order-header {
            flex-direction: column;
            gap: 1rem;
        }
        
        .order-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }
        
        .order-actions {
            width: 100%;
        }
        
        .order-actions .btn {
            flex: 1;
        }
    }
`;
document.head.appendChild(orderStyles);
