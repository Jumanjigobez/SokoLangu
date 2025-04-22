<?php 

include "../config.php";

$user_id = $_GET['user_id'];

$query = $conn->prepare("SELECT * FROM users_table WHERE UserID = ?");
$query->bind_param("s", $user_id);
$query->execute();

$result = $query->get_result();

$accountData = [];

if ($row = $result->fetch_assoc()) {
    $accountData[] = array(
        'user_id' => $row['UserID'],
        'username' => $row['Username'],
        'firstName' => $row['FirstName'],
        'lastName' => $row['LastName'],
        'phone' => $row['PhoneNo'],
        'email' => $row['Email'],
        'region' => $row['Region'],
        'password' => $row["Password"], 
        'status' => $row["Status"], 
        'role' => $row["Role"], 
        'joined' => $row["JoinedDate"], 
        'terms_agreed' => $row['TermsAgreed'],
        'photo' => $row['Photo'] // Profile image path
       
       
       
    );

    // Convert the data to JSON and send it as the response
    header('Content-Type: application/json');
    echo json_encode($accountData);
} else {
    echo 'User not found';
}

?>
