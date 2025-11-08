// Shopping Cart Management
let cart = [];
let cartCount = 0;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupEventListeners();
    setupMobileMenu();
    setupNewsletter();
});

// Initialize cart from localStorage
function initializeCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', handleCategoryClick);
    });

    // Quick view buttons
    const quickViewButtons = document.querySelectorAll('.quick-view');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', handleQuickView);
    });

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', showCart);
    }
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            
            // Change icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Handle add to cart
function handleAddToCart(e) {
    e.stopPropagation();
    
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    
    const product = {
        name: productName,
        price: productPrice,
        quantity: 1,
        id: Date.now()
    };
    
    cart.push(product);
    saveCart();
    updateCartCount();
    
    // Show success message
    showNotification(`${productName} added to cart!`);
    
    // Add animation to button
    e.target.textContent = 'Added!';
    e.target.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.style.backgroundColor = '';
    }, 1500);
}

// Update cart count
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        // Add bounce animation
        cartCountElement.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            cartCountElement.style.animation = '';
        }, 500);
    }
}

// Update wishlist count
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistCountElement = document.querySelector('.wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = wishlist.length;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show cart
function showCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    let cartHTML = '<div class="cart-modal">\n';
    cartHTML += '<div class="cart-content">\n';
    cartHTML += '<h2>Shopping Cart</h2>\n';
    cartHTML += '<div class="cart-items">\n';
    
    let total = 0;
    cart.forEach((item, index) => {
        const price = parseFloat(item.price.replace('$', ''));
        total += price * item.quantity;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
                    </div>
                    <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    cartHTML += '</div>\n';
    cartHTML += `<div class="cart-total">Total: $${total.toFixed(2)}</div>\n`;
    cartHTML += '<div class="cart-actions">\n';
    cartHTML += '<button class="btn btn-primary" onclick="checkout()">Proceed to Checkout</button>\n';
    cartHTML += '<button class="btn" onclick="closeCart()">Continue Shopping</button>\n';
    cartHTML += '</div>\n';
    cartHTML += '</div>\n';
    cartHTML += '</div>\n';
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    
    // Add quantity control listeners
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const action = this.getAttribute('data-action');
            
            if (action === 'increase') {
                cart[index].quantity++;
            } else if (action === 'decrease' && cart[index].quantity > 1) {
                cart[index].quantity--;
            }
            
            saveCart();
            updateCartCount();
            closeCart();
            showCart();
        });
    });
    
    // Add remove item listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            saveCart();
            updateCartCount();
            closeCart();
            if (cart.length > 0) {
                showCart();
            }
        });
    });
    
    // Close cart on background click
    document.querySelector('.cart-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCart();
        }
    });
}

// Close cart modal
function closeCart() {
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.remove();
    }
}

// Checkout function
function checkout() {
    closeCart();
    showCheckoutModal();
}

