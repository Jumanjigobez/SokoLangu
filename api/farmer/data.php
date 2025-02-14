<?php 

include "../config.php";

$user_id = $_GET["user_id"]; // UserID for the farmer

// Fetch all products for the farmer
$queryProducts = $conn->prepare("SELECT * FROM products_table WHERE UserID = ?");
$queryProducts->bind_param("s", $user_id); // "s" stands for string type (UserID is string)
$queryProducts->execute();
$resultProducts = $queryProducts->get_result();
$products = array();
while ($row = $resultProducts->fetch_assoc()) {
    $products[] = $row;
}

// Fetch all orders for the farmer's products (not the farmer's user_id, but related to the products they own)
$queryOrders = $conn->prepare("
    SELECT o.OrderID, o.UserID AS ConsumerID, u.Username, p.Name AS ProductName, 
           o.Quantity, o.TotalPrice, o.OrderStatus, o.OrderDate
    FROM orders_table o
    JOIN products_table p ON o.ProductID = p.ProductID
    JOIN users_table u ON o.UserID = u.UserID
    WHERE p.UserID = ?"); // Farmer is associated with products, and we check the ProductID
$queryOrders->bind_param("s", $user_id); // Bind farmer's UserID to fetch relevant orders for their products
$queryOrders->execute();
$resultOrders = $queryOrders->get_result();
$orders = array();
while ($row = $resultOrders->fetch_assoc()) {
    $orders[] = $row;
}

// Fetch all messages where the user_id is the receiver's UserID
$queryMessages = $conn->prepare("SELECT * FROM messages WHERE ReceiverID = ?");
$queryMessages->bind_param("s", $user_id); // "s" for string type, ReceiverID is being matched with user_id
$queryMessages->execute();
$resultMessages = $queryMessages->get_result();
$messages = array();
while ($row = $resultMessages->fetch_assoc()) {
    $messages[] = $row;
}

// Prepare response
$responseArray = array(
    "products" => $products,
    "orders" => $orders,
    "messages" => $messages
);

// Convert the data to JSON and send it as the response
header('Content-Type: application/json');
echo json_encode($responseArray);

?>
