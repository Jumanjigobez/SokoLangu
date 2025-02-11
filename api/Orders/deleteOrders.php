<?php 

include "../config.php";

$id = $_GET['id']; // OrderID to delete

// Delete order from database
$query = $conn->prepare("DELETE FROM orders_table WHERE OrderID = ?");
$query->bind_param("s", $id);

if ($query->execute()) {
    echo 1; // Success response
} else {
    echo 0; // Failure response
}

?>
