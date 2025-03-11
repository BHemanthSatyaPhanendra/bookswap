document.getElementById("sellBookForm").addEventListener("submit", function(event) {
event.preventDefault();

// Get form data
const title = document.getElementById("title").value;
const author = document.getElementById("author").value;
const price = document.getElementById("price").value;
const condition = document.getElementById("condition").value;
const description = document.getElementById("description").value;

// Create book object
const book = {
type: "sell",
title,
author,
price,
condition,
description,
image: "default-book.jpg" // Placeholder for image
};

// Save book to localStorage
let books = JSON.parse(localStorage.getItem("books")) || [];
books.push(book);
localStorage.setItem("books", JSON.stringify(books));

alert("Your book has been listed for sale!");
window.location.href = "buy.html"; // Redirect to main page
});
