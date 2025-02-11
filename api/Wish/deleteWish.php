<?php 

include "../config.php";

$wish_id = mysqli_real_escape_string($conn, $_GET['id']); // Consumer's UserID

// Prepare the delete statement
$query = $conn->prepare("DELETE FROM wishlist_table WHERE WishID = ?");
$query->bind_param("s", $wish_id);

if ($query->execute()) {
    echo 1; // Success
} else {
    echo "Database error. Please try again.";
}


?>
