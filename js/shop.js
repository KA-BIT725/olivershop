cd// Shop page functionality

// Sample product data
const allProducts = [
    { id: 1, name: "Organic Cotton T-Shirt", price: 24.99, category: "tops", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=600&fit=crop" },
    { id: 2, name: "Comfortable Shorts", price: 19.99, category: "bottoms", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop" },
    { id: 3, name: "Summer Dress", price: 34.99, category: "dresses", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop" },
    { id: 4, name: "Cozy Romper", price: 29.99, category: "new", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop" },
    { id: 5, name: "Striped Polo Shirt", price: 26.99, category: "tops", image: "https://images.unsplash.com/photo-1596265371388-43edbaadab94?w=600&h=600&fit=crop" },
    { id: 6, name: "Denim Jeans", price: 32.99, category: "bottoms", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop" },
    { id: 7, name: "Flower Print Dress", price: 38.99, category: "dresses", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600&h=600&fit=crop" },
    { id: 8, name: "Cozy Hoodie", price: 42.99, category: "new", image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=600&fit=crop" },
    { id: 9, name: "Basic Tee Pack (3)", price: 39.99, category: "tops", image: "https://images.unsplash.com/photo-1485218126466-34e6392ec754?w=600&h=600&fit=crop" },
    { id: 10, name: "Cargo Pants", price: 29.99, category: "bottoms", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop" },
    { id: 11, name: "Party Dress", price: 45.99, category: "dresses", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop" },
    { id: 12, name: "Sleep Set", price: 35.99, category: "new", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600&h=600&fit=crop" },
    { id: 13, name: "Graphic Tee", price: 22.99, category: "tops", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=600&fit=crop" },
    { id: 14, name: "Swim Shorts", price: 24.99, category: "bottoms", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop" },
    { id: 15, name: "Casual Dress", price: 31.99, category: "dresses", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop" },
    { id: 16, name: "Winter Jacket", price: 54.99, category: "new", image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=600&fit=crop" },
    { id: 17, name: "Long Sleeve Shirt", price: 28.99, category: "tops", image: "https://images.unsplash.com/photo-1596265371388-43edbaadab94?w=600&h=600&fit=crop" },
    { id: 18, name: "Leggings", price: 18.99, category: "bottoms", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop" },
    { id: 19, name: "Tutu Dress", price: 42.99, category: "dresses", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600&h=600&fit=crop" },
    { id: 20, name: "Overalls", price: 39.99, category: "new", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop" },
    { id: 21, name: "Tank Top", price: 16.99, category: "tops", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=600&fit=crop" },
    { id: 22, name: "Joggers", price: 26.99, category: "bottoms", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop" },
    { id: 23, name: "Maxi Dress", price: 48.99, category: "dresses", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop" },
    { id: 24, name: "Sweater Set", price: 44.99, category: "new", image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=600&fit=crop" }
];

let currentProducts = [...allProducts];

// Load products when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a search term from home page
    const searchTerm = localStorage.getItem('searchTerm');
    if (searchTerm) {
        performSearch(searchTerm);
        localStorage.removeItem('searchTerm'); // Clear after use
        
        // Update search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = searchTerm;
        }
    } else {
        displayProducts(currentProducts);
    }
    
    setupFilters();
    setupSort();
    setupShopSearch();
});

// Setup search for shop page
function setupShopSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                performSearch(searchTerm);
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    performSearch(searchTerm);
                }
            }
        });
    }
}

// Perform search
function performSearch(searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    
    const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
    );
    
    currentProducts = results;
    displayProducts(results);
    
    if (results.length === 0) {
        showNotification(`No products found for "${searchTerm}"`);
    } else {
        showNotification(`Found ${results.length} product(s) for "${searchTerm}"`);
    }
}

// Display products in grid
function displayProducts(products) {
    const productGrid = document.getElementById('shop-products');
    const productCount = document.getElementById('product-count');
    
    if (!productGrid) return;
    
    productCount.textContent = products.length;
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="quick-view">Quick View</button>
            </div>
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn btn-add-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    // Re-attach event listeners for new elements
    attachProductListeners();
}

// Attach event listeners to products
function attachProductListeners() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    const quickViewButtons = document.querySelectorAll('.quick-view');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', handleQuickView);
    });
}

// Setup filter functionality
function setupFilters() {
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const priceRadios = document.querySelectorAll('input[name="price"]');
    
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    priceRadios.forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
}

// Apply filters
function applyFilters() {
    let filtered = [...allProducts];
    
    // Category filter
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);
    
    if (!selectedCategories.includes('all') && selectedCategories.length > 0) {
        filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }
    
    // Price filter
    const selectedPrice = document.querySelector('input[name="price"]:checked').value;
    
    if (selectedPrice !== 'all') {
        if (selectedPrice === '0-25') {
            filtered = filtered.filter(product => product.price < 25);
        } else if (selectedPrice === '25-40') {
            filtered = filtered.filter(product => product.price >= 25 && product.price <= 40);
        } else if (selectedPrice === '40+') {
            filtered = filtered.filter(product => product.price > 40);
        }
    }
    
    currentProducts = filtered;
    displayProducts(currentProducts);
    
    // Clear search input when filters are applied
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Setup sort functionality
function setupSort() {
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

// Sort products
function sortProducts(sortType) {
    let sorted = [...currentProducts];
    
    switch(sortType) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sorted.reverse();
            break;
        default:
            // Featured - original order
            break;
    }
    
    displayProducts(sorted);
}

// Handle add to cart from shop page
function handleAddToCart(e) {
    e.stopPropagation();
    
    const productCard = e.target.closest('.product-card');
    const productId = parseInt(productCard.getAttribute('data-product-id'));
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        const cartItem = {
            name: product.name,
            price: `$${product.price.toFixed(2)}`,
            quantity: 1,
            id: Date.now()
        };
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCount();
        showNotification(`${product.name} added to cart!`);
        
        e.target.textContent = 'Added!';
        e.target.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            e.target.textContent = 'Add to Cart';
            e.target.style.backgroundColor = '';
        }, 1500);
    }
}

// Handle quick view
function handleQuickView(e) {
    e.stopPropagation();
    const productCard = e.target.closest('.product-card');
    const productId = parseInt(productCard.getAttribute('data-product-id'));
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        showNotification(`Quick view: ${product.name}`);
        // Here you would show a modal with product details
    }
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
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
