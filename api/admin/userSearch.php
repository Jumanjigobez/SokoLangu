<?php 

include "../config.php";

$search_term = mysqli_real_escape_string($conn, $_POST['search_term']);

if (!empty($search_term)) {
    $query = $conn->prepare("
        SELECT * FROM users_table 
        WHERE username LIKE ? 
        OR FirstName LIKE ? 
        OR LastName LIKE ? 
        OR PhoneNo LIKE ? 
        OR Email LIKE ? 
        OR Region LIKE ? 
        OR Role LIKE ? 
        OR Status LIKE ? 
        OR JoinedDate LIKE ? 
        OR TermsAgreed LIKE ?

        ORDER BY JoinedDate DESC
    ");

    $like_term = '%' . $search_term . '%';
    $query->bind_param("ssssssssss", $like_term, $like_term, $like_term, $like_term, $like_term, $like_term, $like_term, $like_term, $like_term, $like_term);
    $query->execute();
    $result = $query->get_result();

    $responseArray = array();
    while($row = $result->fetch_assoc()){

        $responseItem = array(
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

        $responseArray[] = $responseItem;
    }

    

    // Convert the data to JSON and send it as the response
    header('Content-Type: application/json');
    echo json_encode($responseArray);
} else {
    echo "Error";
}

?>
