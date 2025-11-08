# 👶 OliverSales E-Commerce Website

![GitHub repo size](https://img.shields.io/github/repo-size/KA-BIT725/olivershop)
![GitHub stars](https://img.shields.io/github/stars/KA-BIT725/olivershop?style=social)
![GitHub forks](https://img.shields.io/github/forks/KA-BIT725/olivershop?style=social)

A modern, responsive e-commerce website for kids' clothing built with pure HTML, CSS, and JavaScript - no frameworks required!

## 🌐 Live Demo

[View Live Website](https://ka-bit725.github.io/olivershop/) (Coming soon)

## 📸 Screenshots

![OliverSales Homepage](images/hero-baby.png)

## 🚀 Features

- ✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
- ✅ **Shopping Cart** - Add items, view cart, and manage quantities
- ✅ **Product Search** - Search products by name or category
- ✅ **Product Filtering** - Filter by category, price range, and size
- ✅ **Product Sorting** - Sort by price, newest, or featured
- ✅ **24+ Products** - Full product catalog with images
- ✅ **Contact Form** - Working form with validation
- ✅ **Smooth Animations** - Hover effects and transitions
- ✅ **Local Storage** - Cart persists across browser sessions
- ✅ **No Dependencies** - Pure HTML, CSS, and JavaScript

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid and Flexbox
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Unsplash** - Product images (placeholder)

## 📁 Project Structure

```
oliversales-ecommerce/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling
├── js/
│   └── script.js       # JavaScript functionality
├── images/             # Product and category images
└── README.md           # This file
```

## 🎨 Adding Your Images

Replace these placeholder images with your actual product photos:

### Required Images:
1. **Hero Section**:
   - `images/hero-baby.jpg` - Main banner image (recommended: 800x600px)

2. **Categories**:
   - `images/tops.jpg` - T-shirts category (recommended: 500x500px)
   - `images/bottoms.jpg` - Shorts/pants category (recommended: 500x500px)
   - `images/dresses.jpg` - Dresses category (recommended: 500x500px)
   - `images/new-arrivals.jpg` - New items (recommended: 500x500px)

3. **Featured Products**:
   - `images/product-1.jpg` through `images/product-4.jpg`
   - Recommended size: 600x600px for each product

### Image Tips:
- Use high-quality photos with good lighting
- Keep consistent background colors (white or light beige works best)
- Optimize images for web (use tools like TinyPNG)
- Save as JPG for photos, PNG for graphics with transparency

## 🖥️ How to Run

### Option 1: Direct File Opening
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start shopping!

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 🛠️ Customization

### Change Colors:
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-navy: #1e3a5f;      /* Main navy blue */
    --primary-beige: #e8dcc8;     /* Light beige background */
    --accent-brown: #8b6f47;      /* Brown accents */
}
```

### Add More Products:
In `index.html`, duplicate a product card and modify:
```html
<div class="product-card">
    <div class="product-image">
        <img src="images/your-product.jpg" alt="Product Name">
        <button class="quick-view">Quick View</button>
    </div>
    <div class="product-info">
        <h4 class="product-name">Your Product Name</h4>
        <p class="product-price">$XX.XX</p>
        <button class="btn btn-add-cart">Add to Cart</button>
    </div>
</div>
```

### Update Business Info:
- Change "OLIVERSALES" in `index.html` to your business name
- Update footer contact information
- Add social media links in the footer

## 📱 Features Breakdown

### Navigation
- Sticky header that stays visible while scrolling
- Mobile-responsive menu
- Active link highlighting

### Shopping Cart
- Add products with one click
- View cart summary
- Remove items
- Persistent storage (cart saved in browser)

### Product Display
- Category cards with hover effects
- Featured products grid
- Quick view buttons
- Responsive image galleries

## 🔧 Browser Compatibility

Works on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📝 Next Steps

1. **Add Your Images**: Replace all placeholder images
2. **Update Content**: Change product names and prices
3. **Test on Mobile**: Check responsive design on different devices
4. **Add More Pages**: Create separate pages for Shop, About, Contact
5. **Backend Integration**: Connect to a database and payment system (advanced)

## 🎯 Future Enhancements

- [ ] Backend integration with Node.js/Express
- [ ] User authentication system
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Admin dashboard for product management
- [ ] Order tracking system
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Newsletter subscription
- [ ] SEO optimization

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## � Contact

**Project Owner:** KA-BIT725  
**Repository:** [https://github.com/KA-BIT725/olivershop](https://github.com/KA-BIT725/olivershop)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ for OliverSales**
