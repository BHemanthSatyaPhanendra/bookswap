<?php
$servername = "localhost";  // Change if your database is hosted elsewhere
$username = "root";         // Your database username
$password = "";  your_database           // Your database password (leave blank if none)
$database = ""; // Change this to your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
