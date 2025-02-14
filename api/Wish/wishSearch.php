<?php 

include "../config.php";

$term = $_POST['search_term'];
$user_id = $_GET['user_id']; // Consumer's UserID

// Step 1: Get the ProductIDs from wishlist_table where UserID matches the consumer
$wishlistQuery = $conn->prepare("SELECT ProductID FROM wishlist_table WHERE UserID = ?");
$wishlistQuery->bind_param("s", $user_id);
$wishlistQuery->execute();
$wishlistResult = $wishlistQuery->get_result();

$productIDs = [];
while ($row = $wishlistResult->fetch_assoc()) {
    $productIDs[] = $row['ProductID'];
}

// If no products are found in the wishlist, return an empty array
if (empty($productIDs)) {
    echo json_encode([]);
    exit;
}

// Step 2: Prepare search query for products in wishlist
$placeholders = implode(',', array_fill(0, count($productIDs), '?'));
$productQuery = $conn->prepare("
    SELECT w.WishID, p.ProductID, p.Name, p.Image, p.Price, p.Category, w.Date 
    FROM wishlist_table w
    JOIN products_table p ON w.ProductID = p.ProductID
    WHERE w.UserID = ? AND p.ProductID IN ($placeholders)
    AND (
        p.Name LIKE ? OR 
        p.Category LIKE ? OR 
        p.Price LIKE ? OR 
        w.Date LIKE ?
    )
    ORDER BY w.Date DESC
");

// Bind the ProductID values and search term
$searchTerm = "%{$term}%";
$params = array_merge([$user_id], $productIDs, [$searchTerm, $searchTerm, $searchTerm, $searchTerm]);

// Dynamically bind the parameters (the correct number of "s" based on the parameters)
$productQuery->bind_param(str_repeat("s", count($params)), ...$params);
$productQuery->execute();

$productResult = $productQuery->get_result();
$productData = [];

while ($row = $productResult->fetch_assoc()) {
    $productData[] = array(
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
echo json_encode($productData);

?>
