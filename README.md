# OliverSales E-Commerce Website

A modern, responsive e-commerce website for kids' clothing built with HTML, CSS, and JavaScript.

## 🚀 Features

- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Shopping Cart** - Add items, view cart, and manage quantities
- **Product Categories** - Browse by Tops, Bottoms, Dresses, and New Arrivals
- **Search Functionality** - Search for products
- **Smooth Animations** - Hover effects and transitions
- **Local Storage** - Cart persists across browser sessions

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

1. **Open the website**:
   - Double-click `index.html` to open in your default browser
   - OR right-click → "Open with" → Choose your browser

2. **For development** (optional):
   - Use VS Code with Live Server extension
   - Or use any local web server

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

- Product detail pages
- User authentication
- Payment gateway integration
- Order history
- Product reviews and ratings
- Wishlist functionality
- Size and color selectors
- Inventory management

## 📞 Support

For questions or issues with this website template, check:
- HTML/CSS/JavaScript documentation
- Browser developer tools (F12)
- VS Code documentation

## 📄 License

Free to use for your business. Customize as needed!

---

**Built with ❤️ for OliverSales**
