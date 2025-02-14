<?php 

include "../config.php";

// Fetch all products
$queryProducts = $conn->prepare("SELECT * FROM products_table");
$queryProducts->execute();
$resultProducts = $queryProducts->get_result();
$responseArray = [];

while ($row = $resultProducts->fetch_assoc()) {
   
    $description = str_replace("\\'", "'", $row['Description']); // Remove the backslashes added by mysqli_real_escape_string
    $productItem = array(
        'Id' => $row['ProductID'],
        'Img' => $row['Image'],
        'Name' => $row['Name'],
        'Description' => $description,
        'Price' => $row['Price'],
        'Category' => $row['Category'],
        'UploadDate' => $row['UploadDate'],
     
    );
    
   $responseArray[] = $productItem;
}




// Convert the data to JSON and send it as the response
header('Content-Type: application/json');
echo json_encode($responseArray);

?>