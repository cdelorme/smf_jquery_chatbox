<?php

// Set Headers
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

// Import Core - Note SSI appears to be setting headers, so converting to JSON header isn't acceptable (produces garbage)
require("../SSI.php");

// Use max messages or a default of 10
$maxMessages = (isset($_GET['maxMessages']) ? $_GET['maxMessages'] : 10);

// Grab last message timestamp from request
$last = (isset($_GET['last']) ? $_GET['last'] : 1);

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

		// Print JSON Output /w appropriate headers
		echo json_encode($messages);
		break;

	}

}

?>