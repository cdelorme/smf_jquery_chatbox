<?php

/*

SMF ChatBox Installation Script
Version: 1.0
Author: CDeLorme

BitBucket source available:
https://bitbucket.org/CDeLorme/smf-chatbox

Prepares three tables for the new ChatBox, deleting them if they already exist.

*/

// Importing SMF Core: SSI.php
if (file_exists(dirname(__FILE__) . "/../../SSI.php")) {
	if (!require(dirname(__FILE__) . "/../../SSI.php")) return false;
}

// Confirm if allowed to
isAllowedTo('admin_forum');

// Include uninstall script to delete existing tables first
include('smf-2.0.x-uninstall.php');

// Create Main Table
$smcFunc['db_query']('', 'CREATE TABLE IF NOT EXISTS {db_prefix}chat (
		id int(11) unsigned auto_increment,
		user_id int(11) unsigned,
		username varchar(255),
		created_on int,
		message text,
		user_color varchar(10),
		INDEX(user_id),
		INDEX(created_on),
		PRIMARY KEY (id)
	)');

// If Error Quit
$db_error = @$smcFunc['db_error']($db_connection);
if ($db_error) {
	echo "Failed to Create ChatBox Table, review this error and try again: " . $db_error;
	return false;
}

// Create Main Table
$smcFunc['db_query']('', 'CREATE TABLE IF NOT EXISTS {db_prefix}chat_banned (
		id int unsigned,
		user_id int unsigned,
		INDEX(user_id),
		PRIMARY KEY (id)
	)');

// If Error Quit
$db_error = @$smcFunc['db_error']($db_connection);
if ($db_error) {
	echo "Failed to Create ChatBox Ban Table, review this error and try again: " . $db_error;
	return false;
}

// Create Main Table
$smcFunc['db_query']('', 'CREATE TABLE IF NOT EXISTS {db_prefix}chat_colors (
		id int unsigned,
		user_id int unsigned,
		color varchar(10),
		background varchar(10),
		INDEX(user_id),
		PRIMARY KEY (id)
	)');

// If Error Quit
$db_error = @$smcFunc['db_error']($db_connection);
if ($db_error) {
	echo "Failed to Create ChatBox Color Table, review this error and try again: " . $db_error;
	return false;
}

?>