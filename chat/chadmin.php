<?php

/*

Administrative page for adding, listing, and removing users (by id) from the ban-list.

Also, for deleting chat messages by id!

*/


/*

$smcFunc['db_query']('', 'INSERT INTO {$db_prefix}chat (user_id, username, created_on, message) VALUES ({int:user_id}, {text:user}, {text:message}, {int:date})', array(
	'user_id' => $context['user']['id']),
	'user' => $context['user']['username']),
	'message' => $_GET['message'],
	'date' => time()
);

(`user_id`, `username`, `message`, `created_on`) VALUES (" . $user_id . ", '" . $musername . "', '" . $message . "', " . $created_on . ")

Variables of Value
$context is the most valuable so far, user_info is nice but not as much content.
smcFunc is a useful array for accessing available methods.

Well, let's just go over the process here.

- Check for banned by user_id
- Check message not empty
- Save new message to table


id
user_id
username
created_on
message

$banned = $smcFunc['db_query']('', '
	SELECT poster_time
	FROM {db_prefix}chat_banned
	WHERE user_id = {int:user_id}
	LIMIT 1',
	array(
		'user_id' => $context['user']['id'],
	)
);

$smcFunc['db_query']('', "CREATE TABLE IF NOT EXISTS {$db_prefix}chat (
		id int(11) unsigned auto_increment,
		user_id int(11) unsigned,
		username varchar(255),
		created_on int,
		message text,
		INDEX(user_id),
		INDEX(created_on),
		PRIMARY KEY (id)
	)");

// If Error Quit
$db_error = @$smcFunc['db_error']($db_connection);
if ($db_error) {
	echo "Failed to Create ChatBox Table, review this error and try again: " . $db_error;
	return false;
}

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

*/


?>