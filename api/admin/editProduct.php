<?php 

include "../config.php";

$product_name = mysqli_real_escape_string($conn, $_POST['Name']);
$product_description = mysqli_real_escape_string($conn, $_POST['Description']);
$product_price = mysqli_real_escape_string($conn, $_POST['Price']);
$product_category = mysqli_real_escape_string($conn, $_POST['Category']);
$product_date = mysqli_real_escape_string($conn, $_POST['Date']);

$product_id = mysqli_real_escape_string($conn, $_POST['product_id']);

$uploaded_image = false;
$newImageName = "";

// Check if an image is uploaded
if (isset($_FILES['img']) && $_FILES['img']['error'] !== 4) {
    $imgFile = $_FILES['img'];
    $filename = $_FILES["img"]["name"];
    $filesize = $_FILES["img"]["size"];
    $tmpName = $_FILES["img"]["tmp_name"];

    $validExtensions = ['jpg', 'jpeg', 'png'];
    $imageExtension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    if (!in_array($imageExtension, $validExtensions)) {
        echo "Invalid Image Extension. Choose jpg, jpeg, or png.";
        exit;
    } elseif ($filesize > 5048576) { // 5MB limit
        echo "Image size is too large! Must be less than 5MB.";
        exit;
    } else {
        $newImageName = time() . "_" . preg_replace('/\s+/', '_', $product_name) . "." . $imageExtension;
        $uploadDir = "../photos/products/";
        $imagePath = $uploadDir . $newImageName;

        if (move_uploaded_file($tmpName, $imagePath)) {
            $uploaded_image = true;
        } else {
            echo "Failed to upload the image.";
            exit;
        }
    }
}

// Update query
if ($uploaded_image) {
    // Update all fields including image
    $query = $conn->prepare("UPDATE products_table SET Name = ?, Description = ?, Price = ?, Category = ?, Image = ? WHERE ProductID = ?");
    $query->bind_param("ssssss", $product_name, $product_description, $product_price, $product_category, $newImageName, $product_id);
} else {
    // Update fields except image
    $query = $conn->prepare("UPDATE products_table SET Name = ?, Description = ?, Price = ?, Category = ? WHERE ProductID = ?");
    $query->bind_param("sssss", $product_name, $product_description, $product_price, $product_category, $product_id);
}

$query->execute();

if ($query) {
    echo 1; // Success response
} else {
    echo 0; // Failure response
}

?>
