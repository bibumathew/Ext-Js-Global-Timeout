// ==UserScript==
// @name         global timeout
// @namespace    http://tampermonkey.net/
// @run-at document-start
// @version      0.1
// @description  try to take over the world!
// @author       bibu mathew
// @match        https://*
// ==/UserScript==


(function (open) {

    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
        var globalAjaxtimeout = 30000 * 60;

        Ext.Ajax.timeout = globalAjaxtimeout;
        Ext.lib.Ajax.handleReadyState = function (F, G) {
            var E = this;
            if (G) {
                G.timeout = globalAjaxtimeout;
            }

            if (G && G.timeout) {
                this.timeout[F.tId] = window.setTimeout(function () {
                    E.abort(F, G, true);
                }, G.timeout);
            }
            this.poll[F.tId] = window.setInterval(function () {
                if (F.conn && F.conn.readyState == 4) {
                    window.clearInterval(E.poll[F.tId]);
                    delete E.poll[F.tId];
                    if (G && G.timeout) {
                        window.clearTimeout(E.timeout[F.tId]);
                        delete E.timeout[F.tId];
                    }
                    E.handleTransactionResponse(F, G);
                }
            }, this.pollInterval);
        };

        open.call(this, method, url, async, user, pass);
    };
})(XMLHttpRequest.prototype.open);

