<?php
include("configuration.php");
$user_id = 0;
$musername = "No Names";
$message = $_POST['message'];
$created_on = time();
if (!empty($message)) {
	$conn = new mysqli(
		$host,
		$username,
		$password,
		$database
	);
	$query = "INSERT INTO `smf_chat` (`user_id`, `username`, `message`, `created_on`) VALUES (" . $user_id . ", '" . $musername . "', '" . $message . "', " . $created_on . ")";
	$result = $conn->query($query);
	$conn->close();
}
?>