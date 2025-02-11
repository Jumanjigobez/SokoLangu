<?php 

include "../config.php";



$query = $conn->prepare("SELECT * FROM products_table");
$query->execute();

$result = $query->get_result();

$productData = array();

while ($row = $result->fetch_assoc()) {
    $description = str_replace("\\'", "'", $row['Description']);
    $productItem = array(
        'Id' => $row['ProductID'],
        'Img' => $row['Image'], // Image URL stored in DB
        'Name' => $row['Name'],
        'Description' => $description,
        'Price' => $row['Price'],
        'Category' => $row['Category'],
        'UploadDate' => $row['UploadDate']
    );
    $productData[] = $productItem;
}

// Convert the data to JSON and send it as the response
header('Content-Type: application/json');
echo json_encode($productData);

?>
