<?php require_once("../SSI.php"); ?>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<title>ChatBox History - Test Page</title>
	<style type='text/css'>

		/* Formatting for History Page */

		.history {
			width: 80%;
			margin: 20px auto;
		}
		.chatMessages {
			padding-right: 45px;
			font-size: 14px;
			font-family: Helvetica, Georgia, sans-serif;
		    line-height: 16px;
		}
		.datestamp {
			font-size: 10px;
			font-style: italic;
			margin-right: 8px;
		}
		.username {
			margin-right: 10px;
			font-weight: bold;
		}
		.pagination {
			margin: 20px auto;
		}

	</style>
</head>
<body>
	<div class='history'>
		<h2>ChatBox History</h2>
		<div class='chatMessages'>
<?php

// Check for & grab page
$page = (isset($_GET['page']) ? $_GET['page'] : 0);

// Grab & print ChatBox Messages
$query = 'SELECT
		t1.username,
		t1.user_color,
		(t1.created_on + {int:offset}) AS created_on,
		t1.message,
		t2.color,
		t2.background
	FROM {db_prefix}chat AS t1
	LEFT JOIN {db_prefix}chat_colors AS t2
	ON t1.user_id = t2.user_id
	ORDER BY created_on DESC
	LIMIT {int:page},100';
$args = array(
	'page' => ($page * 100),
	'offset' => (3600 * $user_info['time_offset'])
);

$results = $smcFunc['db_query']('', $query, $args);

while ($row = $smcFunc['db_fetch_assoc']($results)) { ?>
			<div>
				<span class='datestamp'>[<?php echo date('m/d/Y h:i:s A', $row['created_on']); ?>]</span>
				<span class='username'<?php if ($row['user_color']) echo ' style="color: ' . $row['user_color'] . '"'; ?>><?php echo $row['username']; ?></span>
				<?php echo $row['message']; ?>
			</div>
<?php } ?>
		</div>
		<div class='pagination'>
			<a href='/chat/history.php?page=<?php echo ($page + 1); ?>'>Older</a>
			<?php if ($page > 0) { ?><a href='/chat/history.php?page=<?php echo ($page - 1); ?>'>Newer</a><?php } ?>
		</div>
	</div>
</body>
</html>