<?php

// Import Core
require("../SSI.php");

// User is logged in
if ($context['user']['is_logged']) {

	// Check if banned
	$banned = $smcFunc['db_query']('', 'SELECT id FROM {db_prefix}chat_banned WHERE user_id = {int:user_id} LIMIT 1', array('user_id' => $context['user']['id']));
	if ($smcFunc['db_num_rows']($banned) == 0) {

		// if Message exists and is not empty, post it
		if (isset($_POST['message']) && !empty($_POST['message']))
			$smcFunc['db_query']('', 'INSERT INTO {db_prefix}chat (user_id, username, created_on, message) VALUES ({int:user_id}, {text:user}, {int:date}, {text:message})', array( 'user_id' => $context['user']['id'], 'user' => $context['user']['username'], 'message' => $_POST['message'], 'date' => time()));

	}
}

?>