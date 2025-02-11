<?php 

include "../config.php";

// Decode JSON input from frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo "No data received!";
    exit;
}

// Validate received data
if (!isset($data['msg'], $data['farmer_id'], $data['consumer_id'])) {
    echo "Missing required fields!";
    exit;
}

$msg = mysqli_real_escape_string($conn, $data['msg']); 
$farmer_id = mysqli_real_escape_string($conn, $data['farmer_id']); 
$consumer_id = mysqli_real_escape_string($conn, $data['consumer_id']); 

// Generate a unique MsgID
function generateMsgID() {
    return "msg_" . bin2hex(random_bytes(4));
}

// Generate new MsgID
$msg_id = generateMsgID();
$seen = "No";

// Insert message into the database
$insertQuery = $conn->prepare("INSERT INTO messages (MsgID, SenderID, ReceiverID, Message, Seen, Date) 
                               VALUES (?, ?, ?, ?, ?, NOW())");
$insertQuery->bind_param("sssss", $msg_id, $farmer_id, $consumer_id, $msg, $seen);

if ($insertQuery->execute()) {
    echo 1; // Success
} else {
    echo 0; // Failure
}

?>
