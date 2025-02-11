<?php 

include "config.php";

$user_id = mysqli_real_escape_string($conn, $_GET['user_id']); // Consumer's UserID

$product_name = mysqli_real_escape_string($conn, $_POST['ProductName']);
$quantity = mysqli_real_escape_string($conn, $_POST['Quantity']);
$total_price = mysqli_real_escape_string($conn, $_POST['TotalPrice']);
$order_status = mysqli_real_escape_string($conn, $_POST['OrderStatus']);
$order_date = mysqli_real_escape_string($conn, $_POST['OrderDate']);

// Function to generate a unique OrderID
function generateOrderID() {
    return "order_" . bin2hex(random_bytes(4)); // Generates a random order ID
}

// First, get the consumer's Username using their UserID
$userQuery = $conn->prepare("SELECT Username FROM users_table WHERE UserID = ?");
$userQuery->bind_param("s", $user_id);
$userQuery->execute();
$userResult = $userQuery->get_result();

if ($userResult->num_rows > 0) {
    $userRow = $userResult->fetch_assoc();
    $username = $userRow['Username'];

    // Generate a new OrderID
    $order_id = generateOrderID();

    // Insert order into the database
    $query = $conn->prepare("INSERT INTO orders_table (OrderID, UserID, Username, ProductName, Quantity, TotalPrice, OrderStatus, OrderDate) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $query->bind_param("ssssssss", $order_id, $user_id, $username, $product_name, $quantity, $total_price, $order_status, $order_date);
    
    if ($query->execute()) {
        echo 1; // Success
    } else {
        echo "Database error. Please try again.";
    }
} else {
    echo "User not found!";
}

?>
