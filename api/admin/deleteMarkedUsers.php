<?php 

include "../config.php";

$IdsArray = $_GET['checkedIds'];

if (!empty($IdsArray)) {
    // Fetch image paths before deleting
    $placeholders = implode(',', array_fill(0, count($IdsArray), '?'));
    $query = $conn->prepare("SELECT Photo FROM users_table WHERE UserID IN ($placeholders)");

    $types = str_repeat('s', count($IdsArray)); 
    $query->bind_param($types, ...$IdsArray);
    $query->execute();
    $result = $query->get_result();

    $imagePaths = [];
    while ($row = $result->fetch_assoc()) {
        if (!empty($row['Photo'])) {
            $imagePaths[] = '../photos/profiles/' . $row['Photo']; // Update path if needed
        }
    }

    // Prepare the delete query
    $query = $conn->prepare("DELETE FROM users_table WHERE UserID IN ($placeholders)");
    $query->bind_param($types, ...$IdsArray);

    if ($query->execute()) {
        // Remove images from folder
        foreach ($imagePaths as $imgPath) {
            if (file_exists($imgPath)) {
                unlink($imgPath);
            }
        }
        echo 1;
    } else {
        echo 0;
    }
} else {
    echo "No users selected for deletion.";
}

?>
