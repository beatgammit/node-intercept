(function () {
	"use strict";

	require('futures/forEachAsync');

	module.exports = function (options) {
		var http = require('http'),
			write = http.ServerResponse.prototype.write,
			end = http.ServerResponse.prototype.end;

		function _write (data, encoding) {
			var that = this;

			if(options && options.write && options.write.length){
				options.write.forEachAsync(function (next, fn) {
					fn.call(that, next, data, encoding);
				});
			}

			write.call(this, data, encoding);
		}

		function _end (data, encoding) {
			var that = this;

			if(options && options.end && options.end.length){
				options.end.forEachAsync(function (next, fn) {
					fn.call(that, next, data, encoding);
				});
			}

			end.call(this, data);
		}

		http.ServerResponse.prototype.write = _write;
		http.ServerResponse.prototype.end = _end;

		return function (req, res, next) {
			// this doesn't actually DO anything on each request...
			next();
		};
	};
}());
