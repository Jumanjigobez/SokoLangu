<?php 

    include "config.php"; // Database connection

    $identifier = $_POST['username']; // Accepts either username or email
    $psk = $_POST['password'];

    if (!empty($identifier) && !empty($psk)) {
        $user_id = "";
        $role = "";

        // Check if the identifier is an email or username
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            $query = $conn->prepare("SELECT userID, Role FROM users_table WHERE Email = ?");
        } else {
            $query = $conn->prepare("SELECT userID, Role FROM users_table WHERE Username = ?");
        }
        
        $query->bind_param("s", $identifier);
        $query->execute();

        $result = $query->get_result();
        $row = $result->fetch_assoc();

        if (!empty($row)) {
            $user_id = $row['userID'];
            $role = $row['Role'];
        } else {
            echo "Unknown User!";
            exit();
        }

        // Fetch user details
        $query = $conn->prepare("SELECT * FROM users_table WHERE userID = ?");
        $query->bind_param("s", $user_id);
        $query->execute();

        $result = $query->get_result();
        $num = mysqli_num_rows($result);

        if ($num == 1) {
            $row = $result->fetch_assoc();
            if (password_verify($psk, $row['Password'])) {
                $status = "online";

                // Update user status to "online"
                $updateQuery = $conn->prepare("UPDATE users_table SET Status = ? WHERE userID = ?");
                $updateQuery->bind_param("ss", $status, $user_id);
                $updateQuery->execute();

                $responseArray = array();
                if ($updateQuery) {
                    $responseItem = array(

                       "user_id" => $user_id,
                        "username" => $row['Username'],
                        "role" => $role,
                        "status" => $status,
                        "region" => $row['Region']
                    );

                    $responseArray[] = $responseItem;

                    // Send JSON response
                    header('Content-Type: application/json');
                    echo json_encode($responseArray);
                } else {
                    echo "Error updating status, please try again!";
                }
            } else {
                echo "Invalid Password!";
            }
        } else {
            echo "Unknown User!";
        }
    } else {
        echo "All fields are required!";
    }

   
?>
