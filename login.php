<?php
session_start();

// Database connection
$host = 'localhost';
$dbname = 'bookswap_db';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

// Get form data
$username = $_POST['username'];
$password = $_POST['password'];

try {
    // Check if input is email or username
    $stmt = $conn->prepare("SELECT * FROM Users WHERE username = :input OR email = :input");
    $stmt->bindParam(':input', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Create session using user_id instead of id
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        // Remove password from user data before sending to client
        unset($user['password']);

        // Success response
        echo json_encode([
            'success' => true,
            'user' => $user,
            'message' => 'Login successful!'
        ]);
    } else {
        // Error response
        echo json_encode([
            'success' => false,
            'message' => 'Invalid username or password'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>