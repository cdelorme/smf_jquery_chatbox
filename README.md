
# Project: SMF ChatBox
## Date: 01/06/2013
## Author: Casey DeLorme

---

## Description:

This is a fork of my jQuery AJAX ChatBox revised for use with Simple Machine Forums.

The instructions and operation remain quite similar, and some of the updates here will be pack-ported to the original source to enhance both, however this version is tailored to the SMF platform and includes a packaged installation script and comprehensive ChatAPI file.

**Due to unforeseen limitations with stateful processing the SSE component has been removed from this version and will be removed from the original as well.**

Currently supporting AJAX short and long polling, and uses a database.

Future revisions will feature SharedWorker implementations for supporting browsers as well as WebSockets, primarily using node.js for demonstrative scripts (but not limited to that platform for back-end).

---

## Support:

This system has been tested on Windows, Debian Linux, and OS X in the following browsers where applicable:

- Chrome
- FireFox
- Opera
- Safari
- Internet Explorer 7, 8, 9 & 10

The tests were performed with jQuery version 1.8.3 off the Google API, with earlier tests working using jQuery 1.6.

---

## Usage:

This system relies on jQuery being included in SMF, if jQuery has not been implemented you will want to add it, perhaps using this line:

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>

The ChatBox uses the Spectrum jQuery Plugin for a color picker and will attempt to install it.  It also features an administrative script to enhance the ChatBox features adding message deletion and user banning operations.

To manually install the package:

- Place the `chat` folder in public_html
- Add the following lines to the header section of all index.template.php files:

	echo '
	<link href="/chat/css/main.css?' . time() . '" rel="stylesheet" type="text/css" />
	<link href="/chat/css/spectrum.css?' . time() . '" rel="stylesheet" type="text/css" />';
	echo '
	<script type="text/javascript"  src="/chat/js/chatbox.js?' . time() . '"></script>
	<script type="text/javascript"  src="/chat/js/spectrum.js?' . time() . '"></script>';
	if (allowedTo('admin_chatbox') || $context['user']['is_admin']) {
		echo '		<script type="text/javascript"  src="/chat/js/chatbox.admin.js?' . time() . '"></script>';
	}

- Add this chatbox code to your themes index.template.php file anywhere you like:

	<!--Begin SMF-ChatBox-->
	<div class="chat">
		<form method="post" id="chatBox"></form>
		<script type="text/javascript">
		<!--// Cloaking
			// Pass Chatbox to establish instance
			var cb = $("#chatBox").chatBox({
				paths: {
					xhr: "/chat/ChatAPI.php"
				}
			});
		//-->
		</script>
	</div>
	<!--End SMF-ChatBox-->

I have created extensive documentation on how to modify and use the `cb` instance.

---

## Documentation:

**Basic Usage:**

This ChatBox has been modified to be instantiated as a jQuery extended object, and multiple instances can be created on the same page with different setting.

To create an instance simply target the containing object and then run the `.chatBox()` method, the object will be converted into a ChatBox instance and new methods will be available.  It will automatically begin communication.

You can stop a chatbox by running the `.stop()` method on it after.  Similarly you can start it by running the `.start()` method.

This version has been modified to use a single API path which it relies on for all communication.

The ChatAPI contains the following operations:

- poll
- post
- ban
- unban
- setColors
- getColors
- clearColors
- delete

The colors system is specific to this version, it allows users to customize their chat appearance in the ChatBox, including background and foreground text.

---

**ChatBox Configuration:**

You can modify the ChatBox by passing objects to the `.chatBox()` method.  Here is the list of objects and their purpose:

- options
	- type - Default is short, long is an available option but compatibility is dependent on your web server.
	- maxMessages - Default is 20, you can increase or decrease this value to change the number of messages to display on the page.
	- display - Default is down, and this can be used to determine the placement of the input text area and the message directional flow.
	- idle - Count of iterations before it ceases polling, 0 is indefinite, but a default of 36 is imposed.
- timing
	-


Example of instantiation with modified options:

	cb.chatBox({
		options: {
			type: "long",
			display: "up"
		},
		timing: {
			poll: 1000,
			timeout: 30000
		},
		paths: {
			xhr: "/chat/ChatAPI.php"
		}
	});

This will use the ChatAPI for all xhr/AJAX operations, it will use long polling with a timeout of 30 seconds.  The poll value is used for the idle count which results in 36*1000 or 36 seconds of idle to stop polling.  Finally display is set to up, which will place the input above the messages and new messages will be prepended to the top.



**Override Functionality:**

If you do not like the way something is handled, you can modify it in the source directly, or using the exact same approach as above you can replace the method by writing a new one when instantiating.

For example, if you would rather not have animated rendering of new messages you can do this:

	cb.chatBox({
		paths: { xhr: "/chat/ChatAPI.php" },
		renderNewMessages = function(data) {
			var divs = [];
			for (var x = 0, len = data.length; x < len; x++) divs[divs.length] = this.renderMessage(data[x]);
			if (this.options.display == 'down') {
				for (var x = divs.length - 1; x >= 0; x--) divs[x].appendTo(this.messageDisplay);
			} else {
				for (var x = 0, len = divs.length; x < data.length; x++) divs[x].prependTo(this.messageDisplay);
			}
		}
	});

Now that specific instance of the chatBox will not animate new messages with slideDown, and your changes aren't applied globally and you don't have to worry about breaking the original code base.

For a complete list of methods you will want to view the chatbox.js source code, all methods can be replaced but you may have to be careful to retain variable references such as the "this" object.

---

## Developer Notes:

Apache servers do not play nice with long polling, unless you have researched this topic and modified or tested your web server, I recommend using short polling.

This system has been tested on an nginx server using all available methods.  If you encounter bugs using it in another server platform please let me know or post a bug in the issue tracker so I can look into fixing it.

---

## Incomplete Components & Plans for Future Revisions:

- SharedWorker Implementation
- WebSocket Implementation
- node.js demo WebSocket Script
