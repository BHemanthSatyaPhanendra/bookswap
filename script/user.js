// Function to toggle the mobile menu
function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Function to handle logout
function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('isSeller');
    window.location.href = 'login.html';
}

// Fetch books from database and display them
function fetchBooks() {
    fetch('get_books.php')
        .then(response => response.json())
        .then(data => {
            displayBooks(data, 'saleBooks', 'sell');
            displayBooks(data, 'exchangeBooks', 'exchange');
            displayBooks(data, 'donationBooks', 'donation');
        })
        .catch(error => console.error('Error fetching books:', error));
}

// Function to display books dynamically
function displayBooks(books, containerId, category) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    const filteredBooks = books.filter(book => book.category === category);
    if (filteredBooks.length === 0) {
        container.innerHTML = '<p class="no-books">No books available.</p>';
        return;
    }

    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        bookCard.innerHTML = `
            <img src="${book.image}" alt="${book.title}" class="book-image">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Price:</strong> $${book.price}</p>
                <button class="buy-btn">Buy Now</button>
            </div>
        `;
        container.appendChild(bookCard);
    });
}

// Ensure user is logged in and load books when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
});

window.onload = function() {
    fetch('get_username.php')
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                document.getElementById('displayUsername').textContent = data.username;
            } else {
                window.location.href = 'login.html'; // Redirect to login if not logged in
            }
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = 'login.html';
        });
};
