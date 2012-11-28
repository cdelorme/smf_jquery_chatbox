
# Project: jQuery AJAX Chat Plugin
# Date: 11/26/2012
# Author: Casey DeLorme

---

## Description:

This is my first jQuery plugin.

It allows you to create a ChatBox with a variety of customizations including short and long polling AJAX currently.

The final version should allow for Short and Long Polling AJAX, and take advantage of more modern tools such as WebSockets and SharedWorkers to reduce load and enhance the service.

For now only PHP server code is supplied for demonstration, in the future I will add node.js for complete WebSocket support, however WebSockets are also great for general short-polling.

The use of SharedWorker conceptually may separate the AJAX calls to a single process for multiple tabs, which may reduce server load, although I have not tested this theory in practice nor have I seen it demonstrated.

An installation and configuration php script will be included in later revisions to create the table to run the demonstrations.

---

## Support:

Tested on:

- OS X
	- FireFox (16)
	- Aurora
	- Chrome Dev Channel (25)
	- Opera (12)
	- Safari (6)
- Debian Wheezy (Linux)
	- Chrome Dev Channel (22)
- Windows
	- Chrome Dev Channel
	- Aurora
	- Opera
	- IE 7-10

All tests were performed with jQuery versions 1.6.3 and 1.8.3.  Assumed that 1.6.3 and newer will work.

---

## Usage:

Add the script using a script tag or using jQuery's getScript method.

After the DOM is ready or as soon as the form and message area used by your chat service has been created, you can create an instance of the Chatbox.

Create a chatbox instance around any form component (implementation is incomplete so this actually does not matter), and supply it with required arguments.

### Example Instantiation:

	var cb = $(".chatBox").first().chatBox({
		pollURL: '/chat/poll.php',
		publishURL: '/chat/publish.php',
		subscribeURL: '/chat/subscribe.php',
		formName: '#pubChat',
		messageBoxName: '#chatMessages',
		messageInput: 'input[name=message]',
		maxMessages: 18
	});

The above will create a new chatbox.  It uses the selectors for the components to be accessed by javascript, and paths or URL's for the operations.  It overrides the maximum displayed messages to give us more content.  It will use the default render process, and short polling.  See the parameter list below the examples for more details.


### Example with Method Overrides:

	var cb = $(".chatBox").first().chatBox({
		pollURL: '/chat/poll.php',
		publishURL: '/chat/publish.php',
		messageInput: 'input[name=message]',
		subscribeURL: '/chat/subscribe.php',
		formName: '#pubChat',
		messageBoxName: '#chatMessages',
		type: "long"
	});

The above system overrides the `renderNewMessages` and `removeRenderedMessages` operations, allowing us to define entirely different display options for the received message object.

---

## Documentation:

Required Parameters:

- pollURL - Standard Polling URL
- publishURL - URL For posting new messages
- subscribeURL - URL for Long Polling Retrieval
- messageBoxName - Selector for Chatbox Message Div
- formName - Selector for Chat Form
- messageInput - Selector for Form Message Input

---

## Options:

**type** - String property for Polling type.  Default is "short", which is universally compatible, Long Polling (represented by "long") requires additional server side code.  See included php.

**animate** - Default is true, can be set to false to turn off animated append and remove operations.  Only two methods use animation, `removeOldRenderedMessages` and `renderNewMessages`.

**maxMessages** - Maximum number of displayed and stored messages, default is 10.  To get the correct number, the request passes an argument to the server, see included php.

**pollTime** - Default is 5000 (5 seconds), if your server can handle a heavy load feel free to decrease it, and if your server is slowing to a crawl, increase it.

**longTimeout** - Default is 50000, or 50 seconds, it's the maximum time jQuery will wait for an AJAX response from long polling before closing the request and trying again.  If your server can handle long polling the longer the better, if you are having connection limit problems, use short polling.

---

## Methods:

renderNewMessages - Can be overridden to render custom messages.  By default assumes each message has a `username`, `message`, `id`, and `created_on` fields, and parses a timestamp using `created_on`.  You can change the entire render process here.

removeOldRenderedMessages - If you change the render process you may also wish to change the removal process as it uses the DOM to identify and remove extra components.

---

## Developer Notes:

Apache servers do not play nice with long polling, unless you have researched this topic and know it will work, I recommend leaving it on the default short polling method.

This was tested extensively on an nginx server with success using Long Polling without setting up the HTTP Push module in the nginx configuration (the module was installed just not configured).

Assumption is that only one Chatbox will exist on any given page, so I did not use jQuery's recommended `this.each` style of processing.  The system was not designed to handle multiple GUI renderer's, and I have no plans to implement this currently.

---

## Incomplete Components & Plans for Future Revisions:

- Debug Long Polling "Stop()" operations
- Revise jQuery plugin implementation and operations
- Simplify send operation to serialize form
- Implement boolean "active" flag for start/stop/restart operation
- Separate GUI component from the rest of the code
- Cleanup jQuery Plugin required variables
- Implementation of optional SharedWorker to reduce load
- Implement optional WebSockets
- Supply example node.js scripts for WebSocket Demonstration

The long term objective is to have a fully functional ChatBox with demonstration code for all major methods of implementation.

As a generic chatbox it can be added to any site or system.

I have plans to use the source in an SMF project and will likely branch that implementation.
