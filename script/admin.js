// Navigation
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupModals();
    loadDashboardData();
    setupCharts();
    setupEventListeners();
    updateAdminInfo();
    protectAdminRoute();
    // Fetch admin info from session/localStorage
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo')) || {};
    
    // Update admin username and role in the header
    const adminUsername = document.getElementById('adminUsername');
    const adminRole = document.getElementById('adminRole');
    
    if (adminInfo.username) {
        adminUsername.textContent = adminInfo.username;
        adminRole.textContent = adminInfo.role || 'Administrator';
    } else {
        // Redirect to login page if no admin info is found
        window.location.href = 'login.html';
    }

    // Add logout button functionality
    const logoutButton = document.querySelector('.logout-btn');
    logoutButton.addEventListener('click', function() {
        // Clear admin session data
        localStorage.removeItem('adminInfo');
        
        // Redirect to login page
        window.location.href = 'login.html';
    });
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetSection = link.getAttribute('data-section');
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            // Load section-specific data
            loadSectionData(targetSection);
        });
    });
}

// Modal Management
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => modal.style.display = 'none');
        });
    });

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function showAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function showAddBookModal() {
    document.getElementById('addBookModal').style.display = 'block';
}

// Dashboard Data
function loadDashboardData() {
    // Fetch and update statistics
    fetchDashboardStats();
    // Fetch and update recent activity
    fetchRecentActivity();
}

async function fetchDashboardStats() {
    try {
        const response = await fetch('/api/admin/dashboard-stats');
        const data = await response.json();
        
        // Update statistics
        updateStatistics(data);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Set default values if API is not available
        updateStatistics({
            totalUsers: 0,
            totalBooks: 0,
            activeTransactions: 0,
            totalReviews: 0
        });
    }
}

function updateStatistics(data) {
    document.querySelector('.stat-number:nth-child(1)').textContent = data.totalUsers;
    document.querySelector('.stat-number:nth-child(2)').textContent = data.totalBooks;
    document.querySelector('.stat-number:nth-child(3)').textContent = data.activeTransactions;
    document.querySelector('.stat-number:nth-child(4)').textContent = data.totalReviews;
}

async function fetchRecentActivity() {
    try {
        const response = await fetch('/api/admin/recent-activity');
        const activities = await response.json();
        
        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <span class="activity-time">${formatDate(activity.timestamp)}</span>
                <span class="activity-text">${activity.description}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        // Set default message if API is not available
        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = '<div class="activity-item">No recent activity</div>';
    }
}

// Section Data Loading
function loadSectionData(section) {
    switch(section) {
        case 'users':
            loadUsers();
            break;
        case 'books':
            loadBooks();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'reports':
            updateCharts();
            break;
    }
}

// Users Management
async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users');
        const users = await response.json();
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>
                    <button onclick="editUser(${user.id})" class="action-btn edit">Edit</button>
                    <button onclick="deleteUser(${user.id})" class="action-btn delete">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        // Set default message if API is not available
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '<tr><td colspan="6">No users available</td></tr>';
    }
}

// Books Management
async function loadBooks() {
    try {
        const response = await fetch('/api/admin/books');
        const books = await response.json();
        
        const tbody = document.getElementById('booksTableBody');
        tbody.innerHTML = books.map(book => `
            <tr>
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${book.status}</td>
                <td>
                    <button onclick="editBook(${book.id})" class="action-btn edit">Edit</button>
                    <button onclick="deleteBook(${book.id})" class="action-btn delete">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading books:', error);
        // Set default message if API is not available
        const tbody = document.getElementById('booksTableBody');
        tbody.innerHTML = '<tr><td colspan="6">No books available</td></tr>';
    }
}

// Transactions Management
async function loadTransactions() {
    try {
        const response = await fetch('/api/admin/transactions');
        const transactions = await response.json();
        
        const tbody = document.getElementById('transactionsTableBody');
        tbody.innerHTML = transactions.map(transaction => `
            <tr>
                <td>${transaction.id}</td>
                <td>${transaction.type}</td>
                <td>${transaction.user}</td>
                <td>${formatCurrency(transaction.amount)}</td>
                <td>${transaction.status}</td>
                <td>${formatDate(transaction.date)}</td>
                <td>
                    <button onclick="viewTransaction(${transaction.id})" class="action-btn view">View</button>
                    <button onclick="updateTransactionStatus(${transaction.id})" class="action-btn edit">Update Status</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading transactions:', error);
        // Set default message if API is not available
        const tbody = document.getElementById('transactionsTableBody');
        tbody.innerHTML = '<tr><td colspan="7">No transactions available</td></tr>';
    }
}

// Charts Setup
function setupCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Sales',
                data: [0, 0, 0, 0, 0, 0],
                borderColor: '#3498db',
                tension: 0.1
            }]
        }
    });

    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
    new Chart(userGrowthCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Users',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: '#2ecc71'
            }]
        }
    });

    // Categories Chart
    const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
    new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Fiction', 'Non-Fiction', 'Educational', 'Children'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f']
            }]
        }
    });

    // Transaction Types Chart
    const transactionTypesCtx = document.getElementById('transactionTypesChart').getContext('2d');
    new Chart(transactionTypesCtx, {
        type: 'pie',
        data: {
            labels: ['Sales', 'Exchanges', 'Donations'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
            }]
        }
    });
}

async function updateCharts() {
    try {
        const response = await fetch('/api/admin/chart-data');
        const data = await response.json();
        
        // Update all charts with new data
        updateChartData('salesChart', data.sales);
        updateChartData('userGrowthChart', data.userGrowth);
        updateChartData('categoriesChart', data.categories);
        updateChartData('transactionTypesChart', data.transactionTypes);
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

// Event Listeners
function setupEventListeners() {
    // Form submissions
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
    document.getElementById('generalSettingsForm').addEventListener('submit', handleGeneralSettings);
    document.getElementById('emailSettingsForm').addEventListener('submit', handleEmailSettings);

    // Filters
    document.getElementById('userFilter').addEventListener('change', filterUsers);
    document.getElementById('bookFilter').addEventListener('change', filterBooks);
    document.getElementById('transactionFilter').addEventListener('change', filterTransactions);
}

// Form Handlers
async function handleAddUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/api/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        if (response.ok) {
            document.getElementById('addUserModal').style.display = 'none';
            loadUsers();
            showNotification('User added successfully', 'success');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showNotification('Error adding user', 'error');
    }
}

async function handleAddBook(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/api/admin/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        if (response.ok) {
            document.getElementById('addBookModal').style.display = 'none';
            loadBooks();
            showNotification('Book added successfully', 'success');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        showNotification('Error adding book', 'error');
    }
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

// Function to handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all session data
        sessionStorage.clear();
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Function to update username (call this when your page loads)
function updateAdminInfo() {
    const userData = checkUserSession();
    if (userData) {
        // Update username display
        document.getElementById('adminUsername').textContent = userData.name;
        // Update role display
        document.querySelector('.admin-role').textContent = userData.role;
    }
}

// Session management functions
function checkUserSession() {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        // No user session found, redirect to login
        window.location.href = 'login.html';
        return false;
    }
    return JSON.parse(userData);
}

// Add protection to admin routes
function protectAdminRoute() {
    const userData = checkUserSession();
    if (userData && userData.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'login.html';
    }
}

// In your login handling code
const adminInfo = {
    username: 'adminUsername',
    role: 'Administrator'
};
localStorage.setItem('adminInfo', JSON.stringify(adminInfo)); 