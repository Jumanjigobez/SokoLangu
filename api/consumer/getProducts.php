<?php 

include "../config.php";

$user_id = $_GET['user_id'];

// Step 1: Get the consumer's region
$query = $conn->prepare("SELECT Region FROM users_table WHERE UserID = ?");
$query->bind_param("s", $user_id);
$query->execute();
$result = $query->get_result();

if ($row = $result->fetch_assoc()) {
    $region = $row['Region'];

    // Step 2: Fetch products where the farmer's region matches the consumer's region and latest interms of timestamp of uploaded image
    $query = $conn->prepare("
        SELECT p.* FROM products_table p 
        JOIN users_table u ON p.UserID = u.UserID 
        WHERE u.Region = ?

        ORDER BY p.Image DESC
    ");
    $query->bind_param("s", $region);
    $query->execute();

    $result = $query->get_result();
    $productData = [];

    while ($row = $result->fetch_assoc()) {
        $description = str_replace("\\'", "'", $row['Description']); // Remove the backslashes added by mysqli_real_escape_string
        $productItem = array(
            'Id' => $row['ProductID'],
            'Img' => $row['Image'],
            'Name' => $row['Name'],
            'Description' => $description,
            'Price' => $row['Price'],
            'Category' => $row['Category'],
            'UploadDate' => $row['UploadDate'],
            'Region' => $region,
        );
        $productData[] = $productItem;
    }
    // Convert the data to JSON and send it as the response
    header('Content-Type: application/json');
    echo json_encode($productData);
} else {
    // If user ID is not found, return an empty response
    echo "Error";
}

?>
