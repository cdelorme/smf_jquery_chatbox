<?php

/*

ChatAPI.php

This is a JSON API responsible for handling ALL ChatBox actions.

These actions include:

- Posting
- Polling
- Banning
- UnBanning
- Getting Colors
- Setting Colors
- Clear Colors
- Delete Message

Modifications to the Chat Core can all be made here.

*/

// Check Action
if (isset($_GET['action'])) {

	// Acquire Action
	$action = $_GET['action'];

	// Set JSON Headers
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-type: application/json');

	// Import SMF Core
	require_once("../SSI.php");

	// Check permissions
	$canDo = (allowedTo('admin_chatbox') || $context['user']['is_admin']);

	// Confirm Action and Take Action!
	if ($action == 'poll') {

		// Acquire User Offset
		$offset = 3600 * $user_info['time_offset'];

		// Use max messages or a default of 10
		$maxMessages = (isset($_GET['maxMessages']) ? $_GET['maxMessages'] : 10);

		// Grab last message timestamp from request
		$last = (isset($_GET['last']) ? ($_GET['last'] + $offset) : 1);

		// Prepare Query String & Args
		$query = 'SELECT
			t1.id,
			t1.username,
			t1.user_color,
			(t1.created_on + {int:offset}) AS created_on,
			t1.message,
			t2.color,
			t2.background
		FROM {db_prefix}chat AS t1
		LEFT JOIN {db_prefix}chat_colors AS t2
		ON t1.user_id = t2.user_id
		WHERE created_on > {int:last}
		ORDER BY created_on DESC
		LIMIT 0,{int:max}';
		$args = array(
			'max' => $maxMessages,
			'last' => $last,
			'offset' => $offset
		);

		// Check Polling Type
		if (isset($_GET['type']) && $_GET['type'] != 'short') {// Long Poll

			while (1) {

				$grab = $smcFunc['db_query']('', $query, $args);

				// If Results Exist Return
				if ($smcFunc['db_num_rows']($grab) > 0) {

					// Prepare Return Array & Populate with Results
					$messages = array();
					while ($row = $smcFunc['db_fetch_assoc']($grab)) $messages[] = $row;

					// Exit the Loop
					break;

				}

			}

		} else {// Short Poll

			$grab = $smcFunc['db_query']('', $query, $args);

			// Prepare Return Array & Populate with Results
			$messages = array();
			while ($row = $smcFunc['db_fetch_assoc']($grab)) $messages[] = $row;

		}

		if (isset($messages)) print_r(json_encode($messages));

	} else if ($action == 'post') {

		// User is logged in
		if ($context['user']['is_logged']) {

			// Check if banned
			$banned = $smcFunc['db_query']('', 'SELECT id FROM {db_prefix}chat_banned WHERE user_id = {int:user_id} LIMIT 1', array('user_id' => $context['user']['id']));
			if ($smcFunc['db_num_rows']($banned) == 0) {

				// Grab user_color from Crazy Deep SMF User Data
				loadMemberData(Array($context['user']['id']), false, 'profile');
				$user_color = $user_profile[$context['user']['id']]['member_group_color'];

				// if Message exists and is not empty, post it
				if (isset($_POST['message']) && !empty($_POST['message'])) {

					// Parse it first
					$context['aeva_disable'] = 1;
					$message = $_POST['message'];
					$message = parse_bbc($message);
					censorText($message);
					unset($context['aeva_disable']);

					// Run SQL
					$smcFunc['db_query']('', 'INSERT INTO {db_prefix}chat (user_id, username, user_color, created_on, message) VALUES ({int:user_id}, {text:user}, {text:ucolor}, {int:date}, {text:message})', array( 'user_id' => $context['user']['id'], 'user' => $context['user']['username'], 'ucolor' => $user_color, 'message' => $message, 'date' => time()));

				}

			}
		}

	} else if ($action == 'ban' && $canDo) {

		// Check for user_id OR message_id
		if (isset($_GET['message_id'])) $message_id = $_GET['message_id'];
		if (isset($_GET['user_id'])) $message_id = $_GET['user_id'];

		// Get User ID by Message ID
		if (!isset($user_id) && isset($message_id)) {

			$query = 'SELECT user_id FROM {db_prefix}chat WHERE id = {int:mid} LIMIT 1';
			$args = array('mid' => $message_id);
			$results = $smcFunc['db_query']('', $query, $args);
			if ($smcFunc['db_num_rows']($results) == 1) $user_id = $smcFunc['db_fetch_assoc']($results)['user_id'];

		}

		if (isset($user_id)) {

			// Is not self
			if ($user_id != $context['user']['id']) {

				// Run Insert
				$query = 'INSERT INTO {db_prefix}chat_banned (user_id)
					SELECT
						t1.id_member
					FROM
						{db_prefix}members AS t1
					LEFT JOIN {db_prefix}permissions AS t2
					ON
							t2.permission = "admin_chatbox"
						AND
							t1.id_group = t2.id_group
					WHERE
							t1.id_member = {int:uid}
						AND
							t1.id_group != 1
						AND
								(t2.add_deny IS NULL
							OR
								t2.add_deny != 1)';
				$args = array('uid' => $user_id);
				$smcFunc['db_query']('', $query, $args);

			}

		}

	} else if ($action == 'unban' && $canDo) {

		if (isset($_GET['uid'])) {

			$user_id = $_GET['uid'];
			$query = "DELETE FROM {db_prefix}chat_banned WHERE user_id = {int:uid}";
			$args = array('uid' => $user_id);
			$smcFunc['db_query']('', $query, $args);

		}

		// Return user to referrer
		$ref = $_SERVER['HTTP_REFERER'];
		header('Location: ' . $ref);

	} else if ($action == 'getColors') {

		$ucolors = array();
		$grab_colors = $smcFunc['db_query']('', "SELECT color, background FROM {db_prefix}chat_colors WHERE user_id = {int:uid} LIMIT 1", array( 'uid' => $context['user']['id'] ));
		if ($smcFunc['db_num_rows']($grab_colors) == 1) $ucolors = $smcFunc['db_fetch_assoc']($grab_colors);
		print_r(json_encode($ucolors));

	} else if ($action == 'setColors') {

		// Prepare Arguments Array
		$args = array('uid' => $context['user']['id'], 'color' => '', 'background' => '');

		// Grab any provided color codes
		if (isset($_GET['fcolor'])) $args['color'] = $_GET['fcolor'];
		if (isset($_GET['bcolor'])) $args['background'] = $_GET['bcolor'];

		// If at least one color has been passed
		if (count($args) > 0) {

			// Check if record exists
			$exists = $smcFunc['db_query']('', 'SELECT id FROM {db_prefix}chat_colors WHERE user_id = {int:uid}', array('uid' => $context['user']['id']));
			if ($smcFunc['db_num_rows']($exists) == 0) {

				// Insert
				$query = 'INSERT INTO {db_prefix}chat_colors (user_id, color, background) VALUES ({int:uid}, {text:color}, {text:background})';
				$smcFunc['db_query']('', $query, $args);

			} else {

				// Update
				$query = 'UPDATE {db_prefix}chat_colors SET color = IF({text:color} = "", color, {text:color}), background = IF({text:background} = "", background, {text:background}) WHERE user_id = {int:uid}';
				$smcFunc['db_query']('', $query, $args);

			}

		}
	} else if ($action == 'clearColors') {

		// Remove record of users colors
		$query = 'DELETE FROM {db_prefix}chat_colors WHERE user_id = {int:uid}';
		$args = array('uid' => $context['user']['id']);
		$smcFunc['db_query']('', $query, $args);

	} else if ($action == 'delete' && $canDo) {

		// Check for message_id
		if (isset($_GET['message_id'])) {

			// Prepare query /w args
			$query = "DELETE FROM {db_prefix}chat WHERE id = {int:mid}";
			$args = array('mid' => $_GET['message_id']);
			$smcFunc['db_query']('', $query, $args);

		}

	}

}

// No action No deal
