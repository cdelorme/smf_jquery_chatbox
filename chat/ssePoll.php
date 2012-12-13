<?php

// Set SSE Headers
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

// Import Core - Note SSI appears to be setting headers, so converting to JSON header isn't acceptable (produces garbage)
require("../SSI.php");

// Gather maxMessages, Last Message Time, Retry and Type from URL
$maxMessages = isset($_GET['maxMessages']) ? $_GET['maxMessages'] : 10;
$last = isset($_GET['last']) ? $_GET['last'] : 1;
$retry = isset($_GET['retry']) ? $_GET['retry'] : 1000;
$type = isset($_GET['type']) ? $_GET['type'] : "";

// Define Return Function
function showResults($data, $retry) {
	echo "data: " . json_encode($data) . PHP_EOL;
	echo "retry: $retry" . PHP_EOL . PHP_EOL;
	ob_flush();
	flush();
}

// If poll=long loop every 3 seconds, else run-once
if ($type == 'long') {
	while (1) {

		// Query Messages
		$grab = $smcFunc['db_query']('',
			'SELECT
				t1.id,
				t1.username,
				t1.created_on,
				t1.message,
				t2.color,
				t2.background
			FROM {db_prefix}chat AS t1
			LEFT JOIN {db_prefix}chat_colors as t2
			ON t1.user_id = t2.user_id
			WHERE created_on > {int:last}
			ORDER BY created_on DESC
			LIMIT 0,{int:max}',
			array(
				'max' => $maxMessages,
				'last' => $last
			)
		);

		// If Results Exist Return
		if ($smcFunc['db_num_rows']($grab) > 0) {

			// Prepare Return Array & Populate with Results
			$messages = array();
			while ($row = $smcFunc['db_fetch_assoc']($grab)) $messages[] = $row;
			showResults($messages, $retry);
			break;

		}

		sleep(3);
	}
} else {

	// Query Messages
	$grab = $smcFunc['db_query']('',
		'SELECT
			t1.id,
			t1.username,
			t1.created_on,
			t1.message,
			t2.color,
			t2.background
		FROM {db_prefix}chat AS t1
		LEFT JOIN {db_prefix}chat_colors as t2
		ON t1.user_id = t2.user_id
		WHERE created_on > {int:last}
		ORDER BY created_on DESC
		LIMIT 0,{int:max}',
		array(
			'max' => $maxMessages,
			'last' => $last
		)
	);

	// If Results Exist Return
	if ($smcFunc['db_num_rows']($grab) > 0) {

		// Prepare Return Array & Populate with Results
		$messages = array();
		while ($row = $smcFunc['db_fetch_assoc']($grab)) $messages[] = $row;

		// Print JSON Output /w appropriate headers
		showResults($messages, $retry);

	}

}

?>