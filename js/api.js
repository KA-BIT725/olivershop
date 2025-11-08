/**
 * API Configuration and Helper Functions
 * This file provides utilities to integrate the frontend with the backend API
 */

const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    TIMEOUT: 10000
};

// API Helper Functions
const API = {
    /**
     * Make a GET request
     */
    async get(endpoint, params = {}) {
        const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return await response.json();
    },

    /**
     * Make a POST request
     */
    async post(endpoint, data) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API Error');
        }
        
        return await response.json();
    },

    /**
     * Make a PATCH request
     */
    async patch(endpoint, data) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return await response.json();
    },

    /**
     * Make a DELETE request
     */
    async delete(endpoint) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        return await response.json();
    }
};

// Product API Methods
const ProductAPI = {
    /**
     * Get all products with filtering and pagination
     */
    async getProducts(options = {}) {
        const { category, minPrice, maxPrice, search, sort, page, limit } = options;
        return await API.get('/products', {
            ...(category && { category }),
            ...(minPrice && { minPrice }),
            ...(maxPrice && { maxPrice }),
            ...(search && { search }),
            ...(sort && { sort }),
            ...(page && { page }),
            ...(limit && { limit })
        });
    },

    /**
     * Get single product by ID
     */
    async getProduct(id) {
        return await API.get(`/products/${id}`);
    },

    /**
     * Get product reviews
     */
    async getReviews(productId) {
        return await API.get(`/products/${productId}/reviews`);
    },

    /**
     * Add product review
     */
    async addReview(productId, reviewData) {
        return await API.post(`/products/${productId}/reviews`, reviewData);
    }
};

// Order API Methods
const OrderAPI = {
    /**
     * Get orders by user email
     */
    async getOrders(email) {
        return await API.get('/orders', { email });
    },

    /**
     * Get single order by order number
     */
    async getOrder(orderNumber) {
        return await API.get(`/orders/${orderNumber}`);
    },

    /**
     * Create new order
     */
    async createOrder(orderData) {
        return await API.post('/orders', orderData);
    }
};

// Wishlist API Methods
const WishlistAPI = {
    /**
     * Get wishlist items
     */
    async getWishlist(sessionId) {
        return await API.get('/wishlist', { session_id: sessionId });
    },

    /**
     * Add item to wishlist
     */
    async addToWishlist(productId, sessionId) {
        return await API.post('/wishlist', {
            product_id: productId,
            session_id: sessionId
        });
    },

    /**
     * Remove item from wishlist
     */
    async removeFromWishlist(wishlistId) {
        return await API.delete(`/wishlist/${wishlistId}`);
    }
};

// Newsletter API Methods
const NewsletterAPI = {
    /**
     * Subscribe to newsletter
     */
    async subscribe(email) {
        return await API.post('/newsletter/subscribe', { email });
    },

    /**
     * Unsubscribe from newsletter
     */
    async unsubscribe(email) {
        return await API.post('/newsletter/unsubscribe', { email });
    }
};

// User API Methods
const UserAPI = {
    /**
     * Register new user
     */
    async register(userData) {
        return await API.post('/users/register', userData);
    },

    /**
     * Login user
     */
    async login(email, password) {
        return await API.post('/users/login', { email, password });
    },

    /**
     * Get user profile
     */
    async getProfile(userId) {
        return await API.get(`/users/profile/${userId}`);
    },

    /**
     * Update user profile
     */
    async updateProfile(userId, profileData) {
        return await API.patch(`/users/profile/${userId}`, profileData);
    }
};

// Export all API methods
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API,
        ProductAPI,
        OrderAPI,
        WishlistAPI,
        NewsletterAPI,
        UserAPI
    };
}
