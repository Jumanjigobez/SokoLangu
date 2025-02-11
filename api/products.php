<?php 

include 'config.php';

$product_name = mysqli_real_escape_string($conn, $_POST['Name']);
$product_description = mysqli_real_escape_string($conn, $_POST['Description']);
$product_price = mysqli_real_escape_string($conn, $_POST['Price']);
$product_category = mysqli_real_escape_string($conn, $_POST['Category']);
$product_date = mysqli_real_escape_string($conn, $_POST['Date']);
$user_id = mysqli_real_escape_string($conn, $_GET['user_id']);

$product_img = $_FILES['Img'];
$newImageName = "";
$uploaded_image = false;

function generateProductID() {
    $randomPart = generateRandomString(8);
    return "product_" . $randomPart;
}

function generateRandomString($length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charLength - 1)];
    }
    return $randomString;
}

if (!empty($product_name) && !empty($product_description) && !empty($product_price) && !empty($product_category) && !empty($product_date) && !empty($product_img)) {
    
    // Image Validation
    if (isset($_FILES['Img']) && $_FILES['Img']['error'] === 0) {
        $img = $_FILES['Img'];
    
        $filename = $img["name"];
        $filesize = $img["size"];
        $tmpName = $img["tmp_name"];
    
        // Allowed image types
        $validExtensions = ['jpg', 'jpeg', 'png'];
        $imageExtension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    
        if (!in_array($imageExtension, $validExtensions)) {
            echo "Invalid image format! Allowed formats: jpg, jpeg, png.";
            exit;
        } else if ($filesize > 5048576) { // 5MB limit
            echo "Image size too large! Should be less than 5MB.";
            exit;
        } else {
            // Rename image with a unique name and timestamps to prevent duplicates
            $newImageName = time() . "_" . preg_replace('/\s+/', '_', $product_name) . "." . $imageExtension;
            $uploadDir = "photos/products/"; //Folder where products will be stored
            $imagePath = $uploadDir . $newImageName;
    
            if (move_uploaded_file($tmpName, $imagePath)) {
                $uploaded_image = true;
            } else {
                echo "Failed to upload the image.";
                exit;
            }
        }
    }

    if ($uploaded_image) {

        $product_id = generateProductID();

        // Insert product into the database
        $query = $conn->prepare("INSERT INTO products_table (ProductID, UserID,Image,Name,Description,Price,Category,UploadDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("ssssssss", $product_id,$user_id,$newImageName,$product_name, $product_description, $product_price, $product_category, $product_date);
        $query->execute();

        if ($query) {
            echo 1; // Success response for toast notifications
        } else {
            echo "Database error. Please try again.";
        }
    }

} else {
    echo "All fields are required!";
}

?>
