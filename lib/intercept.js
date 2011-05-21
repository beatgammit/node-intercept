(function () {
	"use strict";

	var forEachAsync = require('futures').forEachAsync;

	module.exports = function (options) {
		var http = require('http'),
			write = http.ServerResponse.prototype.write,
			end = http.ServerResponse.prototype.end;

		function newWrite(data, tEncoding, callback) {
			var that = this, tData = data, encoding;

			encoding = tEncoding || 'utf8';

			function finish(){
				if(callback && typeof callback === 'function'){
					callback();
				}
			}

			if (options && options.write) {
				if (typeof options.write === 'function') {
					options.write.call(that, function (chunk, newEncoding) {
						encoding = newEncoding || encoding;

						if (chunk) {
							tData = chunk;
						}
						write.call(that, tData, encoding);

						finish();
					}, tData, encoding);
				} else {
					forEachAsync(options.write, function (next, fn) {
						fn.call(that, function (chunk, newEncoding) {
							encoding = newEncoding || encoding;

							if (chunk) {
								tData = chunk;
							}
							next();
						}, tData, encoding);
					}).then(function () {
						write.call(that, tData, encoding);

						finish();
					});
				}
			} else {
				write.call(that, tData, encoding);

				finish();
			}
		}

		function newEnd(data, tEncoding, callback) {
			var that = this, tData = data, encoding;

			// try to preserve or guess their encoding
			if(tEncoding){
				encoding = tEncoding;
			} else if(data) {
				encoding = (typeof data == 'string') ? 'utf8' : 'binary';
			}

			function finish(){
				if(callback && typeof callback === 'function'){
					callback();
				}
			}

			if (options && options.end) {
				if (typeof options.end === 'function') {
					options.end.call(that, function (chunk, newEncoding) {
						encoding = newEncoding || encoding;

						if (chunk) {
							tData = chunk;
						}
						end.call(that, tData, encoding);

						finish();
					}, tData, encoding);
				} else {
					forEachAsync(options.end, function (next, fn) {
						fn.call(that, function (chunk, newEncoding) {
							encoding = newEncoding || encoding;

							if (chunk) {
								tData = chunk;
							}
							next();
						}, tData, encoding);
					}).then(function () {
						end.call(that, tData, encoding);

						finish();
					});
				}
			} else {
				end.call(that, tData, encoding);

				finish();
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