// Show checkout modal
function showCheckoutModal() {
    let total = 0;
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('$', ''));
        total += price * item.quantity;
    });
    
    const checkoutHTML = `
        <div class="cart-modal checkout-modal">
            <div class="cart-content checkout-content">
                <h2>Checkout</h2>
                <form id="checkoutForm" class="checkout-form">
                    <div class="checkout-sections">
                        <div class="checkout-section">
                            <h3>Contact Information</h3>
                            <div class="form-group">
                                <input type="email" id="checkout-email" placeholder="Email" required>
                            </div>
                        </div>
                        
                        <div class="checkout-section">
                            <h3>Shipping Address</h3>
                            <div class="form-row">
                                <div class="form-group">
                                    <input type="text" id="checkout-firstname" placeholder="First Name" required>
                                </div>
                                <div class="form-group">
                                    <input type="text" id="checkout-lastname" placeholder="Last Name" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <input type="text" id="checkout-address" placeholder="Address" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <input type="text" id="checkout-city" placeholder="City" required>
                                </div>
                                <div class="form-group">
                                    <input type="text" id="checkout-state" placeholder="State/Province" required>
                                </div>
                                <div class="form-group">
                                    <input type="text" id="checkout-zip" placeholder="ZIP Code" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <input type="tel" id="checkout-phone" placeholder="Phone Number" required>
                            </div>
                        </div>
                        
                        <div class="checkout-section">
                            <h3>Payment Method</h3>
                            <div class="payment-methods">
                                <label class="payment-option">
                                    <input type="radio" name="payment" value="card" checked>
                                    <span><i class="fas fa-credit-card"></i> Credit Card</span>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="payment" value="paypal">
                                    <span><i class="fab fa-paypal"></i> PayPal</span>
                                </label>
                                <label class="payment-option">
                                    <input type="radio" name="payment" value="cod">
                                    <span><i class="fas fa-money-bill"></i> Cash on Delivery</span>
                                </label>
                            </div>
                            <div id="card-fields" class="card-fields">
                                <div class="form-group">
                                    <input type="text" id="card-number" placeholder="Card Number" pattern="[0-9]{16}">
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <input type="text" id="card-expiry" placeholder="MM/YY">
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="card-cvv" placeholder="CVV" pattern="[0-9]{3,4}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="checkout-summary">
                        <h3>Order Summary</h3>
                        <div class="summary-items">
                            ${cart.map(item => `
                                <div class="summary-item">
                                    <span>${item.name} x ${item.quantity}</span>
                                    <span>$${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="summary-line">
                            <span>Subtotal:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        <div class="summary-line">
                            <span>Shipping:</span>
                            <span>$5.99</span>
                        </div>
                        <div class="summary-total">
                            <span>Total:</span>
                            <span>$${(total + 5.99).toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="checkout-actions">
                        <button type="submit" class="btn btn-primary">Place Order</button>
                        <button type="button" class="btn" onclick="closeCheckout()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', checkoutHTML);
    
    // Handle payment method change
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const cardFields = document.getElementById('card-fields');
            if (this.value === 'card') {
                cardFields.style.display = 'block';
            } else {
                cardFields.style.display = 'none';
            }
        });
    });
    
    // Handle form submission
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        completeOrder();
    });
    
    // Close on background click
    document.querySelector('.checkout-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCheckout();
        }
    });
}

// Close checkout modal
function closeCheckout() {
    const checkoutModal = document.querySelector('.checkout-modal');
    if (checkoutModal) {
        checkoutModal.remove();
    }
}

// Complete order
function completeOrder() {
    const orderNumber = 'ORD-' + Date.now();
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$', '')) * item.quantity), 0) + 5.99,
        status: 'Processing'
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    closeCheckout();
    showOrderConfirmation(orderNumber);
}

