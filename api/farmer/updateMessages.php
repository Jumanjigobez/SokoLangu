<?php
include "../config.php";

$user_id = $_GET['user_id']; // Consumer's user ID (sender)
$receiver_id = $_GET['receiver_id']; // Farmer's user ID (receiver)

// Update the Seen status to Yes for all messages between the user and receiver
$query = $conn->prepare("UPDATE messages SET Seen = 'Yes' WHERE SenderID = ? AND ReceiverID = ?");
$query->bind_param("ss", $receiver_id, $user_id); // Sender is the farmer, Receiver is the consumer

if ($query->execute()) {
    // Now fetch the updated messages to return them to the frontend
    $messagesQuery = $conn->prepare("
        SELECT m.*, 
               sender.FirstName AS SenderFirstName, sender.LastName AS SenderLastName, sender.Photo AS SenderPhoto,
               receiver.FirstName AS ReceiverFirstName, receiver.LastName AS ReceiverLastName, receiver.Photo AS ReceiverPhoto
        FROM messages m
        JOIN users_table sender ON m.SenderID = sender.UserID
        JOIN users_table receiver ON m.ReceiverID = receiver.UserID
        WHERE m.SenderID = ? OR m.ReceiverID = ?
        ORDER BY m.Date ASC
    ");
    $messagesQuery->bind_param("ss", $user_id, $user_id); // Fetch messages for the current user
    $messagesQuery->execute();
    $result = $messagesQuery->get_result();
    
    $messagesData = array();
    $unseenCount = 0;

    while ($row = $result->fetch_assoc()) {
        $message = array(
            'msg_id' => $row['MsgID'],
            'sender_id' => $row['SenderID'],
            'receiver_id' => $row['ReceiverID'],
            'message' => $row['Message'],
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
        if ($row['Seen'] == "No" && $row['ReceiverID'] == $user_id) {
            $unseenCount++;
        }

        $messagesData[] = $message;
    }

    // Return the updated messages data and unseen count
    $response = [
        "messages" => $messagesData,
        "unseenCount" => $unseenCount
    ];

    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    echo "Database error. Please try again.";
}
?>
