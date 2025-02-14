<?php 

include "../config.php";

$IdsArray = $_GET['checkedIds']; // Array of OrderIDs to delete

if (!empty($IdsArray)) {
    // Convert the array into a comma-separated string for SQL
    $placeholders = implode(',', array_fill(0, count($IdsArray), '?'));

    // Prepare the delete query for orders
    $query = $conn->prepare("DELETE FROM orders_table WHERE OrderID IN ($placeholders)");

    // Bind the OrderIDs dynamically
    $types = str_repeat('s', count($IdsArray)); // Assuming OrderIDs are strings
    $query->bind_param($types, ...$IdsArray);

    if ($query->execute()) {
        echo 1; // Success response
    } else {
        echo 0; // Failure response
    }
} else {
    echo "No orders selected for deletion.";
}

?>
