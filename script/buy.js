document.addEventListener("DOMContentLoaded", function () {
    const filterSidebar = document.getElementById("filterSidebar");
    const filterBtn = document.getElementById("filterBtn");
    const closeFilter = document.querySelector(".close-filter");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartBtn = document.getElementById("cartBtn");
    const closeCart = document.querySelector(".close-cart");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const proceedToBuy = document.getElementById("proceedToBuy");
    const paymentPopup = document.getElementById("paymentPopup");
    const closePopup = document.querySelector(".close-popup");
    const confirmPayment = document.getElementById("confirmPayment");
    const upiInput = document.getElementById("upiID");

    let cart = [];

    // Toggle Cart Sidebar
    cartBtn.addEventListener("click", () => {
        cartSidebar.classList.toggle("open");
        renderCartItems();
    });

    closeCart.addEventListener("click", () => {
        cartSidebar.classList.remove("open");
    });

    // Add to Cart Function
    function addToCart(id, title, price) {
        cart.push({ id, title, price });
        renderCartItems();
    }

    // Function to render cart items
    function renderCartItems() {
        cartItems.innerHTML = ""; // Clear existing items

        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <p>${item.title} - ₹${item.price}</p>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeCartItem);
        });

        updateCartTotal();
        cartCount.innerText = cart.length;
    }

    // Function to remove an item from the cart
    function removeCartItem(event) {
        const index = event.target.getAttribute('data-index');
        cart.splice(index, 1); // Remove item from cart array
        renderCartItems(); // Re-render cart items
    }

    // Function to update cart total
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.innerText = total;
    }

    // Proceed to Buy
    proceedToBuy.addEventListener("click", () => {
        paymentPopup.style.display = "block";
    });

    // Close Payment Popup
    closePopup.addEventListener("click", () => {
        paymentPopup.style.display = "none";
    });

    // Show UPI Input if Selected
    document.querySelectorAll("input[name='payment']").forEach(radio => {
        radio.addEventListener("change", function () {
            upiInput.style.display = this.value === "upi" ? "block" : "none";
        });
    });

    // Confirm Payment
    confirmPayment.addEventListener("click", () => {
        alert("Payment Successful!");
        paymentPopup.style.display = "none";
        cart = [];
        renderCartItems();
    });

    // Expose Add to Cart Function
    window.addToCart = addToCart;

    // Show/Hide Filter Sidebar
    filterBtn.addEventListener("click", () => {
        filterSidebar.classList.toggle("open");
    });

    closeFilter.addEventListener("click", () => {
        filterSidebar.classList.remove("open");
    });

    // Fetch and Display Books
    fetch("fetch_books.php")
        .then(response => response.json())
        .then(data => {
            displayBooks(data);
        })
        .catch(error => console.log("Error fetching books:", error));
});

// Function to Display Books
function displayBooks(books) {
    const bookContainer = document.getElementById("bookContainer");
    bookContainer.innerHTML = "";

    books.forEach(book => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Condition:</strong> ${book.condition}</p>
            <p><strong>Price:</strong> ₹${book.price}</p>
            <p><strong>Description:</strong>${book.description}</p>
            <button class="add-to-cart" onclick="addToCart(${book.id}, '${book.title}', ${book.price})">Add to Cart</button>
            <button class="buy-now" onclick="buyNow(${book.id})">Buy Now</button>
        `;
        bookContainer.appendChild(bookCard);
    });
}

// Function to handle Buy Now
function buyNow(id) {
    // Trigger the proceed to buy actions
    paymentPopup.style.display = "block";
}

// Function to Apply Filters
function applyFilters() {
    const condition = document.getElementById("conditionFilter").value;
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;
    const category = document.getElementById("categoryFilter").value;

    fetch("fetch_books.php")
        .then(response => response.json())
        .then(data => {
            let filteredBooks = data.filter(book => {
                return (
                    (condition === "all" || book.condition_status === condition) &&
                    (category === "all" || book.category === category) &&
                    (book.price >= minPrice && book.price <= maxPrice)
                );
            });

            displayBooks(filteredBooks);
            document.getElementById("filterSidebar").classList.remove("open");
        })
        .catch(error => console.log("Error filtering books:", error));
}

// Function to Search Books
function searchBooks() {
    let searchQuery = document.getElementById("searchBox").value.toLowerCase();

    fetch("fetch_books.php")
        .then(response => response.json())
        .then(data => {
            let searchedBooks = data.filter(book =>
                book.title.toLowerCase().includes(searchQuery) ||
                book.author.toLowerCase().includes(searchQuery)
            );

            displayBooks(searchedBooks);
        })
        .catch(error => console.log("Error searching books:", error));
}


