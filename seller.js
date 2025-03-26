// Handle Seller Login
document.getElementById('seller-login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('seller-email').value;
    const password = document.getElementById('seller-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

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
});

// Check if seller is already logged in
function checkSellerAuthStatus() {
    const currentSeller = JSON.parse(localStorage.getItem('currentSeller')) || 
                         JSON.parse(sessionStorage.getItem('currentSeller'));
    
    if (currentSeller) {
        window.location.href = 'seller-dashboard.html';
    }
}

// Run on page load
checkSellerAuthStatus(); 