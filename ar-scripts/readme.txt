[center][color=green][size=18pt]SMF-ChatBox v1.0 - CDeLorme[/size][/color]
[color=green]Simplistic ChatBox front-end using modern transitions and all modern communication methods.[/color][/center]
[hr]
[center][url=http://www.cdelorme.com][b]Website[/b][/url][/center]
[center][url=https://bitbucket.org/CDeLorme/smf-chatbox][b]BitBucket Repository[/b][/url][/center]
[hr]

[b]Important Info[/b]:

This ChatBox requires jQuery, but to prevent duplicate copies it is not installed by the install script.  Please add jQuery to your themes from an API such as Google, or upload your own copy.

The ChatBox supports a variety of modern JavaScript communication objects and support tools, and will fall-back to basic AJAX if they are unsupported.  These tools include EventSource (SSE/Server-Sent Events), WebSockets, and SharedWorker.  It also works with basic AJAX both short and long polling.

Apache servers do not work well with long polling, and to take advantage of WebSockets you will want to install an event driven server such as node.js.  Example code has been included with the package, as well as some basic instructions.

The BitBucket source has comprehensive documentation on how to configure and manually adjust every component of the ChatBox.


[b]Features[/b]:
[list]
	[li][i][u]Users[/u][/i]
- User-selectable & Stored Colors
- AJAX Short & Long Polling
- EventSource (Server-Sent Events)
- WebSockets
- SharedWorker to eliminate load from multi-tabbed browsing
- Ability to Ban Users
- Ability to Delete (hide) Messages
- Page to manage Banned Users (un-ban)
[/list]

[b]Compatibility[/b]:
- 2.0.2
