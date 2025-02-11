<?php 

include "../config.php";

$farmer_id = $_GET['user_id']; // Farmer's UserID

// Step 1: Get the ProductIDs that belong to this Farmer
$productQuery = $conn->prepare("SELECT ProductID FROM products_table WHERE UserID = ?");
$productQuery->bind_param("s", $farmer_id);
$productQuery->execute();
$productResult = $productQuery->get_result();

$productIDs = [];
while ($row = $productResult->fetch_assoc()) {
    $productIDs[] = $row['ProductID'];
}

// If no products found, return an empty array
if (empty($productIDs)) {
    echo json_encode([]);
    exit;
}

// Step 2: Retrieve Orders for these ProductIDs & Join with Users Table
$placeholders = implode(',', array_fill(0, count($productIDs), '?'));
$orderQuery = $conn->prepare("
    SELECT o.OrderID, o.UserID AS ConsumerID, u.Username, p.Name, o.Quantity, 
           o.TotalPrice, o.OrderStatus, o.OrderDate
    FROM orders_table o
    JOIN users_table u ON o.UserID = u.UserID
    JOIN products_table p ON o.ProductID = p.ProductID
    WHERE p.UserID = ?
");

$orderQuery->bind_param("s", $farmer_id);
$orderQuery->execute();
$orderResult = $orderQuery->get_result();

$orderData = [];

while ($row = $orderResult->fetch_assoc()) {
    $orderData[] = array(
        'id'=> $row['OrderID'],
        // 'ConsumerID'   => $row['ConsumerID'],
        'Username'=> $row['Username'], // Consumer's Username
        'ProductName'=> $row['Name'],
        'Quantity'=> $row['Quantity'],
        'TotalPrice'=> $row['TotalPrice'],
        'OrderStatus'=> $row['OrderStatus'],
        'OrderDate'=> $row['OrderDate']
    );
}

// Convert the data to JSON and send it as the response
header('Content-Type: application/json');
echo json_encode($orderData);

?>
