(function($, ns) {

	// Create controls
	ns.renderControls = function(o) {

		var obj = $(o);
		var id = obj.attr('id').split('-')[1];

		// Prepare Admin Object
		var admin = $('<span>');
		admin.addClass('admin');

		// Create & Append Controls
		var del = $("<span>");
		del.addClass('del');
		del.attr('id', 'del-' + id);
		var ban = $("<span>");
		ban.addClass('ban');
		ban.attr('id', 'ban-' + id);
		admin.append(del);
		admin.append(ban);

		// Append to container & return
		obj.append(admin);
		return admin;

	};

	// Hide controls on mouseout
	ns.hideControls = function(o) {

		// Hide controls for o
		var admin = $('.admin', o);
		admin.hide(200);

	};

	// Show controls on mouseover, render if not exists
	ns.showControls = function(o) {

		var admin = $('.admin', o);
		if (!admin.length) admin = this.renderControls(o);
		if (admin) admin.show(200);

	};

	// Ban user by message posted
	ns.banUser = function(o) {
		var obj = $(o);
		var id = obj.attr('id').split('-')[1];
		$.ajax({
			url: '/chat/ChatAPI.php',
			type: 'get',
			data: { 'action': 'ban', 'message_id': id }
		});
	};

	// Delete selected message
	ns.deleteMessage = function(o) {
		var obj = $(o);
		var id = obj.attr('id').split('-')[1];
		$.ajax({
			url: '/chat/ChatAPI.php',
			type: 'get',
			data: { 'action': 'delete', 'message_id': id },
			complete: function() {
				$(obj.parents('div')[0]).slideUp(200, function() { $(this).remove(); });
			}
		});
	};

	// Establishes the new listeners for administration
	ns.admin = function() {
		var that = this;

		// Events to show or hide controls
		this.messageDisplay.on('mouseenter', 'div', function() { that.showControls(this); });
		this.messageDisplay.on('mouseleave', 'div', function() { that.hideControls(this); });

		// Events to delete/ban click events
		this.messageDisplay.on('click', '.del', function() { that.deleteMessage(this); });
		this.messageDisplay.on('click', '.ban', function() { that.banUser(this); });

	};

	// Override jQuery Plugin Generation to append new operations
	$.fn.chatBox = function(options) {
		$.extend(true, this, ns, options);// Extend "this" granting it all ChatBox Methods
		this.init();
		this.admin();
		return this;
	};

})(jQuery, window.chatBox);