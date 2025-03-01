<?php 

    include "config.php";

    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $phone_no = $_POST['phone_no'];
    $region = $_POST['region'];
    $role = $_POST['role']; 
    $terms_check = $_POST['terms_check'];

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
        // Check if username exists
        $query = $conn->prepare("SELECT * FROM `users_table` WHERE Username = (?)");
        $query->bind_param("s", $username);
        $query->execute();
        $result = $query->get_result();
        if (mysqli_num_rows($result) > 0) {
            echo "Username Exists";
            exit;
        }

        // Check if email exists
        $query = $conn->prepare("SELECT * FROM `users_table` WHERE Email = (?)");
        $query->bind_param("s", $email);
        $query->execute();
        $result = $query->get_result();
        if (mysqli_num_rows($result) > 0) {
            echo "Email Exists";
            exit;
        }

        // Check if phone number exists
        $query = $conn->prepare("SELECT * FROM `users_table` WHERE PhoneNo = (?)");
        $query->bind_param("s", $phone_no);
        $query->execute();
        $result = $query->get_result();
        if (mysqli_num_rows($result) > 0) {
            echo "Phone Number Exists";
            exit;
        }

        // Insert new user if no conflicts
        $user_id = generateUserID();
        date_default_timezone_set('Africa/Nairobi');
        $joined_date = date('Y-m-d H:i:s');
        $terms_check = "Agreed";
        $password = password_hash($password, PASSWORD_DEFAULT); // Hash password for security
        $photo = "avatar.png"; // Default photo of the new user
        $query = $conn->prepare("INSERT INTO `users_table` (UserID, Username, FirstName, LastName, PhoneNo, Email, Region, Role, Password, JoinedDate, Photo, TermsAgreed) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $query->bind_param("ssssssssssss", $user_id, $username, $first_name, $last_name, $phone_no, $email, $region, $role, $password, $joined_date, $photo, $terms_check);
        $query->execute();

        if ($query) {
            echo 1; // Success response
        } else {
            echo "Error, Please Try Again!";
        }
    } else {
        echo "All fields Required!";
    }

?>
