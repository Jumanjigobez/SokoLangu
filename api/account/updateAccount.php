<?php 

include "../config.php";

$user_id = mysqli_real_escape_string($conn, $_POST['UserId']);
$username = mysqli_real_escape_string($conn, $_POST['Username']);
$first_name = mysqli_real_escape_string($conn, $_POST['FirstName']);
$last_name = mysqli_real_escape_string($conn, $_POST['Lastname']);
$phone_no = mysqli_real_escape_string($conn, $_POST['Phone']);
$email = mysqli_real_escape_string($conn, $_POST['Email']);
$region = mysqli_real_escape_string($conn, $_POST['Region']);
$role = mysqli_real_escape_string($conn, $_POST['Role']);
$password = mysqli_real_escape_string($conn, $_POST['Psk']);
$status = mysqli_real_escape_string($conn, $_POST['Status']);
$terms_agreed = mysqli_real_escape_string($conn, $_POST['TermsAgreed']);

$uploaded_image = false;
$newImageName = "";

// Check if a new image is uploaded
if (isset($_FILES['Photo']) && $_FILES['Photo']['error'] !== 4) {
    $imgFile = $_FILES['Photo'];
    $filename = $_FILES["Photo"]["name"];
    $filesize = $_FILES["Photo"]["size"];
    $tmpName = $_FILES["Photo"]["tmp_name"];

    $validExtensions = ['jpg', 'jpeg', 'png'];
    $imageExtension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    if (!in_array($imageExtension, $validExtensions)) {
        echo "Invalid Image Extension. Choose jpg, jpeg, or png.";
        exit;
    } elseif ($filesize > 5048576) { // 5MB limit
        echo "Image size is too large! Must be less than 5MB.";
        exit;
    } else {
        $newImageName = time() . "_" . preg_replace('/\s+/', '_', $username) . "." . $imageExtension;
        $uploadDir = "../photos/profiles/";
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
    $query = $conn->prepare("UPDATE users_table SET Username = ?, FirstName = ?, LastName = ?, PhoneNo = ?, Email = ?, Region = ?, Role = ?, Password = ?, Status = ?, TermsAgreed = ?, Photo = ? WHERE UserID = ?");
    $query->bind_param("ssssssssssss", $username, $first_name, $last_name, $phone_no, $email, $region, $role, $password, $status, $terms_agreed, $newImageName, $user_id);
} else {
    // Update fields except image
    $query = $conn->prepare("UPDATE users_table SET Username = ?, FirstName = ?, LastName = ?, PhoneNo = ?, Email = ?, Region = ?, Role = ?, Password = ?, Status = ?, TermsAgreed = ? WHERE UserID = ?");
    $query->bind_param("sssssssssss", $username, $first_name, $last_name, $phone_no, $email, $region, $role, $password, $status, $terms_agreed, $user_id);
}

$query->execute();

if ($query) {
    echo 1; // Success response
} else {
    echo 0; // Failure response
}

?>
