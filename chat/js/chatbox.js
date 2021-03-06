(function($) {
	var ns = {};
	ns.active = true; ns.comm = true; ns.last = 0; ns.messages = []; ns.idle = (new Date()).getTime() / 1000; ns.scrolled = -1;
	ns.options = { type: "short", messages: 20, display: "down", idle: 180, timestamps: true, colors: true };
	ns.timing = { poll: 5000, timeout: 50000 };
	ns.paths = { xhr: "/chat/ChatAPI.php", sw: "/chat/js/chatbox.worker.js" };
	ns.timeStamp = function(timestamp) {
		function pad(value) { return (value.toString().length < 2) ? '0' + value : value; };
		var dt = new Date(timestamp * 1000), month = pad(dt.getMonth()+1), day = pad(dt.getDate()), year = pad(dt.getFullYear()), hours = dt.getHours(), minutes = pad(dt.getMinutes()), apm = "am";
		if (hours > 11) {
			hours -= 12;
			apm = "pm";
		} else if (hours == 0) {
			hours += 12;
		}
		return month + "/" + day + "/" + year + " " + hours + ":" + minutes + " " + apm;
	};
	ns.orderById = function(a, b) {
		if (Number(a.id) < Number(b.id)) return -1;
		if (Number(a.id) > Number(b.id)) return 1;
		return 0;
	};
	ns.ModelMessage = function(properties, parent) {
		for (var x in properties) this[x] = properties[x];
		this.owner = parent;
		this.setup();
	};
	ns.ModelMessage.prototype.setup = function() { this.render(); };
	ns.ModelMessage.prototype.render = function() {
		var user = $("<span>").addClass("cb_username").append(this.username + ":");
		if (this.user_color) user.css("color", this.user_color);
		var message = $("<span>").addClass("cb_message").append(this.message);
		if (this.owner.options.colors) message.css("color", this.color).css("background", this.background);
		var html = $("<p>");
		if (this.owner.options.timestamps) html.append($("<span>").addClass("cb_timestamp").append("[" + this.owner.timeStamp(this.created_on) + "]"));
		html.append(user);
		html.append(message);
		this.html = html;
	};
	ns.ModelMessage.prototype.delete = function() {
		var self = this;
		if (typeof this.html != "undefined") this.html.slideUp(200, function() { self.html.remove(); });
	};
	ns.scrollEvent = function() {
		var h = this.display.messages.height();
		var sh = this.display.messages.prop("scrollHeight");
		if (this.options.display == "down") {
			if (this.scrolled == -1) this.scrolled = sh;
			if (this.scrolled + h > sh - (h * .5)) {
				this.scrolled = this.display.messages.scrollTop(sh+h);
			}
		} else if (this.options.display == "up" && this.scrolled < h * .5) {
			this.scrolled = this.display.messages.scrollTop(0);
		}
	};
	ns.displayMessage = function(message) {
		message.html.hide();
		var self = this;
		var index = -1;
		$.each(this.messages, function(i) { if (this === message) index = (i - 1); });
		if (index > -1) {
			if (this.options.display == "down") {
				this.messages[index].html.after(message.html);
			} else {
				this.messages[index].html.before(message.html);
			}
		} else {
			if (this.options.display == "down") {
				this.display.messages.prepend(message.html);
			} else {
				this.display.messages.append(message.html);
			}
		}
		message.html.slideDown(350, function() { self.scrollEvent(); });
	};
	ns.deleteMessage = function() {
		if (this.messages.length > this.options.messages) {
			var old = this.messages.splice(0, this.messages.length - this.options.messages);
			for (var x in old) {
				old[x].delete();
				delete old[x];
			}
		}
	};
	ns.addMessage = function(message) {
		var tmp = this.messages[this.messages.length] = new this.ModelMessage(message, this);
		this.messages.sort(this.orderById);
		this.deleteMessage();
		this.last = this.messages[this.messages.length - 1].id;
		this.displayMessage(tmp);
	};
	ns.parseMessages = function(messages) {
		var self = this; var flag = true;
		$.each(messages, function() {
			for (var i in self.messages) {
				if (typeof this.id != "undefined" && self.messages[i].id == this.id) flag = false;
			}
			if (flag) self.addMessage(this);
			flag = true;
		});
	};
	ns.swError = function() { this.comm = true; delete this.paths.sw; this.begin(); };
	ns.wsError = function() { delete this.paths.ws; this.begin(); };
	ns.getSettings = function() {
		var self = this;
		$.ajax({ url: '/chat/ChatAPI.php?action=getSettings', type: 'get',
			success: function(data) {
				self.colors = {};
				if (typeof data.color != "undefined") self.colors.color = data.color;
				if (typeof data.background != "undefined") self.colors.background = data.background;
				self.options.timestamps = (typeof data.timestamps != "undefined" && data.timestamps == 1 ? true : false);
				self.options.colors = (typeof data.colors != "undefined" && data.colors == 1 ? true : false);
			} }).complete(function() { self.init(); });
	};
	ns.toggleColor = function() {
		if (this.options.colors) {
			this.options.colors = false;
		} else {
			this.options.colors = true;
		}
		$.ajax({
			url: '/chat/ChatAPI.php?action=toggleColors',
			type: 'get'
		});
	};
	ns.toggleTimestamps = function() {
		if (this.options.timestamps) {
			this.options.timestamps = false;
		} else {
			this.options.timestamps = true;
		}
		$.ajax({ url: '/chat/ChatAPI.php?action=toggleTimestamps', type: 'get' });
	};
	ns.post = function() {
		if (this.active && this.display.input && this.display.input.val() != "") {
			var self = this;
			this.idle = (new Date()).getTime() / 1000;
			if (this.ws) {} else {
				$.ajax({ url: this.paths.xhr + (this.paths.xhr.indexOf('?') != -1 ? '&' : '?') + 'action=post', data: self.serialize(), type: 'post', complete: function() { self.poll(); } });
			}
			this.display.input.val('');
			this.display.input.focus();
		}
	};
	ns.poll = function(repeat) {
		var self = this; var command = {}; command.url = this.paths.xhr; command.cache = false; command.dataType = "json"; command.type = "get";
		if (this.options.type == "long") command.timeout = this.timing.timout;
		command.data = { 'action': 'poll', 'last': this.last, 'maxMessages': this.options.messages, 'type': this.options.type };
		command.success = function(data) {
			if (typeof data.length != "undefined" &&  data.length > 0) self.parseMessages(data);
		};
		command.complete = function() {
			if (repeat) {
				if (self.options.type == "short") {
					window.setTimeout(function() {
						self.poll(repeat);
					}, self.timing.poll);
				} else {
					self.poll(repeat);
				}
			}
		};
		$.ajax(command);
	};
	ns.wsMessage = function(message) {};
	ns.swMessage = function(message) {};
	ns.changeColors = function() { $.ajax({ url: '/chat/ChatAPI.php?action=setColors', type: 'get', data: this.serialize() }); };
	ns.renderLinks = function() { return $("<p>").append($("<a>").attr("href", "/chat/history.php").append("History")); };
	ns.renderMessageBox = function() { return $(document.createElement('div')).addClass("messages"); };
	ns.renderPanel = function() {
		var controls = $(document.createElement('div')).addClass("cb_panel").hide();
		this.display.color = $("<input>").attr("type", "text").attr("name", "fcolor");
		this.display.background = $("<input>").attr("type", "text").attr("name", "bcolor");
		this.display.resetColors = $("<input>").attr("type", "button").attr("value", "Reset Colors");
		controls.append($("<p>").text("Text Color: ").append(this.display.color));
		controls.append($("<p>").text("Background: ").append(this.display.background));
		controls.append(this.display.resetColors);
		this.display.toggleTime = $("<p>").text("Timestamps").addClass((this.options.timestamps ? "on" : "off"));
		this.display.toggleColor = $("<p>").text("User Colors").addClass((this.options.colors ? "on" : "off"));
		controls.append(this.display.toggleTime);
		controls.append(this.display.toggleColor);
		controls.append(this.renderLinks());
		return controls;
	};
	ns.renderToggle = function() { return $("<span>").addClass("cb_gear"); };
	ns.renderInput = function() { return $("<input>").attr("type", "text").attr("name", "message"); };
	ns.renderControls = function() { return $("<p>").append($("<input>").attr("type", "submit").attr("value", ">")); };
	ns.assembleChatBox = function() {
		this.display.controls.prepend(this.display.input);
		this.display.controls.prepend(this.display.toggle);
		this.append(this.display.messages);
		this.append(this.display.panel);
		if (this.options.display == 'down') {
			this.append(this.display.controls);
		} else {
			this.prepend(this.display.controls);
		}
	};
	ns.handleDisplay = function() {
		var self = this;
		this.on('submit', function() { self.post(); return false; });
		this.display.messages.on("scroll", function() { self.scrolled = $(this).scrollTop(); });
		this.display.toggle.on("click", function() { self.display.panel.fadeToggle(400); });
		this.display.color.spectrum({
			color: (typeof self.colors.color != "undefined" ? self.colors.color : ''),
			preferredFormat: "hex",
			change: function(nc) {
		    	self.colors.color = nc.toHexString();
		    	self.changeColors();
			}
		});
		this.display.background.spectrum({
			color: (self.colors.background ? self.colors.background : ''),
		    preferredFormat: "hex",
		    change: function(nc) {
		    	self.colors.background = nc.toHexString();
		    	self.changeColors();
		    }
		});
		this.display.resetColors.on("click", function() {
			$.ajax({ url: '/chat/ChatAPI.php?action=resetColors', type: 'get' });
		});
		this.display.toggleTime.on("click", function() {
			self.toggleTimestamps();
			$(this).removeClass().addClass((self.options.timestamps ? "on" : "off"));
		});
		this.display.toggleColor.on("click", function() {
			self.toggleColor();
			$(this).removeClass().addClass((self.options.colors ? "on" : "off"));
		});
	};
	ns.renderChatBox = function() {
		this.display.messages = this.renderMessageBox();
		this.display.input = this.renderInput();
		this.display.controls = this.renderControls();
		this.display.toggle = this.renderToggle();
		this.display.panel = this.renderPanel();
	};
	ns.prepareChatBox = function() {
		this.display = {};
		this.renderChatBox();
		this.assembleChatBox();
		this.handleDisplay();
	}
	ns.idle = function() {
		var d = (new Date()).getTime() / 1000;
		if ((d - this.idle) <= this.options.idle && this.active) this.poll(true);
	};
	ns.stop = function() { this.active = false; };
	ns.start = function() {
		if (!this.active) this.active = true && this.begin();
	};
	ns.begin = function() {
		var self = this;
		if (typeof window.SharedWorker != "undefined" && typeof this.paths.sw != "undefined") {
			try {
				this.comm = false;
				this.sw = new SharedWorker(this.paths.sw);
				this.sw.addEventListener("error", function() { self.swError() }, false);
				this.sw.port.addEventListener("message", function(message) { self.swMessage(message); }, false);
				this.sw.port.start();
			} catch (e) {
				this.swError();
			}
		} else if (this.comm) {
			if (typeof window.WebSocket != "undefined" && typeof this.paths.ws != "undefined") {
				try {
					this.ws = new WebSocket(this.paths.ws);
					this.ws.addEventListener("error", function() { self.wsError(); }, false);
					this.ws.addEventListener("message", function(message) { self.wsMessage(message); }, false);
				} catch (e) {
					this.wsError();
				}
			} else {
				this.poll(true);
			}
		}
	};
	ns.init = function() {
		this.prepareChatBox();
		if (this.active) this.begin();
	};
	$.fn.chatBox = function(options) {
		$.extend(true, this, ns, options);
		this.getSettings();
		return this;
	};
	window.chatBox = window.chatBox || ns;
})(jQuery);