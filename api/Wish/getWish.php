<?php 

include "../config.php";

$user_id = mysqli_real_escape_string($conn, $_GET['user_id']); // Consumer's UserID

// Prepare the select statement
$query = $conn->prepare("SELECT w.WishID, p.ProductID, p.Name, p.Image, p.Price, p.Category, w.Date 
                         FROM wishlist_table w 
                         JOIN products_table p 
                         ON w.ProductID = p.ProductID 
                         WHERE w.UserID = ?");
$query->bind_param("s", $user_id);

if ($query->execute()) {
    $result = $query->get_result();
    $wishlistData = array();

    while ($row = $result->fetch_assoc()) {
        $wishlistData[] = array(
            "Id" => $row['WishID'],
            "ProductId" => $row['ProductID'],
            "Name" => $row['Name'],
            "Img" => $row['Image'],
            "Price" => $row['Price'],
            "Category" => $row['Category'],
            "WishDate" => $row['Date']
        );
    }

    // Convert the data to JSON and send it as the response
    header('Content-Type: application/json');
    echo json_encode($wishlistData);
} else {
    echo "Database error. Please try again.";
}

?>
