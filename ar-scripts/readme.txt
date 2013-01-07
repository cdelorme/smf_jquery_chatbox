[center][color=green][size=18pt]SMF-ChatBox v1.0 - CDeLorme[/size][/color]
[color=green]Simple ChatBox front-end using modern transitions and communication methods.[/color][/center]
[hr]
[center][url=http://www.cdelorme.com][b]Website[/b][/url][/center]
[center][url=https://bitbucket.org/CDeLorme/smf-chatbox][b]BitBucket Repository[/b][/url][/center]
[hr]


[b]Instructions[/b]:

If the installation fails to modify your index.template.php file, you can manually add the chatbox to the location of your choosing by copying this block of code:

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


[b]Important Info[/b]:

This ChatBox required jQuery but to prevent duplicate copies of jQuery from being installed (which can potentially break a site) it is expected that you will add this yourself.  This script has been tested with jQuery versions as old as 1.6, but it would be advisable to use the Google API or upload a newer version.

The ChatBox is a jQuery Plugin, which makes it easy to create instances and modify or extend.  The administrative script should give you a good idea as to the possibilities.

Currently the chatbox supports short and long AJAX polling.

Apache servers are known to have problems with long polling, so be sure to test your configuration before pushing live if you intend to try Long Polling.

For more comprehensive documentation please check out the BitBucket source, or you may open the markdown README included with this package.


[b]Future Revisions[/b]

Currently working to update the script so it supports SharedWorkers.  This addition would eliminate the load on supported browsers for users who keep multiple open tabs by sharing a single polling process.

The system has the code in place for WebSockets, but this is an untested feature.

WebSockets are best used with an event driven server, such as node.js.  In the future a revision will be released with a functional node.js script for demonstration and implementation.


[b]Features[/b]:
[list]
	[li]User-selectable & Stored Colors[/li]
	[li]AJAX Short & Long Polling
	[li]Ability to Ban Users[/li]
	[li]Ability to Delete (hide) Messages[/li]
	[li]Page to manage Banned Users (un-ban)[/li]
[/list]

[b]Compatibility[/b]:
- 2.0.3
- 2.0.2
