(function($) {


	/* Define Name-space */

	var ns = {};


	/* Default Properties */

	// Temporarily Global Stored Information
	ns.active = false;
	ns.lastMessage = 1;
	ns.messages = [];

	// Default Options
	ns.options = {
		type: "short",
		maxMessages: 20,
		display: "down",
		idle: 36
	};

	// Default Polling Timing
	ns.timing = {
		poll: 5000,
		timeout: 50000
	};

	// Paths
	ns.paths = {};


	/* Default Render Methods */

	// Timestamp Converter
	ns.stampTime = function(timestamp) {
		var dt = new Date(timestamp * 1000);
		return dt.toLocaleString();
	};

	// Remove old Renders
	ns.removeOldRenderedMessages = function() {
		var total = this.messageDisplay.children();
		if (this.options.display == 'down') {
			for (var x = 0, len = total.size() - this.options.maxMessages; x < len; x++) $(total[x]).slideUp(200, function() { $(this).remove(); });
		} else {
			for (var x = total.size(); x > this.options.maxMessages; x--) $(total[x]).slideUp(200, function() { $(this).remove(); });
		}
		this.scrollEvent();
	};

	// Render Message
	ns.renderMessage = function(data) {
		var ts = $('<span>').append("[" +this.stampTime(data.created_on) + "]").addClass('datestamp');
		var u = $('<span>').append(data.username).addClass('username');
		if (data.user_color) u.css('color', data.user_color);
		var div = $('<div>').append(ts).append(u).append(data.message).attr('id', 'messageid-' + data.id);
		if (data.background) div.css('background', data.background);
		if (data.color) div.css('color', data.color);
		return div;
	}

	// Render New Messages
	ns.renderNewMessages = function(data) {
		var divs = [];
		for (var x = 0, len = data.length; x < len; x++) divs[divs.length] = this.renderMessage(data[x]).hide();
		if (this.options.display == 'down') {
			for (var x = divs.length - 1; x >= 0; x--) divs[x].appendTo(this.messageDisplay).slideDown(200);
		} else {
			for (var x = 0, len = divs.length; x < data.length; x++) divs[x].prependTo(this.messageDisplay).slideDown(200);
		}
	};

	// Scroll to top or bottom of chatbox
	ns.scrollEvent = function() {
		if (this.options.display == 'down') {
			this.messageDisplay.scrollTop(this.messageDisplay.prop('scrollHeight'));
		} else {
			this.messageDisplay.scrollTop(0);
		}
	};


	/* Data Management Methods */

	// Delete Old Messages
	ns.removeOldMessages = function() {
		if (this.messages.length > this.options.maxMessages) this.messages.splice(this.options.maxMessages);
	};

	// Sorting Method
	ns.orderById = function(a, b) {
		if (a.id < b.id) return 1;
		if (a.id > b.id) return -1;
		return 0;
	};

	// Merge new with old messages & re-sort
	ns.mergeMessages = function(data) {
		var a = (this.messages ? this.messages.slice(0) : []);
		b = data.slice(0);
		this.messages = b.concat(a);
		this.messages.sort(ns.orderById);
		this.renderNewMessages(data);
		this.removeOldRenderedMessages();
		this.removeOldMessages();
	};

	// Check for duplicates
	ns.duplicationCheck = function(data) {
		if (data) {
			for (var x = 0, len = data.length; x < len; x++) {
				for (var y = 0, len2 = this.messages.length; y < len2; y++) {
					if (data[x] && data[x].id == this.messages[y].id) {
						data.splice(x, 1);
						len--;
					}
				}
			}
			if (data[0]) this.lastMessage = data[0].created_on;
			this.mergeMessages(data);
		}
	};

	// Handle received message
	ns.message = function(e) {
		var data = JSON.parse(e.data);
		this.duplicationCheck(data);
	};


	/* Setup & Teardown Methods */

	// Tear Down WebSocket after removing event listeners
	ns.destructWebSocket = function() {
		if (this.webSocket) {
			$(this.webSocket).off('error');
			$(this.webSocket).off('message');
			this.webSocket.close();
			delete this.webSocket;
		}
	};

	// Create WebSocket Instance & Assign Events
	ns.createWebSocket = function() {
		if (!this.webSocket) {
			var that = this;
			this.webSocket = new WebSocket(this.paths.webSocket);
			$(this.webSocket).on('error', function(e) { that.destructWebSocket(); that.createWebSocket(); });
			$(this.webSocket).on('message', function(data) { that.message(data); });
		}
	};

	// Poll server for new messages, or prepare poll utility
	ns.poll = function(post) {
		if (this.active) {
			if (this.paths.websocketPoll && window.WebSocket) {// WebSocket Check
				if (!this.webSocket) this.createWebSocket();
			} else if (this.paths.xhr) {// xhr Check
				var that = this;
				if (this.options.type == 'short') {
					$.ajax({
						url: this.paths.xhr,
						dataType: 'json',
						type: 'get',
						cache: false,
						data: { 'action': 'poll', 'last': this.lastMessage, 'maxMessages': this.options.maxMessages, 'type': this.options.type },
						success: function(data) { that.duplicationCheck(data); },
						complete: function() { if (!post) setTimeout(function() { that.poll(); } , that.timing.poll); }
					});
				} else if (this.options.type == 'long') {
					$.ajax({
						url: this.paths.xhr,
						dataType: 'json',
						type: 'get',
						cache: false,
						timeout: this.timing.timeout,
						data: { 'action': 'poll', 'last': this.lastMessage, 'maxMessages': this.options.maxMessages, 'type': this.options.type },
						success: function(data) { that.duplicationCheck(data); },
						complete: function() { if (!post) that.poll(); }
					});
				}

			}
		}
	};

	// Run post operation
	ns.post = function() {

		// Re-active if idled
		if (!this.active) this.start();

		// If Not Empty
		if ($('input', this).val() != '') {

			// Grab form data
			var message = this.serialize();

			// If websockets exist use them
			if (this.paths.webSocket && window.WebSocket) {

				// Attempt to create WebSocket if not yet set
				if (!this.webSocket) this.createWebSocket();

				// Send message to WebSocket (NEED TO DEBUG THIS STILL)
				this.webSocket.send(message);

			} else if (this.paths.xhr) {

				// Run AJAX Post
				var that = this;
				$.ajax({
					url: (this.paths.xhr.indexOf('?') != -1 ? this.paths.xhr : this.paths.xhr + '?') + 'action=post',
					data: message,
					type: 'post'
				}).complete(function() { that.poll(true) });

			}

			// Reset Form & Set Focus
			this.each(function() { this.reset(); });
			$('input', this).first().focus();

			// Reset Idle Counter
			this.idleCount = 0;

		}

	};

	// Idle after count builds
	ns.idle = function() {// Stop Refresh Actions
		if (this.active) {
			if (this.webSocket) this.destructWebSocket();
			if (this.idleTimer) clearInterval(this.idleTimer);
			this.active = false;
		}
	};

	// Allow Stopping (Full stop, prevents submit from re-activating)
	ns.stop = function() {// Remove Handler
		this.idle();
		this.off('submit');
		this.on('submit', function() { return false; });
	};

	// Idle Event Check
	ns.idleOut = function() {
		this.idleCount++;
		if (this.options.idle != 0 && this.idleCount >= this.options.idle) this.idle();
	};

	// Allow Restarting (after stop())
	ns.start = function() {
		if (!this.active) {
			this.active = true;
			var that = this;
			this.idleCount = 0;
			this.idleTimer = setInterval(function() { that.idleOut(); }, this.timing.poll);
			this.poll();
			this.off('submit');
			this.on('submit', function() { that.post(); return false; });
		}
	};


	/* Display Generation Methods */

	// Primary Generator, calls all methods in sequence
	ns.generateDisplay = function() {
		this.generateControlContainer();
		this.generateFormControls();
		this.generateMessageDisplay();
		this.generateColorSelectors();
		this.generateLinks();
	};

	// Generate the container used to house Form Controls
	ns.generateControlContainer = function() {
		this.controls = $('<p>');
		this.append(this.controls);
	};

	// Link for History
	ns.generateLinks = function() {
		this.append('<p><a href="/chat/history.php">History</a></p>');
	}

	// Prepates the input textbox and submit button
	ns.generateFormControls = function() {
		this.controls.append($('<input type="text" name="message" /><input type="submit" value=">"/>'));
	};

	ns.generateMessageDisplay = function() {
		this.messageDisplay = $("<div></div>");
		if (this.options.display == "down") {
			this.prepend(this.messageDisplay);
		} else {
			this.append(this.messageDisplay);
		}
	};

	// Generate color controls
	ns.generateColorSelectors = function() {
		var that = this;
		$.ajax({
			url: '/chat/ChatAPI.php?action=getColors',
			type: 'get',
			success: function(data) {

				// Store Colors
				that.colors = {};
				if (data && data.color) that.colors.color = data.color;
				if (data && data.background) that.colors.background = data.background;

			},
			complete:function() {

				// Generate Spectrum Color Setters & Append to form controls
				var color = $('<input type="text" name="fcolor">');
				var background = $('<input type="text" name="bcolor">');
				var reset = $('<input type="button" value="Reset Colors">');
				that.controls.append(color);
				that.controls.append(background);
				that.controls.append(reset);
				color.spectrum({
					color: (that.colors.color ? that.colors.color : ''),
				    preferredFormat: "hex",
				    change:function(nc) {
				    	that.colors.color = nc.toHexString();
				    	that.changeColors();
				    }
				});
				background.spectrum({
					color: (that.colors.background ? that.colors.background : ''),
				    preferredFormat: "hex",
				    change: function(nc) {
				    	that.colors.background = nc.toHexString();
				    	that.changeColors();
				    }
				});
				reset.on('click', function() {
					// Set both color codes to nothing & send Reset Colors AJAX call
					$.ajax({
						url: '/chat/ChatAPI.php?action=clearColors',
						type: 'get'
					});
				});

			}
		});
	};

	// Sends setColors via AJAX to Chat API
	ns.changeColors = function() {
		// Run AJAX to setColors
		$.ajax({
			url: '/chat/ChatAPI.php?action=setColors',
			type: 'get',
			data: this.serialize()
		});
	};


	// Initialize boots up
	ns.init = function() {
		this.generateDisplay();
		this.start();
	};

	// Create as jQuery Plugin
	$.fn.chatBox = function(options) {
		$.extend(true, this, ns, options);// Extend "this" granting it all ChatBox Methods
		this.init();
		return this;
	};

	// Make CB accessible in Global Namespace
	window.chatBox = window.chatBox || ns;

})(jQuery);