<?php 

    include "../config.php";

    $query = $conn->prepare("SELECT * FROM users_table ORDER BY JoinedDate DESC");
    
    if($query->execute()){
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
        
    }else{
        echo 'Somethings Wrong, Please Reload!';
    }


?>