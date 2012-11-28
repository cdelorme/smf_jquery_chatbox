(function($) {
	var ns = {};
	ns.type = "short";
	ns.animate = true;
	ns.maxMessages = 10;
	ns.pollTime = 5000;
	ns.longTimeout = 50000;
	ns.last = 1;
	ns.messages = [];
	ns.removeOldMessages = function() {
		if (ns.messages.length > ns.maxMessages) ns.messages.splice(ns.maxMessages);
	};
	ns.removeOldRenderedMessages = function() {
		var total = $(ns.messageBoxName + ">div");
		for (var x = 0, len = total.length - ns.maxMessages; x < len; x++) $(total[x]).slideUp((ns.animate ? 200 : 0), function() { $(this).remove(); });
	}
	ns.stampTime = function(timestamp) {
		var dt = new Date(timestamp * 1000);
		return dt.toLocaleString();
	};
	ns.renderNewMessages = function(data) {
		var div = "";
		for (var x = data.length - 1; x >= 0; x--) div += "<div><span class='datestamp'>[" + ns.stampTime(data[x].created_on) + "]</span><span class='username'>" + data[x].username + ":</span>" + data[x].message + "</div>";
		div = $(div).hide();
		ns.messageBox.append(div);
		div.slideDown((ns.animate ? 200 : 0));
	};
	ns.orderById = function(a, b) {
		if (a.id < b.id) return 1;
		if (a.id > b.id) return -1;
		return 0;
	}
	ns.mergeMessages = function(data) {
		var a = (ns.messages ? ns.messages.slice(0) : []);
		b = data.slice(0);
		ns.messages = b.concat(a);
		ns.messages.sort(ns.orderById);
		ns.renderNewMessages(data);
		ns.removeOldRenderedMessages();
		ns.removeOldMessages();
	}
	ns.duplicationCheck = function(data) {
		if (data) {
			for (var x = 0, len = data.length; x < len; x++) {
				for (var y = 0, len2 = ns.messages.length; y < len2; y++) {
					if (data[x] && data[x].id == ns.messages[y].id) {
						data.splice(x, 1);
						len--;
					}
				}
			}
			if (data[0]) ns.last = data[0].created_on;
			ns.mergeMessages(data);
		}
	}
	ns.listen = function() {
		ns.longpoll = $.ajax({
			url: ns.subscribeURL,
			dataType: 'json',
			type: 'get',
			cache: false,
			timeout: ns.longTimeout,
			data: { 'last': ns.last, 'maxMessages': ns.maxMessages },
			success: ns.duplicationCheck,
			complete: function() { ns.listen(); }
		});
	};
	ns.poll = function() {
		$.ajax({
			url: ns.pollURL,
			dataType: 'json',
			type: 'get',
			cache: false,
			timeout: ns.pollTime - (ns.pollTime * .1),
			data: { 'last': ns.last, 'maxMessages': ns.maxMessages },
			success: ns.duplicationCheck
		});
	};
	ns.post = function() {
        message = $(ns.messageInput);
        if (message.val() != '') $.ajax({ url: ns.publishURL, data: { 'message': message.val() }, type: 'post' }).complete(function() { ns.poll(); });
        message.val('');
        message.focus();
		return false;
	};
	ns.stop = function() {
		if (ns.longpoll) ns.longpoll.complete = null;
		if (ns.interval) window.clearInterval(ns.interval);
	}
	ns.start = function() {
		if (ns.type == "long") {
			ns.listen();
		} else if (ns.type == "short") {
			ns.poll();
			ns.interval = setInterval(ns.poll, ns.pollTime);
		}
	}
	ns.init = function(options) {
		for (var attr in options) ns[attr] = options[attr];
		ns.messageBox = $(ns.messageBoxName);
		ns.form = $(ns.formName);
		ns.form.submit(ns.post);
		ns.start();
	};
	$.fn.chatBox = function(options) {
		if (options && options.method) {
			if (options.method == "stop") ns.stop();
		} else {
			ns.init(options);
		}
		return this;
	};
})(jQuery);