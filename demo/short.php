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
	<div class='chatBox'>
		<form method='post' id='pubChat'>
		<div id='chatMessages'></div>
			<input type='text' name='message' />
			<input type='submit' value='Send...'/>
		</form>
	</div>
	<script type='text/javascript'>
		var cb = $("#pubChat").first().chatBox({
			pollURL: './php/short.php',
			publishURL: './php/long.php',
			messageInput: 'input[name=message]',
			subscribeURL: './php/chat.php',
			formName: '#pubChat',
			messageBoxName: '#chatMessages',
			maxMessages: 18
		});
	</script>
	<p>Otherwise simply called "polling", was the first standard implementation, and continues to be used by most services due to wide support with all platforms.</p>
</body>
</html>