// Product Database
const products = [
    {
        id: 1,
        name: "Fresh Apples (1kg)",
        price: 180,
        category: "fruits",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Organic Bananas (1kg)",
        price: 60,
        category: "fruits",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Orange (1kg)",
        price: 60,
        category: "fruits",
        image: "https://images.pexels.com/photos/207085/pexels-photo-207085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 4,
        name: "Fresh Tomatoes (1kg)",
        price: 40,
        category: "vegetables",
        image: "https://cdn.pixabay.com/photo/2019/07/03/20/56/tomatoes-4315442_1280.png"
    },
    {
        id: 5,
        name: "Fresh onion (1kg)",
        price: 40,
        category: "vegetables",
        image: "https://th.bing.com/th/id/OIP.1YQ71nes_d_XAKGnLhTPEQAAAA?rs=1&pid=ImgDetMain"
    },
    {
        id: 6,
        name: "Organic Potatoes (1kg)",
        price: 30,
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Fresh Milk (1litre)",
        price: 60,
        category: "dairy",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Cheese (1kg)",
        price: 220,
        category: "dairy",
        image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 9,
        name: "Amul Butter (1kg)",
        price: 520,
        category: "dairy",
        image: "https://d1z88p83zuviay.cloudfront.net/ProductVariantImages/41da6cd3-1b93-4140-a49c-f772ae762980.jpg"
    },
    {
        id: 10,
        name: "Rice (1kg)",
        price: 60,
        category: "groceries",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 11,
        name: "Dal (1kg)",
        price: 120,
        category: "groceries",
        image: "https://greenwoodhigh.edu.in/wp-content/uploads/2024/02/image-29.png.webp"
    },
    {
        id: 12,
        name: "Aashirvaad Flour (10kg)",
        price: 520,
        category: "groceries",
        image: "https://www.seekpng.com/png/full/237-2370481_aashirwad-flour-aashirvaad-atta-10-kg.png"
    },
    {
        id: 13,
        name: "Tata premium tea (100g)",
        price: 40,
        category: "groceries",
        image: "https://www.tatanutrikorner.com/cdn/shop/products/6626510-1_Tata_Tea_Premium_Leaf-_UP_Laminate_Sachet-Pouch_250g_FOP.png?v=1670607580"
    },
    {
        id: 14,
        name: "Sugar (1kg)",
        price: 40,
        category: "groceries",
        image: "https://st.depositphotos.com/1000589/3274/i/600/depositphotos_32749269-stock-photo-sugar-on-wooden-table.jpg"
    },
    {
        id: 15,
        name: "Tata Salt (1kg)",
        price: 30,
        category: "groceries",
        image: "https://m.media-amazon.com/images/I/614mm2hYHyL._SL1000_.jpg"
    }
];

// Cart State
let cart = [];

// Check authentication state
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeCart = document.getElementById('closeCart');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts('all');
    setupEventListeners();
    updateAuthUI();
    setupMobileMenu();
});

// Setup Mobile Menu
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navItems = document.getElementById('navItems');
    
    menuToggle.addEventListener('click', () => {
        navItems.classList.toggle('active');
        menuToggle.innerHTML = navItems.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-items') && 
            !e.target.closest('.menu-toggle') && 
            navItems.classList.contains('active')) {
            navItems.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Close menu when clicking on a link
    navItems.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navItems.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            displayProducts(btn.dataset.category);
        });
    });

    // Cart toggle
    document.querySelector('.cart-icon').addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);

    // Checkout button
    checkoutBtn.addEventListener('click', initiatePayment);

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchProducts(searchTerm);
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchProducts(searchTerm);
    });
}

// Display Products
function displayProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    // Update cart items display
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">₹${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
        </div>
    `).join('');

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;

    // Update cart count
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function toggleCart() {
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

// Update UI based on auth state
function updateAuthUI() {
    const userName = document.getElementById('userName');
    const guestLinks = document.querySelectorAll('.guest-link');
    const userLinks = document.querySelectorAll('.user-link');

    if (currentUser) {
        userName.textContent = currentUser.name;
        guestLinks.forEach(link => link.style.display = 'none');
        userLinks.forEach(link => link.style.display = 'block');
    } else {
        userName.textContent = 'Login';
        guestLinks.forEach(link => link.style.display = 'block');
        userLinks.forEach(link => link.style.display = 'none');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    currentUser = null;
    updateAuthUI();
    cart = [];
    updateCart();
}

// Update the initiatePayment function to handle authentication
function initiatePayment() {
    if (!currentUser) {
        alert('Please login to proceed with checkout');
        window.location.href = 'auth.html';
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

    switch (selectedPayment) {
        case 'upi':
            initiateUPIPayment(total);
            break;
        case 'card':
            initiateCardPayment(total);
            break;
        case 'cod':
            initiateCODPayment(total);
            break;
    }
}

function initiateUPIPayment(total) {
    const options = {
        key: 'YOUR_RAZORPAY_KEY',
        amount: total * 100,
        currency: 'INR',
        name: 'Fresh Mart',
        description: 'Grocery Purchase',
        handler: handlePaymentSuccess,
        prefill: {
            name: '',
            email: '',
            contact: ''
        },
        theme: {
            color: '#2ecc71'
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

function initiateCardPayment(total) {
    const options = {
        key: 'YOUR_RAZORPAY_KEY',
        amount: total * 100,
        currency: 'INR',
        name: 'Fresh Mart',
        description: 'Grocery Purchase',
        handler: handlePaymentSuccess,
        prefill: {
            name: '',
            email: '',
            contact: ''
        },
        theme: {
            color: '#2ecc71'
        },
        method: {
            netbanking: false,
            card: true,
            wallet: false,
            upi: false
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

function initiateCODPayment(total) {
    const orderDetails = {
        items: cart,
        total: total,
        paymentMethod: 'COD'
    };

    // Here you would typically send this to your backend
    // For demo purposes, we'll just show a success message
    handlePaymentSuccess({
        razorpay_payment_id: 'COD-' + Date.now(),
        cod: true
    });
}

// Update handlePaymentSuccess to save order to user's account
function handlePaymentSuccess(response) {
    const orderId = response.cod ? response.razorpay_payment_id : 'COD-' + Date.now();
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order object
    const order = {
        id: orderId,
        date: new Date().toISOString(),
        items: [...cart],
        total: orderTotal,
        status: response.cod ? 'Pending' : 'Paid',
        paymentMethod: response.cod ? 'Cash on Delivery' : 'Online Payment'
    };

    // Add order to user's orders
    currentUser.orders.push(order);
    updateUserStorage();

    let message = 'Payment successful!';
    if (response.cod) {
        message = 'Order placed successfully! You can pay ₹' + orderTotal + ' at the time of delivery.';
    } else {
        message = 'Payment successful! Order ID: ' + response.razorpay_payment_id;
    }
    
    alert(message);
    cart = [];
    updateCart();
    toggleCart();
}

// Add this function to update user storage
function updateUserStorage() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }

    if (localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Close cart when clicking outside
window.onclick = function(event) {
    if (event.target === cartModal) {
        toggleCart();
    }
};

// Search Products
function searchProducts(searchTerm) {
    if (!searchTerm) {
        displayProducts('all');
        return;
    }

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    productsGrid.innerHTML = filteredProducts.length ? filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('') : '<p class="no-results">No products found matching your search.</p>';
} 