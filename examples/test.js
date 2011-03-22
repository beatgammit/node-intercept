var connect = require('connect'),
	intercept = require('../lib/intercept'),
	writeFns = [
		function (next, data, encoding) {
			console.log("I'm first");
			next();
		},
		function (next, data) {
			console.log("I'm actually useful...");
			console.log(data);
			next();
		},
		function (next, data) {
			console.log("I'm just happy to be here...");
			next();
		}
	],
	endFns = function (data, encoding) {
		console.log("Party's over...");
	};

connect.createServer(
	intercept({write: writeFns, end: endFns}),
	function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write("Hello");
		res.end();
	}
).listen(12345);
