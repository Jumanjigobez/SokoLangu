<?php 
include "../config.php";

$username = mysqli_real_escape_string($conn, $_POST['username']);
$email = mysqli_real_escape_string($conn, $_POST['email']);
$password = mysqli_real_escape_string($conn, $_POST['password']);
$first_name = mysqli_real_escape_string($conn, $_POST['first_name']);
$last_name = mysqli_real_escape_string($conn, $_POST['last_name']);
$phone_no = mysqli_real_escape_string($conn, $_POST['phone_no']);
$region = mysqli_real_escape_string($conn, $_POST['region']);
$role = mysqli_real_escape_string($conn, $_POST['role']); 
$terms_check = mysqli_real_escape_string($conn, $_POST['terms_check']);

// Photo upload handling
$photo = $_FILES['photo'];
$newImageName = "";
$uploaded_image = false;

function generateUserID() {
    $randomPart = generateRandomString(8);
    return "user_" . $randomPart;
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

if (!empty($username) && !empty($email) && !empty($password) && !empty($first_name) && !empty($last_name) && !empty($phone_no) && !empty($region) && $terms_check) {
    // Check if username or email already exists
    $query = $conn->prepare("SELECT * FROM `users_table` WHERE username = ? OR email = ?");
    $query->bind_param("ss", $username, $email);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        echo "Username/Email Exists";
    } else {
        // Image validation
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
                echo "Image size too large! Should be less than 5MB.";
                exit;
            } else {
                // Rename image with a unique name to prevent duplicates
                $newImageName = time() . "_" . preg_replace('/\s+/', '_', $username) . "." . $imageExtension;
                $uploadDir = "../photos/profiles/"; // Folder where user profile photos will be stored
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
            $user_id = generateUserID();
            date_default_timezone_set('Africa/Nairobi');
            $joined_date = date('Y-m-d H:i:s');
            $terms_check = "Agreed";
            $password = password_hash($password, PASSWORD_DEFAULT); // Hash password for security

            // Insert user into the database
            $query = $conn->prepare("INSERT INTO `users_table` (UserID, Username, FirstName, LastName, PhoneNo, Email, Region, Role, Password, JoinedDate, TermsAgreed, Photo) 
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $query->bind_param("ssssssssssss", $user_id, $username, $first_name, $last_name, $phone_no, $email, $region, $role, $password, $joined_date, $terms_check, $newImageName);
            $query->execute();

            if ($query) {
                echo 1; // Success response
            } else {
                echo "Error, Please Try Again!";
            }
        }
    }
} else {
    echo "All fields Required!";
}

?>
