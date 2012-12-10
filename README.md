
# Project: jQuery AJAX Chat Plugin
## Date: 11/26/2012
## Author: Casey DeLorme

---

## Description:

This is my first jQuery plugin.

It allows you to extend a basic form into a ChatBox object with a variety of customizations.

It supports Short and Long AJAX (XHR) Polling, Server-Sent Events (SSE/EventSource), and (**eventually**) WebSockets for communication.

It will (**eventually**) take advantage of SharedWorkers in supported browsers to mitigate load for multi-tabbed browsing.

For demonstrative purposes, server-side scripts are supplied with functional (not-secured) examples for each type of communication.

**An installation script may be supplied in future revisions to establish the required table.**

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

Tests were performed with jQuery version 1.8.3.

---

## Usage:

Add the script tag:

	<script type='text/javascript' src='/js/chatBox.js'></script>

When the DOM is ready, grab your form with jQuery selectors and run the chatBox method, supplying it with required and optional values:

	var cb = $('#myForm').chatBox({
		options: {
			display: 'up'
		},
		paths: {
			xhrPost: "/php/xhrPost.php",
			xhrPoll: "/php/xhrPoll.short.php"
		}
	});


Now `cb` is a chatBox instance.  It will start automatically, and you can stop it manually with `cb..stop()`.

---

## Documentation:

A ChatBox instance must be provided at least xhrPoll and xhrPost paths, everything else is optional or has defaults.


**Chatbox Paths**

Extended from the paths object:

- xhrPost
- xhrPoll
- ssePoll
- webSocket

By default expects xhrPost and xhrPoll to be provided.  Not all browsers support SSE or WebSockets, this ensures backwards compatibility.

Server-Side code for the xhr operations must be tailored according to the Options `type` ("short" or "long") but timing can be adjusted via the Timing configuration.

If SSE is set and supported it will override xhr Polling, but if WebSockets are set and supported they will override all other types.

SSE is only server-to-client, so it only has a polling path, and must be used in conjunction with xhrPost.  If Options `type` is "short" it will send the server a retry-value in the path equal to the Timing `poll` value, which by default means every 5 seconds.  The default retry is 3 seconds, and if you are using long polling you should hard-code a short retry of 1000.

WebSockets are two-way and use a single path.  This system assumes that same path can both send and receive messages.


**Chatbox Timing**

- poll
- timeout

The poll value is the number of milliseconds between each request to the server.  This is used in short polling and for reconnection times with long polling.  Its default value is 5000 (5 seconds).

The timeout value is for xhr (AJAX) long polling only, and defaults to 50000 (50 seconds).  It is the amount of time an xhrPoll will remain open and waiting for the server to finish before being canceled by the client.  You may want to make sure your server script is set to stop after this timeout as well.


**Chatbox Options**

- type
- idle
- maxMessages
- display

The type represents the selected polling type, defaulting to "short" but accepting "long" as an alternative.

The idle value is the multiple of the Timing `poll` interval prior to temporarily shutting down the Chatbox.  By default an idle of 36 with the 5 second poll gives the Chatbox 3 minutes to idle.  If set to 0 it will never idle.

The maxMessages changes the number of messages to render on screen, all messages beyond it will be removed to keep the message area from becoming enormous.  The default is 20 messages.

The display option allows you to choose whether new messages post upward or downward.  By default it is "down" which keeps the input below the messages, and new messages are appended at the bottom.  If set to "up" the input will be at the top and new messages will be preprended above the last message.


**Want to change how the messages are displayed?**

The system has four render methods that manage displaying the content.

- stampTime(unix_time)
- removeOldRenderMessages
- renderNewMessages(messages)
- scrollEvent

You can modify them directly, or replace them by passing new methods when you instantiate the ChatBox.

The stampTime method converts a unix timestamp into a display-friendly time-stamp.

The removeOldRenderMessages removes any messages above the maxMessages value.  It is animated.

The renderNewMessages receives a JSOn array of new messages, and creates the HTML around them, then animates them into view.

The scrollEvent method scrolls to the top or bottom of the list when a new message is displayed.

---

## Developer Notes:

Apache servers do not play nice with long polling, unless you have researched this topic and know it will work, I recommend leaving it on the default short polling method.

This was tested extensively on an nginx server with success using Long Polling without setting up the HTTP Push module in the nginx configuration (the module was installed just not configured).

---

## Incomplete Components & Plans for Future Revisions:

- SharedWorker Implementation
- WebSocket Implementation
- node.js demo WebSocket Script
- PHP Installation Script
- Forked Implementation for SimpleMachine Forums
