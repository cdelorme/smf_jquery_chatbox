<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="CACHE-CONTROL" content="NO-CACHE">
	<title>Long Polling | ChatBox Demonstrations</title>
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
			maxMessages: 18,
			type: "long"
		});
	</script>
	<p>Long Polling is not supported by all server platforms, this script has been tested with nGinx specifically and may not work with Apache Servers.  The benefits of Long Polling are often swifter responses to connected clients and reduced HTTP requests at the cost of sustained client connectivity.</p>
</body>
</html>