<?php 

include "../config.php";

$order_id = mysqli_real_escape_string($conn, $_POST['OrderId']);

$quantity = mysqli_real_escape_string($conn, $_POST['Quantity']);
$total_price = mysqli_real_escape_string($conn, $_POST['TotalPrice']);
$order_status = mysqli_real_escape_string($conn, $_POST['OrderStatus']);


// Update query
$query = $conn->prepare("UPDATE orders_table SET Quantity = ?, TotalPrice = ?, OrderStatus = ? WHERE OrderID = ?");
$query->bind_param("ssss", $quantity, $total_price, $order_status, $order_id);

if ($query->execute()) {
    echo 1; // Success response
} else {
    echo 0; // Failure response
}

?>
