<?php 

include "config.php";

$product_id = mysqli_real_escape_string($conn, $_POST['ProductId']); // Product ID
$user_id = mysqli_real_escape_string($conn, $_GET['user_id']); // Consumer's UserID

// Function to generate a unique WishID
function generateWishID() {
    return "wish_" . bin2hex(random_bytes(4)); // Generates a random wish ID
}

// Check if the product is already in the user's wishlist
$checkQuery = $conn->prepare("SELECT * FROM wishlist_table WHERE UserID = ? AND ProductID = ?");
$checkQuery->bind_param("ss", $user_id, $product_id);
$checkQuery->execute();
$checkQueryResult = $checkQuery->get_result();

if ($checkQueryResult->num_rows == 0) {
    // Generate a new WishID
    $wish_id = generateWishID();

    // Insert wish into the database
    $insertQuery = $conn->prepare("INSERT INTO wishlist_table (WishID, UserID, ProductID, Date) 
                                   VALUES (?, ?, ?, NOW())");
    $insertQuery->bind_param("sss", $wish_id, $user_id, $product_id);

    if ($insertQuery->execute()) {
        echo 1; // Success
    } else {
        echo "Database error. Please try again.";
    }
} else {
    echo "Product is already in the wishlist."; // Product already in wishlist
}

?>
