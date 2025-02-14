<?php 

include "../config.php";

$product_id = $_GET['product_id'];

// Fetch product data
$productQuery = "SELECT p.ProductID, p.Image, p.Name, p.Description, p.Price, p.Category, p.UploadDate, u.Region, u.Photo, u.FirstName, u.LastName, u.PhoneNo 
                 FROM products_table p 
                 JOIN users_table u 
                 ON p.UserID = u.UserID 
                 WHERE p.ProductID = '$product_id' AND u.Role = 'farmer'
                 LIMIT 24
                 ";

$result = $conn->query($productQuery);

$productData = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $description = str_replace("\\'", "'", $row['Description']);
        $productItem = array(
            'Id' => $row['ProductID'],
            'Img' => $row['Image'],
            'Name' => $row['Name'],
            'Description' => $description,
            'Price' => $row['Price'],
            'Category' => $row['Category'],
            'UploadDate' => $row['UploadDate'],
            'Region' => $row['Region'],
            'FarmerPhoto' => $row['Photo'],
            'FarmerFirstName' => $row['FirstName'],
            'FarmerLastName' => $row['LastName'],
            'FarmerPhone' => $row['PhoneNo']
        );
        $productData[] = $productItem;
    }
}

// Convert the data to JSON and send it as the response
header('Content-Type: application/json');
echo json_encode($productData);

?>
