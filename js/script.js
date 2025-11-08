// Shopping Cart Management
let cart = [];
let cartCount = 0;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupEventListeners();
    setupMobileMenu();
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
                    <p>${item.price} x ${item.quantity}</p>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            </div>
        `;
    });
    
    cartHTML += '</div>\n';
    cartHTML += `<div class="cart-total">Total: $${total.toFixed(2)}</div>\n`;
    cartHTML += '<div class="cart-actions">\n';
    cartHTML += '<button class="btn btn-primary" onclick="checkout()">Checkout</button>\n';
    cartHTML += '<button class="btn" onclick="closeCart()">Continue Shopping</button>\n';
    cartHTML += '</div>\n';
    cartHTML += '</div>\n';
    cartHTML += '</div>\n';
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    
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
    showNotification('Checkout feature coming soon!');
    closeCart();
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
    const productName = productCard.querySelector('.product-name').textContent;
    showNotification(`Quick view: ${productName}`);
    // Here you would show a modal with product details
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
    
    .cart-item-info p {
        color: #666;
    }
    
    .remove-item {
        background-color: #ff4444;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
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
    }
`;
document.head.appendChild(style);
