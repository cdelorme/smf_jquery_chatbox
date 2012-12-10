(function($) {
        var ns = {};
        ns.active = false;
        ns.lastMessage = 1;
        ns.messages = [];
        ns.options = { type: "short", maxMessages: 20, display: "down", idle: 36 };
        ns.timing = { poll: 5000, timeout: 50000 };
        ns.paths = {};
        ns.stampTime = function(timestamp) {
                var dt = new Date(timestamp * 1000);
                return dt.toLocaleString();
        };
        ns.removeOldRenderedMessages = function() {
                var total = this.messageDisplay.children();
                if (this.options.display == 'down') {
                        for (var x = 0, len = total.size() - this.options.maxMessages; x < len; x++) $(total[x]).slideUp(200, function() { $(this).remove(); });
                } else {
                        for (var x = total.size(); x > this.options.maxMessages; x--) $(total[x]).slideUp(200, function() { $(this).remove(); });
                }
        };
        ns.renderNewMessages = function(data) {
                var div = ""; var that = this;
                if (this.options.display == 'down') {
                        for (var x = data.length - 1; x >= 0; x--) div += "<div><span class='datestamp'>[" + this.stampTime(data[x].created_on) + "]</span><span class='username'>" + data[x].username + ":</span>" + data[x].message + "</div>";
                } else {
                        for (var x = 0, len = data.length; x < data.length; x++) div += "<div><span class='datestamp'>[" + this.stampTime(data[x].created_on) + "]</span><span class='username'>" + data[x].username + ":</span>" + data[x].message + "</div>";
                }
                div = $(div).hide();
                if (this.options.display == 'down') {
                        this.messageDisplay.append(div);
                } else {
                        this.messageDisplay.prepend(div);
                }
                div.slideDown(200, function() { that.scrollEvent(); });
        };
        ns.scrollEvent = function() {
                if (this.options.display == 'down') {
                        this.messageDisplay.animate({ scrollTop: this.messageDisplay.height() }, 0);
                } else {
                        this.messageDisplay.animate({ scrollTop: 0 }, 0);
                }
        };
        ns.removeOldMessages = function() {
                if (this.messages.length > this.options.maxMessages) this.messages.splice(this.options.maxMessages);
        };
        ns.orderById = function(a, b) {
                if (a.id < b.id) return 1;
                if (a.id > b.id) return -1;
                return 0;
        };
        ns.mergeMessages = function(data) {
                var a = (this.messages ? this.messages.slice(0) : []);
                b = data.slice(0);
                this.messages = b.concat(a);
                this.messages.sort(ns.orderById);
                this.renderNewMessages(data);
                this.removeOldRenderedMessages();
                this.removeOldMessages();
        };
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
        ns.message = function(e) {
                var data = JSON.parse(e.data);
                this.duplicationCheck(data);
        };
        ns.destructWebSocket = function() {
                if (this.webSocket) {
                        $(this.webSocket).off('error');
                        $(this.webSocket).off('message');
                        this.webSocket.close();
                        delete this.webSocket;
                }
        };
        ns.createWebSocket = function() {
                if (!this.webSocket) {
                        var that = this;
                        this.webSocket = new WebSocket(this.paths.webSocket);
                        $(this.webSocket).on('error', function(e) { that.destructWebSocket(); that.createWebSocket(); });
                        $(this.webSocket).on('message', function(data) { that.message(data); });
                }
        };
        ns.destructSSE = function() {
                if (this.sse) {
                        this.sse.close();
                        this.sse.removeEventListener('message');
                        this.sse.close();
                        delete this.sse;
                }
        };
        ns.createSSE = function() {
                if (!this.sse) {
                        var that = this; var ssePath = this.paths.ssePoll;
                        if (ssePath.indexOf("?") == -1) ssePath += "?";
                        ssePath += "maxMessages=" + this.options.maxMessages;
                        ssePath += "&last=" + this.lastMessage;
                        if (this.options.type == 'long') ssePath += "&type=long";
                        if (this.options.type == 'short') ssePath += "&retry=" + this.timing.poll;
                        this.sse = new EventSource(ssePath);
                        this.sse.addEventListener('message', function(data) { that.message(data) }, false);
                }
        };
        ns.poll = function(post) {
                if (this.active) {
                        if (this.paths.websocketPoll && window.WebSocket) {
                                if (!this.webSocket) this.createWebSocket();
                        } else if (this.paths.ssePoll && window.EventSource) {
                                if (!this.sse) this.createSSE();
                        } else if (this.paths.xhrPoll) {
                                var that = this;
                                if (this.options.type == 'short') {
                                        $.ajax({
                                                url: this.paths.xhrPoll, dataType: 'json', type: 'get', cache: false,
                                                data: { 'last': this.lastMessage, 'maxMessages': this.options.maxMessages },
                                                success: function(data) { that.duplicationCheck(data); },
                                                complete: function() { if (!post) setTimeout(function() { that.poll(); } , that.timing.poll); }
                                        });
                                } else if (this.options.type == 'long') {
                                        $.ajax({
                                                url: this.paths.xhrPoll, dataType: 'json', type: 'get', cache: false, timeout: this.timing.timeout,
                                                data: { 'last': this.lastMessage, 'maxMessages': this.options.maxMessages },
                                                success: function(data) { that.duplicationCheck(data); },
                                                complete: function() { if (!post) that.poll(); }
                                        });
                                }

                        }
                }
        };
        ns.post = function() {
                if (!this.active) this.start();
                if ($('input', this).val() != '') {
                        var message = this.serialize();
                        if (this.paths.webSocket && window.WebSocket) {
                                if (!this.webSocket) this.createWebSocket();
                                this.webSocket.send(message);
                        } else if (this.paths.xhrPost) {
                                var that = this;
                                $.ajax({ url: this.paths.xhrPost, data: message, type: 'post' }).complete(function() { that.poll(true) });
                        }
                        this.each(function() { this.reset(); });
                        $('input', this).first().focus();
                        this.idleCount = 0;
                }
        };
        ns.idle = function() {
                if (this.active) {
                        if (this.webSocket) this.destructWebSocket();
                        if (this.sse) this.destructSSE();
                        if (this.idleTimer) clearInterval(this.idleTimer);
                        this.active = false;
                }
        };
        ns.stop = function() {
                this.idle();
                this.off('submit');
                this.on('submit', function() { return false; });
        };
        ns.idleOut = function() {
                this.idleCount++;
                if (this.idleCount >= this.options.idle && this.options.idle != 0) this.idle();
        };
        ns.start = function() {
                if (!this.active) {
                        this.active = true;
                        var that = this;
                        if (this.options.type == 'long') {
                                this.idleCount = 0;
                                this.idleTimer = setInterval(function() { that.idleOut(); }, this.timing.poll);
                        }
                        this.poll();
                        this.off('submit');
                        this.on('submit', function() { that.post(); return false; });
                }
        };
        ns.init = function() {
                this.messageDisplay = $("<div></div>");
                if (this.options.display == "down") {
                        this.prepend(this.messageDisplay);
                } else {
                        this.append(this.messageDisplay);
                }
                this.start();
        };
        $.fn.chatBox = function(options) {
                $.extend(true, this, ns, options);
                this.init();
                return this;
        };
})(jQuery);