<?php 

include "../config.php";

$IdsArray = $_GET['checkedIds']; // Array of WishIDs to delete

if (!empty($IdsArray)) {
    // Convert the array into a comma-separated string for SQL
    $placeholders = implode(',', array_fill(0, count($IdsArray), '?'));

    // Prepare the delete query for wishlist
    $query = $conn->prepare("DELETE FROM wishlist_table WHERE WishID IN ($placeholders)");

    // Bind the WishIDs dynamically
    $types = str_repeat('s', count($IdsArray)); // Assuming WishIDs are strings
    $query->bind_param($types, ...$IdsArray);

    if ($query->execute()) {
        echo 1; // Success response
    } else {
        echo 0; // Failure response
    }
} else {
    echo "No wishes selected for deletion.";
}

?>