// Show order confirmation
function showOrderConfirmation(orderNumber) {
    const confirmHTML = `
        <div class="cart-modal">
            <div class="cart-content order-confirmation">
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase.</p>
                <p class="order-number">Order Number: <strong>${orderNumber}</strong></p>
                <p>You will receive an email confirmation shortly.</p>
                <button class="btn btn-primary" onclick="closeOrderConfirmation()">Continue Shopping</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmHTML);
    
    document.querySelector('.cart-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeOrderConfirmation();
        }
    });
}

// Close order confirmation
function closeOrderConfirmation() {
    const modal = document.querySelector('.cart-modal');
    if (modal) {
        modal.remove();
    }
}

// Handle search
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        // Store search term and redirect to shop page
        localStorage.setItem('searchTerm', searchTerm);
        window.location.href = 'shop.html';
    } else {
        showNotification('Please enter a search term');
    }
}

// Handle category click
function handleCategoryClick(e) {
    const categoryName = e.currentTarget.querySelector('.category-name').textContent;
    showNotification(`Browsing ${categoryName} category...`);
    // Here you would navigate to category page or filter products
}

// Handle quick view
function handleQuickView(e) {
    e.stopPropagation();
    const productCard = e.target.closest('.product-card');
    const productId = productCard.getAttribute('data-product-id');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('.product-image img').src;
    
    showProductModal(productId, productName, productPrice, productImage);
}

// Show product detail modal
function showProductModal(productId, name, price, image) {
    const sizes = ['0-6M', '6-12M', '1-2Y', '2-4Y', '4-6Y'];
    const colors = ['Beige', 'Navy', 'White', 'Pink', 'Gray'];
    
    const modalHTML = `
        <div class="cart-modal product-modal">
            <div class="cart-content product-detail-content">
                <button class="close-modal" onclick="closeProductModal()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="product-detail-grid">
                    <div class="product-detail-image">
                        <img src="${image}" alt="${name}">
                    </div>
                    <div class="product-detail-info">
                        <h2>${name}</h2>
                        <p class="product-detail-price">${price}</p>
                        <div class="product-rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                            <span>(127 reviews)</span>
                        </div>
                        <p class="product-description">
                            High-quality, comfortable clothing made from premium materials. 
                            Perfect for everyday wear and special occasions. Machine washable and durable.
                        </p>
                        
                        <div class="product-options">
                            <div class="option-group">
                                <label>Size:</label>
                                <div class="size-options">
                                    ${sizes.map((size, i) => `
                                        <button class="size-btn ${i === 2 ? 'active' : ''}" data-size="${size}">${size}</button>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="option-group">
                                <label>Color:</label>
                                <div class="color-options">
                                    ${colors.map((color, i) => `
                                        <button class="color-btn ${i === 0 ? 'active' : ''}" data-color="${color}" title="${color}">
                                            <span class="color-swatch color-${color.toLowerCase()}"></span>
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="option-group">
                                <label>Quantity:</label>
                                <div class="quantity-control">
                                    <button class="qty-btn" onclick="changeModalQuantity(-1)">-</button>
                                    <span class="quantity" id="modal-quantity">1</span>
                                    <button class="qty-btn" onclick="changeModalQuantity(1)">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="addToCartFromModal('${productId}', '${name}', '${price}')">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-wishlist" onclick="addToWishlist('${productId}', '${name}', '${price}', '${image}')">
                                <i class="far fa-heart"></i> Add to Wishlist
                            </button>
                        </div>
                        
                        <div class="product-features">
                            <div class="feature-item">
                                <i class="fas fa-truck"></i>
                                <span>Free shipping on orders over $50</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-undo"></i>
                                <span>30-day return policy</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>1-year warranty</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup size button listeners
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Setup color button listeners
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close on background click
    document.querySelector('.product-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeProductModal();
        }
    });
}

// Close product modal
function closeProductModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.remove();
    }
}

// Change modal quantity
function changeModalQuantity(change) {
    const qtyElement = document.getElementById('modal-quantity');
    let qty = parseInt(qtyElement.textContent);
    qty = Math.max(1, qty + change);
    qtyElement.textContent = qty;
}

// Add to cart from modal
function addToCartFromModal(productId, name, price) {
    const quantity = parseInt(document.getElementById('modal-quantity').textContent);
    const selectedSize = document.querySelector('.size-btn.active')?.getAttribute('data-size') || 'One Size';
    const selectedColor = document.querySelector('.color-btn.active')?.getAttribute('data-color') || 'Default';
    
    for (let i = 0; i < quantity; i++) {
        const product = {
            name: `${name} (${selectedSize}, ${selectedColor})`,
            price: price,
            quantity: 1,
            id: Date.now() + i
        };
        cart.push(product);
    }
    
    saveCart();
    updateCartCount();
    closeProductModal();
    showNotification(`${quantity} item(s) added to cart!`);
}

// Add to wishlist
function addToWishlist(productId, name, price, image) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Check if already in wishlist
    const exists = wishlist.some(item => item.id === productId);
    if (exists) {
        showNotification('Item already in wishlist!');
        return;
    }
    
    wishlist.push({
        id: productId,
        name: name,
        price: price,
        image: image
    });
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showNotification(`${name} added to wishlist!`);
    
    // Update wishlist icon if it exists
    updateWishlistCount();
}

// Handle navigation
function handleNavigation(e) {
    const href = e.target.getAttribute('href');
    
    // If it's an external page link, allow default behavior
    if (href && (href.endsWith('.html') || href.includes('#'))) {
        return; // Let the browser handle the navigation
    }
    
    e.preventDefault();
    
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    e.target.classList.add('active');
    
    // Smooth scroll to section if it's a hash link
    const targetId = href;
    if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Smooth scrolling for Shop Now button
const shopNowBtn = document.querySelector('.hero .btn-primary');
if (shopNowBtn) {
    shopNowBtn.addEventListener('click', function(e) {
        // Check if we're on the home page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            e.preventDefault();
            const categoriesSection = document.querySelector('.categories');
            if (categoriesSection) {
                categoriesSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If not on home page, go to shop page
            window.location.href = 'shop.html';
        }
    });
}

// Setup newsletter form
function setupNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Save to localStorage
            let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
                showNotification('Thank you for subscribing!');
                emailInput.value = '';
            } else {
                showNotification('You are already subscribed!');
            }
        });
    }
}

