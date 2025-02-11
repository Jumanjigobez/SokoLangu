<?php 

include "../config.php";

$term = $_GET['search_term'];
$user_id = $_GET['user_id'];

// Get the region of the user (consumer)
$userQuery = $conn->prepare("SELECT Region FROM users_table WHERE UserID = ?");
$userQuery->bind_param("s", $user_id);
$userQuery->execute();
$userResult = $userQuery->get_result();
$userRow = $userResult->fetch_assoc();
$userRegion = $userRow['Region'];

// Prepare search query
$query = $conn->prepare("
    SELECT p.ProductID, p.Image, p.Name, p.Description, p.Price, p.Category, p.UploadDate, u.Region
    FROM products_table p 
    JOIN users_table u 
    ON p.UserID = u.UserID 
    WHERE u.Region = ? AND (p.Name LIKE ? OR p.Description LIKE ?)
    ORDER BY p.UploadDate DESC
    LIMIT 32
");

// Bind search term with wildcards and the user region
$searchTerm = "%{$term}%";
$query->bind_param("sss", $userRegion, $searchTerm, $searchTerm);
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
        'UploadDate' => $row['UploadDate'],
        'Region' => $row['Region'],
       
    );
}

// Convert the data to JSON and send it as the response
header('Content-Type: application/json');
echo json_encode($productsData);

?>
