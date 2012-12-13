<?php

/*

SMF ChatBox Removal Script
Version: 1.0
Author: CDeLorme

BitBucket source available:
https://bitbucket.org/CDeLorme/smf-chatbox

Deletes the three tables from the database.

*/

// Importing SMF Core: SSI.php
if (file_exists(dirname(__FILE__) . "/../../SSI.php")) {
	if (!require(dirname(__FILE__) . "/../../SSI.php")) return false;
}

// Delete Old Table
$smcFunc['db_query']('', "DROP TABLE IF EXISTS {$db_prefix}chat");

// If Error Quit
$db_error = @$smcFunc['db_error']($db_connection);
if ($db_error) {
	echo "Failed to Delete ChatBox Table, review this error and try again: " . $db_error;
	return false;
}

// Delete Old Table
$smcFunc['db_query']('', "DROP TABLE IF EXISTS {$db_prefix}chat_banned");

// If Error Quit
$db_error = @$smcFunc['db_error']($db_connection);
if ($db_error) {
	echo "Failed to Delete ChatBox Banned Table, review this error and try again: " . $db_error;
	return false;
}

// Delete Old Table
$smcFunc['db_query']('', "DROP TABLE IF EXISTS {$db_prefix}chat_colors");

// If Error Quit
$db_error = @$smcFunc['db_error']($db_connection);
if ($db_error) {
	echo "Failed to Delete ChatBox Colors Table, review this error and try again: " . $db_error;
	return false;
}

?>