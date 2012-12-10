<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="CACHE-CONTROL" content="NO-CACHE">
	<title>Short Polling | ChatBox Demonstrations</title>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script src="./js/chatbox.js"></script>
	<link href="./css/main.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<form method='post' id='chatBox'>
		<p><input type='text' name='message' /> <input type='submit' value='Send...'/></p>
	</form>
	<script type='text/javascript'>

		// Pass Chatbox to establish instance
		var cb = $("#chatBox").chatBox({
			options: {
				type: "long"
			},
			paths: {
				xhrPost: "/php/xhrPost.php",
				xhrPoll: "/php/xhrPoll.short.php",
				ssePoll: "/php/ssePoll.php"
			}
		});

	</script>
	<p>Demonstration using SSE for Polling and regular AJAX for post operations.</p>
</body>
</html>