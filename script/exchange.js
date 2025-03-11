const addBookBtn = document.getElementById('addBookBtn');
        const addBookSection = document.getElementById('addBookSection');

        addBookBtn.addEventListener('click', () => {
            addBookSection.classList.toggle('active');
            addBookBtn.textContent = addBookSection.classList.contains('active') 
                ? '- Close Form' 
                : '+ Add Book for Exchange';
        });

        // Handle Book Submission
        const exchangeBookForm = document.getElementById('exchangeBookForm');
        exchangeBookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                title: document.getElementById('bookTitle').value,
                author: document.getElementById('author').value,
                condition: document.getElementById('condition').value,
                description: document.getElementById('description').value,
                exchangePreference: document.getElementById('exchangePreference').value,
                image: await getBase64Image(document.getElementById('bookImage').files[0])
            };

            // Get existing books or initialize empty array
            const books = JSON.parse(localStorage.getItem('exchangeBooks')) || [];
            
            // Add new book
            books.push({
                ...formData,
                id: Date.now(),
                userId: getCurrentUserId(),
                dateAdded: new Date().toISOString()
            });

            // Save back to localStorage
            localStorage.setItem('exchangeBooks', JSON.stringify(books));

            // Reset form and close section
            exchangeBookForm.reset();
            addBookSection.classList.remove('active');
            addBookBtn.textContent = '+ Add Book for Exchange';

            // Refresh book display
            displayBooks();
            findMatches();
        });

        // Convert image to base64
        function getBase64Image(file) {
            return new Promise((resolve, reject) => {
                if (!file) {
                    reject('No file selected');
                    return;
                }

                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }

        // Display Books
        function displayBooks() {
            const bookContainer = document.getElementById('bookContainer');
            const books = JSON.parse(localStorage.getItem('exchangeBooks')) || [];
            const searchTerm = document.getElementById('searchBooks').value.toLowerCase();
            const conditionFilter = document.getElementById('conditionFilter').value;

            const filteredBooks = books.filter(book => {
                const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                                    book.author.toLowerCase().includes(searchTerm);
                const matchesCondition = !conditionFilter || book.condition === conditionFilter;
                return matchesSearch && matchesCondition;
            });

            bookContainer.innerHTML = filteredBooks.length ? '' : '<p>No books available for exchange</p>';

            filteredBooks.forEach(book => {
                const card = document.createElement('div');
                card.classList.add('book-card');
                card.innerHTML = `
                    <img src="${book.image}" alt="${book.title}">
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p class="author">by ${book.author}</p>
                        <p class="condition">Condition: ${book.condition}</p>
                        <p class="preference">Looking for: ${book.exchangePreference}</p>
                        <div class="book-actions">
                            <button onclick="proposeExchange(${book.id})">Propose Exchange</button>
                            <a href="reviews.html?bookId=${book.id}" class="review-link">Reviews</a>
                        </div>
                    </div>
                `;
                bookContainer.appendChild(card);
            });
        }

        // Find Potential Matches
        function findMatches() {
            const matches = document.getElementById('exchangeMatches');
            const books = JSON.parse(localStorage.getItem('exchangeBooks')) || [];
            const currentUserId = getCurrentUserId();
            const userBooks = books.filter(book => book.userId === currentUserId);
            
            if (!userBooks.length) {
                matches.innerHTML = '<p>List your books to see potential matches</p>';
                return;
            }

            const potentialMatches = [];
            userBooks.forEach(userBook => {
                books.forEach(otherBook => {
                    if (otherBook.userId !== currentUserId) {
                        // Simple matching logic - can be improved
                        if (userBook.exchangePreference.toLowerCase().includes(otherBook.title.toLowerCase()) ||
                            otherBook.exchangePreference.toLowerCase().includes(userBook.title.toLowerCase())) {
                            potentialMatches.push({
                                yourBook: userBook,
                                matchingBook: otherBook
                            });
                        }
                    }
                });
            });

            matches.innerHTML = potentialMatches.length ? 
                `<h2>Potential Exchange Matches</h2>` : 
                '<p>No matches found yet</p>';

            potentialMatches.forEach(match => {
                const matchCard = document.createElement('div');
                matchCard.classList.add('match-card');
                matchCard.innerHTML = `
                    <div class="match-books">
                        <div class="your-book">
                            <h4>Your Book</h4>
                            <p>${match.yourBook.title}</p>
                            <p>by ${match.yourBook.author}</p>
                        </div>
                        <div class="matching-book">
                            <h4>Matching Book</h4>
                            <p>${match.matchingBook.title}</p>
                            <p>by ${match.matchingBook.author}</p>
                        </div>
                    </div>
                    <button onclick="initiateExchange(${match.yourBook.id}, ${match.matchingBook.id})">
                        Initiate Exchange
                    </button>
                `;
                matches.appendChild(matchCard);
            });
        }

        // Helper Functions
        function getCurrentUserId() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return currentUser ? currentUser.id : null;
        }

        function proposeExchange(bookId) {
            if (!getCurrentUserId()) {
                alert('Please login to propose an exchange');
                return;
            }
            // Implement exchange proposal logic
        }

        function initiateExchange(yourBookId, matchingBookId) {
            if (!getCurrentUserId()) {
                alert('Please login to initiate an exchange');
                return;
            }
            // Implement exchange initiation logic
        }

        // Event Listeners
        document.getElementById('searchBooks').addEventListener('input', displayBooks);
        document.getElementById('conditionFilter').addEventListener('change', displayBooks);

        // Initialize
        displayBooks();
        findMatches();

        // Check login status
        function checkLoginStatus() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const loginBtn = document.getElementById('loginBtn');
            const userMenu = document.getElementById('userMenu');
            const username = document.getElementById('username');

            if (currentUser) {
                loginBtn.style.display = 'none';
                userMenu.style.display = 'flex';
                username.textContent = currentUser.username;
            } else {
                loginBtn.style.display = 'block';
                userMenu.style.display = 'none';
            }
        }

        function logout() {
            localStorage.removeItem('currentUser');
            window.location.reload();
        }

        // Initialize login status
        checkLoginStatus();