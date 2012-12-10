<?php
include("configuration.php");
header('Content-type: application/json');
$last = (isset($_GET['last']) ? $_GET['last'] : 1);
$maxMessages = (isset($_GET['maxMessages']) ? $_GET['maxMessages'] : 10);
$query = "SELECT * FROM `smf_chat` WHERE `created_on` > " . $last . " ORDER BY `created_on` DESC LIMIT 0," . $maxMessages;
while (1) {
	$conn = new mysqli(
		$host,
		$username,
		$password,
		$database
	);
	$results = $conn->query($query);
	if ($results->num_rows) {
		$messages = array();
		while ($message = $results->fetch_assoc()) $messages[] = $message;
		echo json_encode($messages);
		$conn->close();
		break;
	}
	$conn->close();
	sleep(2);
}
?>