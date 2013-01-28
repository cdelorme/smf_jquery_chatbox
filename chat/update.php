<?php
/*
PHP Upgrade Script modifies the colors table.
It does not keep the users colors, but it also doesn't require a complete reinstallation.
*/

// Importing SMF Core: SSI.php
if (file_exists(dirname(__FILE__) . "/../SSI.php")) {
	if (!require(dirname(__FILE__) . "/../SSI.php")) return false;
}


// Delete Old Table
$smcFunc['db_query']('', 'DROP TABLE IF EXISTS {db_prefix}chat_colors');


// Create Colors Table
$smcFunc['db_query']('', 'CREATE TABLE IF NOT EXISTS {db_prefix}chat_settings (
		id int unsigned auto_increment,
		user_id int unsigned,
		color varchar(10),
		background varchar(10),
		timestamps tinyint(1),
		colors tinyint(1),
		INDEX(user_id),
		PRIMARY KEY (id),
		UNIQUE user_key (user_id)
	)');

?>