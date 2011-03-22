(function () {
	"use strict";

	require('futures/forEachAsync');

	module.exports = function (options) {
		var http = require('http'),
			write = http.ServerResponse.prototype.write,
			end = http.ServerResponse.prototype.end;

		function newWrite(data, encoding) {
			var that = this, tData = data;

			if (options && options.write) {
				if (typeof options.write === 'function') {
					options.write.call(that, function (chunk) {
						if (chunk) {
							tData = chunk;
						}
						write.call(that, tData, encoding);
					}, tData, encoding);
				} else {
					options.write.forEachAsync(function (next, fn) {
						fn.call(that, function (chunk) {
							if (chunk) {
								tData = chunk;
							}
							next();
						}, tData, encoding);
					}).then(function () {
						write.call(that, tData, encoding);
					});
				}
			} else {
				write.call(that, tData, encoding);
			}
		}

		function newEnd(data, encoding) {
			var that = this, tData = data;

			if (options && options.end) {
				if (typeof options.end === 'function') {
					options.end.call(that, function (chunk) {
						if (chunk) {
							tData = chunk;
						}
						end.call(that, tData, encoding);
					}, tData, encoding);
				} else {
					options.end.forEachAsync(function (next, fn) {
						fn.call(that, function (chunk) {
							if (chunk) {
								tData = chunk;
							}
							next();
						}, tData, encoding);
					}).then(function () {
						end.call(that, tData, encoding);
					});
				}
			} else {
				end.call(that, tData, encoding);
			}
		}

		http.ServerResponse.prototype.write = newWrite;
		http.ServerResponse.prototype.end = newEnd;

		return function (req, res, next) {
			// this doesn't actually DO anything on each request...
			next();
		};
	};
}());
