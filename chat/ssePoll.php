<?php

// SSE Headers
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

// Import Connections
include('configuration.php');

// Grab retry, type, last message time, and max Messages from URL
$retry = isset($_GET['retry']) ? $_GET['retry'] : 1000;
$type = $_GET['type'];
$last = (isset($_GET['last']) ? $_GET['last'] : 1);
$maxMessages = (isset($_GET['maxMessages']) ? $_GET['maxMessages'] : 10);
$query = "SELECT * FROM `smf_chat` WHERE `created_on` > " . $last . " ORDER BY `created_on` DESC LIMIT 0," . $maxMessages;

function showResults($data, $retry) {
	echo "data: " . json_encode($data) . PHP_EOL;
	echo "retry: $retry" . PHP_EOL . PHP_EOL;
	ob_flush();
	flush();
}

// If poll=long loop every 3 seconds, else run-once
if ($type == 'long') {
	while (1) {

		// Establish DB Connection
		$conn = new mysqli(
			$host,
			$username,
			$password,
			$database
		);

		// Run Query & Return Results
		$results = $conn->query($query);

		if ($results->num_rows) {
			$messages = array();
			while ($message = $results->fetch_assoc()) $messages[] = $message;
			showResults($messages, $retry);
			break;
		}

		// Close DB Connection
		$conn->close();

		sleep(3);
	}
} else {

	// Establish DB Connection
	$conn = new mysqli(
		$host,
		$username,
		$password,
		$database
	);

	// Run Query & Return Results
	$results = $conn->query($query);

	if ($results->num_rows) {
		$messages = array();
		while ($message = $results->fetch_assoc()) $messages[] = $message;
		showResults($messages, $retry);
	}

	// Close DB Connection
	$conn->close();

}
?>