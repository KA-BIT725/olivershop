// Shop page functionality

// Sample product data with ratings
const allProducts = [
    { id: 1, name: "Organic Cotton T-Shirt", price: 24.99, category: "tops", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=600&fit=crop", rating: 4.5, reviews: 127 },
    { id: 2, name: "Comfortable Shorts", price: 19.99, category: "bottoms", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop", rating: 4.8, reviews: 95 },
    { id: 3, name: "Summer Dress", price: 34.99, category: "dresses", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop", rating: 4.7, reviews: 203 },
    { id: 4, name: "Cozy Romper", price: 29.99, category: "new", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop", rating: 4.6, reviews: 88 },
    { id: 5, name: "Striped Polo Shirt", price: 26.99, category: "tops", image: "https://images.unsplash.com/photo-1596265371388-43edbaadab94?w=600&h=600&fit=crop", rating: 4.3, reviews: 67 },
    { id: 6, name: "Denim Jeans", price: 32.99, category: "bottoms", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop", rating: 4.9, reviews: 156 },
    { id: 7, name: "Flower Print Dress", price: 38.99, category: "dresses", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600&h=600&fit=crop", rating: 4.7, reviews: 112 },
    { id: 8, name: "Cozy Hoodie", price: 42.99, category: "new", image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=600&fit=crop", rating: 4.8, reviews: 145 },
    { id: 9, name: "Basic Tee Pack (3)", price: 39.99, category: "tops", image: "https://images.unsplash.com/photo-1485218126466-34e6392ec754?w=600&h=600&fit=crop", rating: 4.6, reviews: 234 },
    { id: 10, name: "Cargo Pants", price: 29.99, category: "bottoms", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop", rating: 4.4, reviews: 78 },
    { id: 11, name: "Party Dress", price: 45.99, category: "dresses", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop", rating: 4.9, reviews: 189 },
    { id: 12, name: "Sleep Set", price: 35.99, category: "new", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600&h=600&fit=crop", rating: 4.7, reviews: 92 },
    { id: 13, name: "Graphic Tee", price: 22.99, category: "tops", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=600&fit=crop", rating: 4.5, reviews: 167 },
    { id: 14, name: "Swim Shorts", price: 24.99, category: "bottoms", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop", rating: 4.6, reviews: 121 },
    { id: 15, name: "Casual Dress", price: 31.99, category: "dresses", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop", rating: 4.4, reviews: 98 },
    { id: 16, name: "Winter Jacket", price: 54.99, category: "new", image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=600&fit=crop", rating: 4.8, reviews: 176 },
    { id: 17, name: "Long Sleeve Shirt", price: 28.99, category: "tops", image: "https://images.unsplash.com/photo-1596265371388-43edbaadab94?w=600&h=600&fit=crop", rating: 4.5, reviews: 89 },
    { id: 18, name: "Leggings", price: 18.99, category: "bottoms", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop", rating: 4.7, reviews: 213 },
    { id: 19, name: "Tutu Dress", price: 42.99, category: "dresses", image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600&h=600&fit=crop", rating: 4.9, reviews: 156 },
    { id: 20, name: "Overalls", price: 39.99, category: "new", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop", rating: 4.6, reviews: 134 },
    { id: 21, name: "Tank Top", price: 16.99, category: "tops", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=600&fit=crop", rating: 4.3, reviews: 87 },
    { id: 22, name: "Joggers", price: 26.99, category: "bottoms", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop", rating: 4.7, reviews: 198 },
    { id: 23, name: "Maxi Dress", price: 48.99, category: "dresses", image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop", rating: 4.8, reviews: 165 },
    { id: 24, name: "Sweater Set", price: 44.99, category: "new", image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=600&fit=crop", rating: 4.6, reviews: 142 }
];

let currentProducts = [...allProducts];
let currentPage = 1;
const itemsPerPage = 12;

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
    currentPage = 1; // Reset to first page
    displayProducts(results);
    
    if (results.length === 0) {
        showNotification(`No products found for "${searchTerm}"`);
    } else {
        showNotification(`Found ${results.length} product(s) for "${searchTerm}"`);
    }
}

// Display products in grid with pagination
function displayProducts(products) {
    const productGrid = document.getElementById('shop-products');
    const productCount = document.getElementById('product-count');
    
    if (!productGrid) return;
    
    productCount.textContent = products.length;
    
    // Calculate pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    // Generate star rating HTML
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    productGrid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="quick-view">Quick View</button>
            </div>
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn btn-add-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    // Update pagination
    updatePagination(totalPages);
    
    // Re-attach event listeners for new elements
    attachProductListeners();
}

// Update pagination controls
function updatePagination(totalPages) {
    const pagination = document.querySelector('.pagination');
    if (!pagination || totalPages <= 1) {
        if (pagination) pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" 
                              onclick="changePage(${currentPage - 1})" 
                              ${currentPage === 1 ? 'disabled' : ''}>
                          &laquo; Previous
                       </button>`;
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" 
                                  onclick="changePage(${i})">
                              ${i}
                           </button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
        paginationHTML += `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                              onclick="changePage(${currentPage + 1})"
                              ${currentPage === totalPages ? 'disabled' : ''}>
                          Next &raquo;
                       </button>`;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayProducts(currentProducts);
    
    // Scroll to top of products
    document.querySelector('.shop-content').scrollIntoView({ behavior: 'smooth' });
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
    currentPage = 1; // Reset to first page
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

// Add styles for product ratings and pagination
const shopStyles = document.createElement('style');
shopStyles.textContent = `
    .product-rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin: 0.5rem 0;
        color: #ffa500;
        font-size: 0.9rem;
    }
    
    .product-rating .fa-star,
    .product-rating .fa-star-half-alt {
        color: #ffa500;
    }
    
    .product-rating .fa-star.far {
        color: #ddd;
    }
    
    .rating-count {
        color: #666;
        margin-left: 0.25rem;
        font-size: 0.85rem;
    }
    
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    }
    
    .page-btn {
        padding: 0.5rem 1rem;
        border: 1px solid #e0e0e0;
        background-color: white;
        color: var(--text-dark);
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .page-btn:hover:not(.disabled):not(.active) {
        background-color: var(--primary-beige);
        border-color: var(--accent-brown);
    }
    
    .page-btn.active {
        background-color: var(--accent-brown);
        color: white;
        border-color: var(--accent-brown);
    }
    
    .page-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .page-dots {
        padding: 0 0.5rem;
        color: #999;
    }
    
    @media (max-width: 768px) {
        .pagination {
            gap: 0.25rem;
        }
        
        .page-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
        }
    }
`;
document.head.appendChild(shopStyles);
