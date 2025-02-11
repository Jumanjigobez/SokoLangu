<?php

include "../config.php";

$user_id = $_GET['user_id'];

// Get the photo path from the database before deleting the user
$query = $conn->prepare("SELECT Photo FROM users_table WHERE UserID = ?");
$query->bind_param("s", $user_id);
$query->execute();
$result = $query->get_result();
$user = $result->fetch_assoc();

if ($user) {
    // Get the photo path
    $photo_path = !empty($user['Photo']) ? '../photos/profiles/' . $user['Photo'] : '';

    // Delete the user account
    $delete_query = $conn->prepare("DELETE FROM users_table WHERE UserID = ?");
    $delete_query->bind_param("s", $user_id);

    if ($delete_query->execute()) {
        // If the user account is deleted, check if the photo exists and delete it
        if (file_exists($photo_path)) {
            unlink($photo_path); // Delete the file from the server
        }

        echo 1; // Success
    } 
} else {
    echo 0; // User not found
}

?>
