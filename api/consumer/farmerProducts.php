<?php 

include "../config.php";

$product_id = $_GET['product_id'];

// Fetch the farmer's userID using the product_id
$userQuery = "SELECT p.UserID 
              FROM products_table p 
              WHERE p.ProductID = '$product_id'";

$userResult = $conn->query($userQuery);
$farmers_user_id = null;

if ($userResult->num_rows > 0) {
    $userRow = $userResult->fetch_assoc();
    $farmers_user_id = $userRow['UserID'];
}

// Fetch products data for the farmer
$productQuery = "SELECT p.ProductID, p.Image, p.Name, p.Price, p.Category

                 FROM products_table p 
                 JOIN users_table u 
                 ON p.UserID = u.UserID 
                 WHERE p.UserID = '$farmers_user_id' AND u.Role = 'farmer'";

$result = $conn->query($productQuery);

$productData = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $productItem = array(
            'Id' => $row['ProductID'],
            'Img' => $row['Image'],
            'Name' => $row['Name'],
         
            'Price' => $row['Price'],
            'Category' => $row['Category'],
         
          
        );
        $productData[] = $productItem;
    }
}

// Convert the data to JSON and send it as the response
header('Content-Type: application/json');
echo json_encode($productData);

?>
