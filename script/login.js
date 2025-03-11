document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        // Create FormData object
        const formData = new FormData(this);
        
        // Send POST request to login.php
        const response = await fetch('login.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect based on user role
            if (data.user.role === 'admin') {
                window.location.replace('admin.html');
            } 
            else {
                window.location.replace('user.html');
            }
        } else {
            // Show error message
            showError(data.message || 'Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred during login');
    }
});

function showError(message) {
    // Remove existing error message if any
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const button = document.querySelector('button[type="submit"]');
    button.parentNode.insertBefore(errorDiv, button.nextSibling);
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Make API call to your backend
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store user data in sessionStorage
            sessionStorage.setItem('userData', JSON.stringify({
                name: data.user.name,
                role: data.user.role,
                email: data.user.email
            }));
            // Store auth token if you're using one
            sessionStorage.setItem('authToken', data.token);
            
            // Redirect to admin panel
            window.location.href = 'admin.html';
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    });
}