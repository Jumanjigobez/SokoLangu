<?php 

include "../config.php";

$product_id = mysqli_real_escape_string($conn, $_POST['ProductId']); // Product ID
$quantity = mysqli_real_escape_string($conn, $_POST['Quantity']);
$total_price = mysqli_real_escape_string($conn, $_POST['TotalPrice']);

$user_id = mysqli_real_escape_string($conn, $_GET['user_id']); // Consumer's UserID

// Function to generate a unique OrderID
function generateOrderID() {
    return "order_" . bin2hex(random_bytes(4)); // Generates a random order ID
}

// Generate a new OrderID
$order_id = generateOrderID();
$order_status = "Pending"; 
// Insert order into the database
$query = $conn->prepare("INSERT INTO orders_table (OrderID, UserID, ProductID, Quantity, TotalPrice, OrderStatus, OrderDate) 
                         VALUES (?, ?, ?, ?, ?, ?, NOW())");

$query->bind_param("ssssss", $order_id, $user_id, $product_id, $quantity, $total_price, $order_status);

if ($query->execute()) {
    echo 1; // Success
} else {
    echo "Database error. Please try again.";
}

?>