// Add CSS for notification and cart modal dynamically
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2c2c2c;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .cart-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    
    .cart-content {
        background-color: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .cart-content h2 {
        margin-bottom: 1.5rem;
        color: var(--primary-navy);
    }
    
    .cart-items {
        margin-bottom: 1.5rem;
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .cart-item-info h4 {
        margin-bottom: 0.5rem;
    }
    
    .cart-item-info p, .cart-item-price {
        color: #666;
        font-weight: 600;
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .quantity-control {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: #f5f5f5;
        padding: 0.25rem;
        border-radius: 5px;
    }
    
    .qty-btn {
        background-color: var(--accent-brown);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
    }
    
    .qty-btn:hover {
        background-color: var(--primary-navy);
    }
    
    .quantity {
        min-width: 30px;
        text-align: center;
        font-weight: bold;
    }
    
    .remove-item {
        background-color: #ff4444;
        color: white;
        border: none;
        padding: 0.5rem;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .remove-item:hover {
        background-color: #cc0000;
    }
    
    .cart-total {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: right;
        margin-bottom: 1.5rem;
        color: var(--accent-brown);
    }
    
    .cart-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .cart-actions button {
        flex: 1;
        min-width: 150px;
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    /* Checkout Styles */
    .checkout-content {
        max-width: 800px;
        max-height: 90vh;
    }
    
    .checkout-sections {
        margin-bottom: 2rem;
    }
    
    .checkout-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .checkout-section:last-child {
        border-bottom: none;
    }
    
    .checkout-section h3 {
        margin-bottom: 1rem;
        color: var(--primary-navy);
        font-size: 1.1rem;
    }
    
    .checkout-form .form-group {
        margin-bottom: 1rem;
    }
    
    .checkout-form input,
    .checkout-form select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 0.95rem;
    }
    
    .checkout-form input:focus,
    .checkout-form select:focus {
        outline: none;
        border-color: var(--accent-brown);
    }
    
    .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .payment-methods {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }
    
    .payment-option {
        display: flex;
        align-items: center;
        padding: 0.75rem;
        border: 2px solid #e0e0e0;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .payment-option:hover {
        border-color: var(--accent-brown);
        background-color: #f9f9f9;
    }
    
    .payment-option input[type="radio"] {
        margin-right: 0.75rem;
        width: auto;
    }
    
    .payment-option span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .card-fields {
        margin-top: 1rem;
    }
    
    .checkout-summary {
        background-color: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    }
    
    .checkout-summary h3 {
        margin-bottom: 1rem;
        color: var(--primary-navy);
    }
    
    .summary-items {
        margin-bottom: 1rem;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        font-size: 0.9rem;
    }
    
    .summary-line {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-top: 1px solid #e0e0e0;
    }
    
    .summary-total {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-top: 2px solid var(--primary-navy);
        margin-top: 0.5rem;
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--accent-brown);
    }
    
    .checkout-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .checkout-actions button {
        flex: 1;
        min-width: 150px;
    }
    
    /* Order Confirmation Styles */
    .order-confirmation {
        text-align: center;
        padding: 3rem 2rem;
    }
    
    .confirmation-icon {
        font-size: 4rem;
        color: #4CAF50;
        margin-bottom: 1rem;
    }
    
    .order-confirmation h2 {
        color: var(--primary-navy);
        margin-bottom: 1rem;
    }
    
    .order-confirmation p {
        margin-bottom: 0.75rem;
        color: #666;
    }
    
    .order-number {
        font-size: 1.1rem;
        margin: 1.5rem 0;
    }
    
    .order-number strong {
        color: var(--accent-brown);
    }
    
    /* Product Detail Modal Styles */
    .product-detail-content {
        max-width: 900px;
        max-height: 90vh;
        padding: 2rem;
    }
    
    .close-modal {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        z-index: 10;
    }
    
    .close-modal:hover {
        color: #000;
    }
    
    .product-detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
    }
    
    .product-detail-image img {
        width: 100%;
        border-radius: 10px;
        object-fit: cover;
    }
    
    .product-detail-info h2 {
        color: var(--primary-navy);
        margin-bottom: 0.5rem;
    }
    
    .product-detail-price {
        font-size: 1.8rem;
        color: var(--accent-brown);
        font-weight: bold;
        margin-bottom: 1rem;
    }
    
    .product-rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-bottom: 1rem;
        color: #ffa500;
    }
    
    .product-rating span {
        color: #666;
        margin-left: 0.5rem;
        font-size: 0.9rem;
    }
    
    .product-description {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .product-options {
        margin-bottom: 2rem;
    }
    
    .option-group {
        margin-bottom: 1.5rem;
    }
    
    .option-group label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--primary-navy);
    }
    
    .size-options {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .size-btn {
        padding: 0.5rem 1rem;
        border: 2px solid #e0e0e0;
        background-color: white;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .size-btn:hover {
        border-color: var(--accent-brown);
        background-color: #f9f9f9;
    }
    
    .size-btn.active {
        border-color: var(--accent-brown);
        background-color: var(--accent-brown);
        color: white;
    }
    
    .color-options {
        display: flex;
        gap: 0.75rem;
    }
    
    .color-btn {
        width: 40px;
        height: 40px;
        border: 2px solid #e0e0e0;
        background-color: white;
        border-radius: 50%;
        cursor: pointer;
        padding: 3px;
        transition: all 0.3s ease;
    }
    
    .color-btn:hover {
        border-color: var(--accent-brown);
        transform: scale(1.1);
    }
    
    .color-btn.active {
        border-color: var(--accent-brown);
        border-width: 3px;
    }
    
    .color-swatch {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    
    .color-beige { background-color: #e8dcc8; }
    .color-navy { background-color: #1e3a5f; }
    .color-white { background-color: #ffffff; border: 1px solid #ddd; }
    .color-pink { background-color: #ffb6c1; }
    .color-gray { background-color: #808080; }
    
    .product-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .product-actions .btn {
        flex: 1;
    }
    
    .btn-wishlist {
        background-color: white;
        color: var(--accent-brown);
        border: 2px solid var(--accent-brown);
    }
    
    .btn-wishlist:hover {
        background-color: var(--accent-brown);
        color: white;
    }
    
    .product-features {
        border-top: 1px solid #e0e0e0;
        padding-top: 1.5rem;
    }
    
    .feature-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        color: #666;
    }
    
    .feature-item i {
        color: var(--accent-brown);
        font-size: 1.1rem;
    }
    
    /* Newsletter Section */
    .newsletter-section {
        background: linear-gradient(135deg, var(--primary-navy) 0%, var(--accent-brown) 100%);
        padding: 4rem 0;
        margin: 3rem 0 0 0;
    }
    
    .newsletter-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
    }
    
    .newsletter-text {
        flex: 1;
    }
    
    .newsletter-text h2 {
        color: white;
        margin-bottom: 0.5rem;
        font-size: 2rem;
    }
    
    .newsletter-text p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
    }
    
    .newsletter-form {
        flex: 1;
        display: flex;
        gap: 1rem;
        max-width: 500px;
    }
    
    .newsletter-form input {
        flex: 1;
        padding: 1rem;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
    }
    
    .newsletter-form input:focus {
        outline: 2px solid white;
    }
    
    .newsletter-form button {
        padding: 1rem 2rem;
        white-space: nowrap;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .checkout-content {
            max-width: 95%;
            padding: 1.5rem;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .checkout-actions {
            flex-direction: column;
        }
        
        .checkout-actions button {
            width: 100%;
        }
        
        .product-detail-content {
            max-width: 95%;
            padding: 1.5rem;
        }
        
        .product-detail-grid {
            grid-template-columns: 1fr;
        }
        
        .product-actions {
            flex-direction: column;
        }
        
        .newsletter-content {
            flex-direction: column;
            text-align: center;
        }
        
        .newsletter-form {
            flex-direction: column;
            width: 100%;
        }
        
        .newsletter-form button {
            width: 100%;
        }
    }
    }
`;
document.head.appendChild(style);
