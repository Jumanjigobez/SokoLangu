<?php 
    header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
    
    $conn = mysqli_connect("localhost", "root", "","sokolangu_db");
    
    // if($conn){
    //     $username = $_POST['username'];
    //     $psk = $_POST['password'];

    //     echo $username;

    // }else{
    //     echo "Database Error";
    // }
//     $psk = password_hash("Admin",PASSWORD_DEFAULT);

//    mysqli_query($conn, "insert into login (username, psk) values('admin','$psk')")


// ALTER TABLE `todo`  ADD `user_id` VARCHAR(150) NOT NULL  AFTER `Status`;
// ALTER TABLE `personal_timetable` ADD INDEX(`user_id`);
?>