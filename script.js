// Global variables
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load products from Excel (using SheetJS library)
async function loadProductsFromExcel() {
    try {
        // For demo, using sample data. Replace with actual Excel loading
        const response = await fetch('data/products.json'); // Convert Excel to JSON first
        const data = await response.json();
        allProducts = data;
        displayFeaturedProducts();
        displayAllProducts();
        populateFilters();
        updateCartCount();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback sample data
        allProducts = sampleProducts;
        displayFeaturedProducts();
        displayAllProducts();
    }
}

// Sample products (replace with your Excel data)
const sampleProducts = [
    {
        id: 1,
        name: "Floral Maxi Dress",
        category: "Dresses",
        price: 1299,
        description: "Elegant floral print maxi dress perfect for any occasion",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d5d6?w=400",
        size: "M,L,XL",
        color: "Red",
        stock: 10
    },
    {
        id: 2,
        name: "Crop Top",
        category: "Tops",
        price: 499,
        description: "Stylish crop top for casual wear",
        image: "https://images.unsplash.com/photo-1585818624578-47d9f4897a62?w=400",
        size: "S,M",
        color: "Black",
        stock: 15
    }
    // Add more products from your Excel
];

// Display featured products
function displayFeaturedProducts(products = allProducts.slice(0, 8)) {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Display all products
function displayAllProducts(products = allProducts) {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" onclick="viewProduct(${product.id})">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3>${product.name}</h3>
                <div class="product-price">₹${product.price}</div>
                <p>${product.description}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Add to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

// Filter products
function filterProducts() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const priceRange = document.getElementById('priceFilter')?.value || '';
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    
    let filtered = allProducts;
    
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }
    
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (priceRange === '1000+') {
            filtered = filtered.filter(p => p.price >= 1000);
        } else {
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }
    }
    
    if (search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.description.toLowerCase().includes(search)
        );
    }
    
    displayAllProducts(filtered);
}

// Populate filters
function populateFilters() {
    const categories = [...new Set(allProducts.map(p => p.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">All Categories</option>' + 
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromExcel();
    
    // Filter events
    document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
    document.getElementById('priceFilter')?.addEventListener('change', filterProducts);
    document.getElementById('searchInput')?.addEventListener('input', filterProducts);
});

// Initialize
updateCartCount();
