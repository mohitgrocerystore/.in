// Check if seller is logged in
function checkSellerAuth() {
    const currentSeller = JSON.parse(localStorage.getItem('currentSeller')) || 
                         JSON.parse(sessionStorage.getItem('currentSeller'));
    
    if (!currentSeller) {
        window.location.href = 'seller.html';
    }
}

// Get all orders from all users
function getAllOrders() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let allOrders = [];
    
    users.forEach(user => {
        if (user.orders && user.orders.length > 0) {
            user.orders.forEach(order => {
                allOrders.push({
                    ...order,
                    customerName: user.name,
                    customerEmail: user.email,
                    customerPhone: user.phone,
                    deliveryAddress: user.address
                });
            });
        }
    });
    
    return allOrders;
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    users.forEach(user => {
        if (user.orders) {
            user.orders.forEach(order => {
                if (order.id === orderId) {
                    order.status = newStatus;
                    order.lastUpdated = new Date().toISOString();
                }
            });
        }
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    displayOrders(currentFilter);
}

// Display order items preview
function getOrderItemsPreview(items) {
    if (!items || items.length === 0) return 'No items';
    
    const itemsList = items.map(item => `
        <li>${item.name} (${item.quantity})</li>
    `).join('');
    
    return `
        <div class="order-items-preview">
            <ul>${itemsList}</ul>
        </div>
    `;
}

// Display orders in the table
function displayOrders(status = 'all') {
    const orders = getAllOrders();
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';
    
    const filteredOrders = status === 'all' 
        ? orders 
        : orders.filter(order => order.status === status);
    
    filteredOrders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>
                <strong>${order.customerName}</strong><br>
                <small>${order.customerEmail}</small>
            </td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${getOrderItemsPreview(order.items)}</td>
            <td>₹${order.total.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="view-details-btn" onclick="showOrderDetails(${order.id})">View Details</button>
                <select class="status-select" data-order-id="${order.id}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Add event listeners to status selects
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const orderId = e.target.dataset.orderId;
            const newStatus = e.target.value;
            updateOrderStatus(orderId, newStatus);
        });
    });
}

// Show order details in modal
function showOrderDetails(orderId) {
    const orders = getAllOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Populate customer details
    document.getElementById('customerName').textContent = `Name: ${order.customerName}`;
    document.getElementById('customerEmail').textContent = `Email: ${order.customerEmail}`;
    document.getElementById('customerPhone').textContent = `Phone: ${order.customerPhone}`;
    document.getElementById('deliveryAddress').textContent = `Delivery Address: ${order.deliveryAddress}`;
    
    // Populate order items
    const itemsBody = document.getElementById('orderItemsBody');
    itemsBody.innerHTML = order.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');
    
    // Set current status in select
    const statusSelect = document.getElementById('statusUpdate');
    statusSelect.value = order.status;
    
    // Update button click handler
    const updateBtn = document.getElementById('updateStatusBtn');
    updateBtn.onclick = () => {
        updateOrderStatus(orderId, statusSelect.value);
        closeModal();
    };
    
    // Show modal
    const modal = document.getElementById('orderDetailsModal');
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('orderDetailsModal');
    modal.style.display = 'none';
}

// Handle filter buttons
let currentFilter = 'all';
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update and display filtered orders
        currentFilter = btn.dataset.status;
        displayOrders(currentFilter);
    });
});

// Handle modal close button
document.querySelector('.close-modal').addEventListener('click', closeModal);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('orderDetailsModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Handle logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentSeller');
    sessionStorage.removeItem('currentSeller');
    window.location.href = 'seller.html';
});

// Initialize dashboard
checkSellerAuth();
displayOrders(); 