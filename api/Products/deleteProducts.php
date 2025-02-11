<?php 

include "../config.php";

$id = $_GET['id'];

// Fetch image path before deleting
$query = $conn->prepare("SELECT Image FROM products_table WHERE ProductID = (?)");
$query->bind_param("s", $id);
$query->execute();
$result = $query->get_result();
$row = $result->fetch_assoc();

$imagePath = !empty($row['Image']) ? '../photos/products/' . $row['Image'] : '';

// Delete product from database
$query = $conn->prepare("DELETE FROM products_table WHERE ProductID = (?)");
$query->bind_param("s", $id);


if ($query->execute()) {
    // Remove image from folder if it exists
    if (!empty($imagePath) && file_exists($imagePath)) {
        unlink($imagePath);
    }
    echo 1;
} else {
    echo 0;
}

?>
