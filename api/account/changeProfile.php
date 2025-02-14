<?php 

include '../config.php';


$user_id = mysqli_real_escape_string($conn, $_GET['user_id']);

$photo = $_FILES['photo'];
$newImageName = "";
$uploaded_image = false;


if (!empty($photo)) {
    
    // Image Validation
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
        $img = $_FILES['photo'];
    
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
            echo "Photo size too large! Should be less than 5MB.";
            exit;
        } else {
            // Rename image with a unique user_id and timestamps to prevent duplicates
            $newImageName = time() . "_" . preg_replace('/\s+/', '_', $user_id) . "." . $imageExtension;
            $uploadDir = "../photos/profiles/"; //Folder where profile will be stored
            $imagePath = $uploadDir . $newImageName;
    
            if (move_uploaded_file($tmpName, $imagePath)) {
                $uploaded_image = true;
            } else {
                echo "Failed to upload the photo.";
                exit;
            }
        }
    }

    if ($uploaded_image) {

      
        $query = $conn->prepare("UPDATE users_table SET Photo = ? WHERE UserID = ?");
        $query->bind_param("ss", $newImageName, $user_id);
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
