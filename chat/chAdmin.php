<?php require_once("../SSI.php");
// Check permissions
$canDo = (allowedTo('admin_chatbox') || $context['user']['is_admin']);
if (!$canDo) header( 'Location: /'); ?>
<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<title>ChatBox History - Test Page</title>
	<style type='text/css'>

		/* Formatting for History Page */

		.chatAdmin {
			width: 80%;
			margin: 20px auto;
		}
		.banList {
			padding-right: 45px;
			font-size: 14px;
			font-family: Helvetica, Georgia, sans-serif;
		    line-height: 16px;
		}
		.pagination {
			margin: 20px auto;
		}

	</style>
</head>
<body>

	<div class='chatAdmin'>
		<h2>Ban List</h2>
		<p>Please apply Ban Hammer Remover at your discretion.</p>
		<div class='banList'>
<?php

// Check for & grab page
$page = (isset($_GET['page']) ? $_GET['page'] : 0);

// Grab List of 25 Banned Users
$query = 'SELECT
	t1.id,
	t1.user_id,
	t2.member_name
FROM
	{db_prefix}chat_banned AS t1
LEFT JOIN
	{db_prefix}members AS t2
	ON
		t1.user_id = t2.id_member
LIMIT {int:page},30';
$args = array(
	'page' => ($page * 30)
);

$results = $smcFunc['db_query']('', $query, $args);

while ($row = $smcFunc['db_fetch_assoc']($results)) { ?>
			<div>
				<?php echo $row['member_name']; ?>
				<a href='/chat/ChatAPI.php?action=unban&uid=<?php echo $row['user_id'] ?>' class='unban'>unban</a>
			</div>
<?php } ?>
		</div>
		<div class='pagination'>
			<a href='/chat/chAdmin.php?page=<?php echo ($page + 1); ?>'>Next</a>
			<?php if ($page > 0) { ?><a href='/chat/chAdmin.php?page=<?php echo ($page - 1); ?>'>Previous</a><?php } ?>
		</div>
	</div>
</body>
</html>