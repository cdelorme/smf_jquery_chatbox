(function($, ns) {
	ns.options.idle = 0;
	ns.ModelMessage.prototype.ban = function() {
		console.log("Banning User!");
		var self = this;
		$.ajax({
			url: '/chat/ChatAPI.php',
			type: 'get',
			data: { 'action': 'ban', 'message_id': this.id }
		}).complete(function() { self.locked = false; });
	};
	ns.ModelMessage.prototype.del = function() {
		console.log("Deleting Message!");
		var self = this;
		$.ajax({
			url: '/chat/ChatAPI.php',
			type: 'get',
			data: { 'action': 'delete', 'message_id': this.id }
		}).complete(function() { self.locked = false; self.delete(); });
	};
	ns.ModelMessage.prototype.renderAdmin = function() {
		var self = this;
		this.panelBan = $("<span>").addClass("ban");
		this.panelDel = $("<span>").addClass("del");
		this.panel = $("<span>").addClass("admin").append(this.panelBan).append(this.panelDel).hide();
		this.panelBan.on("click", function() { self.ban(); });
		this.panelDel.on("click", function() { self.del(); });
		this.html.append(this.panel);
	};
	ns.ModelMessage.prototype.hideAdmin = function() { if (this.panel && !this.locked) this.panel.stop().fadeOut(200); };
	ns.ModelMessage.prototype.showAdmin = function() {
		if (!this.panel) this.renderAdmin();
		if (this.panel) this.panel.stop().fadeIn(200);
	};
	ns.ModelMessage.prototype.admin = function() {
		var self = this;
		this.html.on("mouseenter", function() { self.showAdmin(); });
		this.html.on("mouseleave", function() { self.hideAdmin(); });
		this.html.on("click", function() {
			self.showAdmin();
			if (!self.locked) {
				self.locked = true;
			} else {
				self.locked = false;
			}
		});
	};
	ns.ModelMessage.prototype.setup = function() { this.render(); this.admin(); };
	ns.renderLinks = function() {
		return $("<p>").append($("<a>").attr("href", "/chat/history.php").append("History")).append($("<a>").attr("href", "/chat/chAdmin.php").append("Admin"));
	};
})(jQuery, window.chatBox);