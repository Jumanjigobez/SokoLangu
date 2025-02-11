<?php
include "../config.php";

$user_id = $_GET['user_id'];

// Fetch messages where the user is either the sender or receiver
$query = $conn->prepare("
    SELECT m.*, 
           sender.FirstName AS SenderFirstName, sender.LastName AS SenderLastName, sender.Photo AS SenderPhoto,
           receiver.FirstName AS ReceiverFirstName, receiver.LastName AS ReceiverLastName, receiver.Photo AS ReceiverPhoto
    FROM messages m
    JOIN users_table sender ON m.SenderID = sender.UserID
    JOIN users_table receiver ON m.ReceiverID = receiver.UserID
    WHERE m.SenderID = ? OR m.ReceiverID = ?
    ORDER BY m.Date ASC
");
$query->bind_param("ss", $user_id, $user_id);
$query->execute();
$result = $query->get_result();

$messagesData = array();
$unseenCount = 0;

while ($row = $result->fetch_assoc()) {
    $message = str_replace("\\'", "'", $row['Message']);
    $message = array(
        'msg_id' => $row['MsgID'],
        'sender_id' => $row['SenderID'],
        'receiver_id' => $row['ReceiverID'],
        'message' => $message,
        'seen' => $row['Seen'],
        'date' => $row['Date'],
        'sender_firstName' => $row['SenderFirstName'],
        'sender_lastName' => $row['SenderLastName'],
        'sender_photo' => $row['SenderPhoto'],
        'receiver_firstName' => $row['ReceiverFirstName'],
        'receiver_lastName' => $row['ReceiverLastName'],
        'receiver_photo' => $row['ReceiverPhoto']
    );

    // Count unseen messages where the logged-in user is the receiver
    if ($row['Seen'] == "No" && $row['ReceiverID'] === $user_id) {
        $unseenCount++;
    }

    $messagesData[] = $message;
}

// Include unseen messages count in response
$response = [
    "messages" => $messagesData,
    "unseenCount" => $unseenCount
];

header('Content-Type: application/json');
echo json_encode($response);
?>
