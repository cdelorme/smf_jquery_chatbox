(function($, ns) {


	/*----------------- Properties ----------------*/

	// Administrators never idle out
	ns.options.idle = 0;


	/*----------------- Message Object ----------------*/

	// Ban the user who posted this message
	ns.ModelMessage.prototype.ban = function() {
		console.log("Banning User!");
		var self = this;
		$.ajax({
			url: '/chat/ChatAPI.php',
			type: 'get',
			data: { 'action': 'ban', 'message_id': this.id }
		}).complete(function() { self.locked = false; });
	};

	// Delete targeted message
	ns.ModelMessage.prototype.del = function() {
		console.log("Deleting Message!");
		var self = this;
		$.ajax({
			url: '/chat/ChatAPI.php',
			type: 'get',
			data: { 'action': 'delete', 'message_id': this.id }
		}).complete(function() { self.locked = false; self.delete(); });
	};

	// Render the administrative components
	ns.ModelMessage.prototype.renderAdmin = function() {
		var self = this;
		this.panelBan = $("<span>").addClass("ban");
		this.panelDel = $("<span>").addClass("del");
		this.panel = $("<span>").addClass("admin").append(this.panelBan).append(this.panelDel).hide();
		this.panelBan.on("click", function() { self.ban(); });
		this.panelDel.on("click", function() { self.del(); });
		this.html.append(this.panel);
	};

	// Hide controls
	ns.ModelMessage.prototype.hideAdmin = function() {
		if (this.panel && !this.locked) this.panel.stop().fadeOut(200);
	};

	// Show Controls, render if required
	ns.ModelMessage.prototype.showAdmin = function() {
		if (!this.panel) this.renderAdmin();
		if (this.panel) this.panel.stop().fadeIn(200);
	};

	// Setup Events for Administrative Controls
	ns.ModelMessage.prototype.admin = function() {
		var self = this;

		// Toggle Event Listeners
		this.html.on("mouseenter", function() {
			self.showAdmin();
		});
		this.html.on("mouseleave", function() {
			self.hideAdmin();
		});
		this.html.on("click", function() {
			self.showAdmin();
			if (!self.locked) {
				self.locked = true;
			} else {
				self.locked = false;
			}
		});

	};

	// Override with admin method
	ns.ModelMessage.prototype.setup = function() {
		this.render();
		this.admin();
	};


	/*---------- Render ChatBox Components -----------*/

	// Render link to admin page
	ns.renderLinks = function() {
		return $("<p>").append($("<a>").attr("href", "/chat/history.php").append("History")).append($("<a>").attr("href", "/chat/chAdmin.php").append("Admin"));
	};


})(jQuery, window.chatBox);