<?php
session_start(); // Start the session

// Database connection parameters
$servername = "localhost";
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "bookswap_db"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
   
    // Collect and sanitize input data
    $title = $conn->real_escape_string($_POST['title']);
    $author = $conn->real_escape_string($_POST['author']);
    $price = $conn->real_escape_string($_POST['price']);
    $condition = $conn->real_escape_string($_POST['condition']);
    $description = $conn->real_escape_string($_POST['description']);

    // Fetch username from session
    if (isset($_SESSION['username'])) {
        $name = $_SESSION['username'];
    } else {
        die("User not logged in");
    }

    // Fetch user ID based on username
    $user_query = "SELECT user_id FROM users WHERE username = '$name'";
    $user_result = $conn->query($user_query);
    if ($user_result->num_rows > 0) {
        $user_row = $user_result->fetch_assoc();
        $seller_id = $user_row['user_id'];
    } else {
        die("User not found");
    }

    // Handle file upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($_FILES["image"]["name"]);
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // Check if image file is an actual image or fake image
        $check = getimagesize($_FILES["image"]["tmp_name"]);
        if ($check !== false) {
            // Check file size (5MB max)
            if ($_FILES["image"]["size"] <= 5000000) {
                // Allow certain file formats
                if ($imageFileType == "jpg" || $imageFileType == "png" || $imageFileType == "jpeg" || $imageFileType == "gif") {
                    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                        // File is uploaded successfully
                        $image = $target_file;
                    } else {
                        echo "Sorry, there was an error uploading your file.";
                        $image = null;
                    }
                } else {
                    echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
                    $image = null;
                }
            } else {
                echo "Sorry, your file is too large.";
                $image = null;
            }
        } else {
            echo "File is not an image.";
            $image = null;
        }
    } else {
        $image = null;
    }

    // Insert data into database
    $sql = "INSERT INTO books (title, author, price, `condition`, description, image, seller_id, created_at)
            VALUES ('$title', '$author', '$price', '$condition', '$description', '$image', '$seller_id', NOW())";

    if ($conn->query($sql) === TRUE) {
        echo "New book added successfully";
        header("Location: buy.html");
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close connection
$conn->close();
?>