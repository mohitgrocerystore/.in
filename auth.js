// User type switching functionality
const typeBtns = document.querySelectorAll('.type-btn');
const authContainer = document.querySelector('.auth-container');

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active type button
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update container class
        authContainer.classList.remove('seller-selected');
        if (btn.dataset.type === 'seller') {
            authContainer.classList.add('seller-selected');
        }
    });
});

// Tab switching functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        const isSeller = authContainer.classList.contains('seller-selected');
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding form
        authForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${isSeller ? 'seller' : 'customer'}-${tabName}-form`) {
                form.classList.add('active');
            }
        });
    });
});

// Handle Customer Login
function handleCustomerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Get stored users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store login status if remember me is checked
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        // Redirect to account page
        window.location.href = 'account.html';
    } else {
        alert('Invalid email or password');
    }
}

// Handle Customer Registration
function handleCustomerRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const address = document.getElementById('register-address').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validate password match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Get stored users
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user already exists
    if (users.some(user => user.email === email)) {
        alert('Email already registered');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        address,
        password,
        orders: [],
        createdAt: new Date().toISOString()
    };

    // Add user to storage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));

    // Redirect to account page
    window.location.href = 'account.html';
}

// Handle Seller Login
function handleSellerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('seller-login-email').value;
    const password = document.getElementById('seller-login-password').value;
    const rememberMe = document.getElementById('seller-remember-me').checked;

    // Get stored sellers
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const seller = sellers.find(s => s.email === email && s.password === password);

    if (seller) {
        // Store login status if remember me is checked
        if (rememberMe) {
            localStorage.setItem('currentSeller', JSON.stringify(seller));
        } else {
            sessionStorage.setItem('currentSeller', JSON.stringify(seller));
        }
        
        // Redirect to seller dashboard
        window.location.href = 'seller-dashboard.html';
    } else {
        alert('Invalid email or password');
    }
}

// Handle Seller Registration
function handleSellerRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('seller-register-name').value;
    const email = document.getElementById('seller-register-email').value;
    const phone = document.getElementById('seller-register-phone').value;
    const address = document.getElementById('seller-register-address').value;
    const password = document.getElementById('seller-register-password').value;
    const confirmPassword = document.getElementById('seller-register-confirm-password').value;

    // Validate password match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Get stored sellers
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];

    // Check if seller already exists
    if (sellers.some(seller => seller.email === email)) {
        alert('Email already registered');
        return;
    }

    // Create new seller
    const newSeller = {
        id: Date.now(),
        name,
        email,
        phone,
        address,
        password,
        createdAt: new Date().toISOString()
    };

    // Add seller to storage
    sellers.push(newSeller);
    localStorage.setItem('sellers', JSON.stringify(sellers));

    // Auto login after registration
    sessionStorage.setItem('currentSeller', JSON.stringify(newSeller));

    // Redirect to seller dashboard
    window.location.href = 'seller-dashboard.html';
}

// Check if user is already logged in
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    const currentSeller = JSON.parse(localStorage.getItem('currentSeller')) || 
                         JSON.parse(sessionStorage.getItem('currentSeller'));
    
    if (currentUser) {
        window.location.href = 'account.html';
    } else if (currentSeller) {
        window.location.href = 'seller-dashboard.html';
    }
}

// Run on page load
checkAuthStatus();

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupForms();
    handleUrlHash();
});

// Handle URL hash for tab selection
function handleUrlHash() {
    const hash = window.location.hash.substring(1); // Remove the # symbol
    if (hash === 'customer' || hash === 'seller') {
        // Find and click the appropriate tab
        const tab = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
        if (tab) {
            tab.click();
        }
    }
}

// Setup tab switching functionality
function setupTabs() {
    // Main tabs (Customer/Seller)
    const mainTabs = document.querySelectorAll('.auth-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            mainTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');

            // Update URL hash without scrolling
            const newHash = tab.dataset.tab;
            history.pushState(null, '', `#${newHash}`);
        });
    });

    // Form tabs (Login/Register)
    const formTabs = document.querySelectorAll('.form-tabs .form-tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    formTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Get the parent tab content
            const parentContent = tab.closest('.tab-content');
            
            // Remove active class from all tabs and forms in this section
            parentContent.querySelectorAll('.form-tab-btn').forEach(t => t.classList.remove('active'));
            parentContent.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

            // Add active class to clicked tab and corresponding form
            tab.classList.add('active');
            parentContent.querySelector('#' + tab.dataset.form + 'Form').classList.add('active');
        });
    });
}

// Setup form submission handling
function setupForms() {
    // Customer Login Form
    document.getElementById('customerLoginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('customerEmail').value;
        const password = document.getElementById('customerPassword').value;

        try {
            const user = await loginCustomer(email, password);
            if (user) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Customer Register Form
    document.getElementById('customerRegisterForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('customerRegName').value,
            email: document.getElementById('customerRegEmail').value,
            phone: document.getElementById('customerRegPhone').value,
            password: document.getElementById('customerRegPassword').value,
            confirmPassword: document.getElementById('customerRegConfirmPassword').value
        };

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const user = await registerCustomer(formData);
            if (user) {
                window.location.href = 'index.html';
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Seller Login Form
    document.getElementById('sellerLoginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('sellerEmail').value;
        const password = document.getElementById('sellerPassword').value;

        try {
            const seller = await loginSeller(email, password);
            if (seller) {
                window.location.href = 'seller-dashboard.html';
            }
        } catch (error) {
            alert(error.message);
        }
    });

    // Seller Register Form
    document.getElementById('sellerRegisterForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            businessName: document.getElementById('sellerRegName').value,
            email: document.getElementById('sellerRegEmail').value,
            phone: document.getElementById('sellerRegPhone').value,
            gst: document.getElementById('sellerRegGST').value,
            address: document.getElementById('sellerRegAddress').value,
            password: document.getElementById('sellerRegPassword').value,
            confirmPassword: document.getElementById('sellerRegConfirmPassword').value
        };

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const seller = await registerSeller(formData);
            if (seller) {
                window.location.href = 'seller-dashboard.html';
            }
        } catch (error) {
            alert(error.message);
        }
    });
}

// Authentication Functions
async function loginCustomer(email, password) {
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Store user session
    localStorage.setItem('currentUser', JSON.stringify({
        ...user,
        type: 'customer'
    }));

    return user;
}

async function registerCustomer(formData) {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already exists
    if (users.some(u => u.email === formData.email)) {
        throw new Error('Email already registered');
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        type: 'customer',
        orders: []
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Store user session
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return newUser;
}

async function loginSeller(email, password) {
    // Get existing sellers from localStorage
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const seller = sellers.find(s => s.email === email && s.password === password);

    if (!seller) {
        throw new Error('Invalid email or password');
    }

    // Store seller session
    localStorage.setItem('currentUser', JSON.stringify({
        ...seller,
        type: 'seller'
    }));

    return seller;
}

async function registerSeller(formData) {
    // Get existing sellers
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];

    // Check if email already exists
    if (sellers.some(s => s.email === formData.email)) {
        throw new Error('Email already registered');
    }

    // Create new seller
    const newSeller = {
        id: Date.now(),
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        gst: formData.gst,
        address: formData.address,
        password: formData.password,
        type: 'seller',
        products: [],
        orders: []
    };

    // Add to sellers array
    sellers.push(newSeller);
    localStorage.setItem('sellers', JSON.stringify(sellers));

    // Store seller session
    localStorage.setItem('currentUser', JSON.stringify(newSeller));

    return newSeller;
} 