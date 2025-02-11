<?php 

include "config.php";

$msg = mysqli_real_escape_string($conn, $_POST['msg']); // Message content
$product_id = mysqli_real_escape_string($conn, $_POST['ProductId']); // the productId will be used to get the farmer as a receiver for msg
$user_id = mysqli_real_escape_string($conn, $_GET['user_id']); // Consumer's UserID

// Function to generate a unique MsgID
function generateMsgID() {
    return "msg_" . bin2hex(random_bytes(4)); // Generates a random message ID
}

// Fetch the farmer's user ID from the products_table using the product_id
$receiverQuery = $conn->prepare("SELECT UserID FROM products_table WHERE ProductID = ?");
$receiverQuery->bind_param("s", $product_id);
$receiverQuery->execute();
$receiverQueryResult = $receiverQuery->get_result();

if ($receiverQueryResult->num_rows > 0) {
    $receiverRow = $receiverQueryResult->fetch_assoc();
    $receiver_id = $receiverRow['UserID'];

    // Generate a new MsgID
    $msg_id = generateMsgID();
    $seen = "No";

    // Insert message into the database
    $insertQuery = $conn->prepare("INSERT INTO messages (MsgID, SenderID, ReceiverID, Message, Seen, Date) 
                                   VALUES (?, ?, ?, ?, ?, NOW())");
    $insertQuery->bind_param("sssss", $msg_id, $user_id, $receiver_id, $msg, $seen);

    if ($insertQuery->execute()) {
        echo 1;
    } else {
        echo 0;
    }
} else {
    echo 0;
}

?>
