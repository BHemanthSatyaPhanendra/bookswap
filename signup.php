<?php
// signup.php

// Database connection
$host = 'localhost';
$dbname = 'bookswap_db';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Get form data
$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$username = $_POST['username'];
$email = $_POST['email'];
$dob = $_POST['dob'];
$gender = $_POST['gender'];
$role = $_POST['role'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hash the password

// Insert user into the database
try {
    $stmt = $conn->prepare("INSERT INTO Users (firstname, lastname, username, email, dob, gender, role, password) 
                            VALUES (:firstname, :lastname, :username, :email, :dob, :gender, :role, :password)");
    $stmt->bindParam(':firstname', $firstname);
    $stmt->bindParam(':lastname', $lastname);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':dob', $dob);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':role', $role);
    $stmt->bindParam(':password', $password);

    $stmt->execute();

    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Signup successful!',
        'redirect' => 'login.html' // Redirect to login page
    ]);
} catch (PDOException $e) {
    // Error response
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>