// Wishlist page functionality

document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
});

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const container = document.getElementById('wishlist-container');
    
    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart"></i>
                <h2>Your Wishlist is Empty</h2>
                <p>Start adding items you love to your wishlist!</p>
                <a href="shop.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="wishlist-header">
            <h2>Your Wishlist (${wishlist.length} items)</h2>
            <button class="btn" onclick="clearWishlist()">Clear All</button>
        </div>
        <div class="wishlist-grid">
            ${wishlist.map(item => `
                <div class="wishlist-card" data-id="${item.id}">
                    <button class="remove-wishlist-item" onclick="removeFromWishlist('${item.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="wishlist-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="wishlist-info">
                        <h3>${item.name}</h3>
                        <p class="wishlist-price">${item.price}</p>
                        <button class="btn btn-primary" onclick="moveToCart('${item.id}', '${item.name}', '${item.price}')">
                            <i class="fas fa-shopping-cart"></i> Move to Cart
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    showNotification('Item removed from wishlist');
    loadWishlist();
}

function moveToCart(productId, name, price) {
    // Add to cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
        name: name,
        price: price,
        quantity: 1,
        id: Date.now()
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Remove from wishlist
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update UI
    showNotification(`${name} moved to cart!`);
    loadWishlist();
    
    // Update cart count
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function clearWishlist() {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        localStorage.setItem('wishlist', '[]');
        showNotification('Wishlist cleared');
        loadWishlist();
    }
}

// Show notification
function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add styles for wishlist page
const wishlistStyles = document.createElement('style');
wishlistStyles.textContent = `
    .wishlist-section {
        padding: 3rem 0;
        min-height: 60vh;
    }
    
    .empty-wishlist {
        text-align: center;
        padding: 4rem 2rem;
    }
    
    .empty-wishlist i {
        font-size: 5rem;
        color: var(--accent-brown);
        margin-bottom: 1.5rem;
    }
    
    .empty-wishlist h2 {
        color: var(--primary-navy);
        margin-bottom: 1rem;
    }
    
    .empty-wishlist p {
        color: #666;
        margin-bottom: 2rem;
    }
    
    .wishlist-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e0e0e0;
    }
    
    .wishlist-header h2 {
        color: var(--primary-navy);
    }
    
    .wishlist-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
    }
    
    .wishlist-card {
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        transition: all 0.3s ease;
    }
    
    .wishlist-card:hover {
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transform: translateY(-5px);
    }
    
    .remove-wishlist-item {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background-color: white;
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        z-index: 10;
        transition: all 0.3s ease;
    }
    
    .remove-wishlist-item:hover {
        background-color: #ff4444;
        color: white;
    }
    
    .wishlist-image {
        width: 100%;
        height: 250px;
        overflow: hidden;
    }
    
    .wishlist-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .wishlist-info {
        padding: 1.5rem;
    }
    
    .wishlist-info h3 {
        color: var(--primary-navy);
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
    }
    
    .wishlist-price {
        font-size: 1.3rem;
        color: var(--accent-brown);
        font-weight: bold;
        margin-bottom: 1rem;
    }
    
    .wishlist-info .btn {
        width: 100%;
    }
    
    @media (max-width: 768px) {
        .wishlist-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }
        
        .wishlist-header .btn {
            width: 100%;
        }
        
        .wishlist-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
        }
    }
`;
document.head.appendChild(wishlistStyles);
