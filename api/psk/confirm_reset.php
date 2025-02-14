<?php 

    include '../config.php';

    $psk = $_POST['psk'];
    $email = $_POST['email'];

    if(!empty($psk) && !empty($email)){
        
        $query = $conn->prepare("SELECT * FROM users_table where Email = (?)");
        $query->bind_param("s",$email);
        $query->execute();

        $result = $query->get_result();

        $num = mysqli_num_rows($result);

        if($num==0){
            echo "Unknown User!";
        }else{
            $row = $result->fetch_assoc();
            $user_id = $row['UserID'];
            $new_psk = password_hash($psk,PASSWORD_DEFAULT);

            $query = $conn->prepare("UPDATE users_table SET Password = (?) WHERE UserID = (?)");
            $query->bind_param("ss",$new_psk,$user_id);
            
            if($query->execute()){
                $query2 = $conn->prepare("DELETE FROM reset_temp WHERE email = (?)");
                $query2->bind_param("s",$email);
                
                
                if($query2->execute()){
                    echo 1;
                }
            }else{
                echo "Somethings Wrong! Please Try Again Later";
            }
        }
    }else{
        echo "Somethings Wrong! Please Try Again Later";
    }


?>