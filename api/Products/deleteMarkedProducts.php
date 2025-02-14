<?php 

include "../config.php";

$IdsArray = $_GET['checkedIds'];

if (!empty($IdsArray)) {
    // Fetch image paths before deleting
    $placeholders = implode(',', array_fill(0, count($IdsArray), '?'));
    $query = $conn->prepare("SELECT Image FROM products_table WHERE ProductID IN ($placeholders)");

    $types = str_repeat('s', count($IdsArray)); 
    $query->bind_param($types, ...$IdsArray);
    $query->execute();
    $result = $query->get_result();

    $imagePaths = [];
    while ($row = $result->fetch_assoc()) {
        if (!empty($row['Image'])) {
            $imagePaths[] = '../photos/products/' . $row['Image']; // Update path if needed
        }
    }

    // Prepare the delete query
    $query = $conn->prepare("DELETE FROM products_table WHERE ProductID IN ($placeholders)");
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
    echo "No products selected for deletion.";
}

?>
