<?php 

include "../config.php";

$term = $_POST['search_term'];


// Prepare search query
$query = $conn->prepare("
    SELECT * FROM products_table 
    WHERE (
        ProductID LIKE ? OR
        Name LIKE ? OR
        Description LIKE ? OR
        Category LIKE ? OR
        Price LIKE ? OR
        UploadDate LIKE ?
    )
    ORDER BY UploadDate DESC
");

// Bind search term with wildcards
$searchTerm = "%{$term}%";
$query->bind_param("ssssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
$query->execute();

$result = $query->get_result();
$productsData = array();

// Fetch and structure response data
while ($row = $result->fetch_assoc()) {
    $description = str_replace("\\'", "'", $row['Description']);
    $productsData[] = array(
       'Id' => $row['ProductID'],
        'Img' => $row['Image'], // Image URL stored in DB
        'Name' => $row['Name'],
        'Description' => $description,
        'Price' => $row['Price'],
        'Category' => $row['Category'],
        'UploadDate' => $row['UploadDate']
    );
}

// Convert the data to JSON and send it as the response
header('Content-Type: application/json');
echo json_encode($productsData);

?>
