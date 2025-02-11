<?php 

include "../config.php";

$id = $_GET['id']; // MsgID to delete

// Delete order from database
$query = $conn->prepare("DELETE FROM messages WHERE MsgID = ?");
$query->bind_param("s", $id);

if ($query->execute()) {
    echo 1; // Success response
} else {
    echo 0; // Failure response
}

?>
