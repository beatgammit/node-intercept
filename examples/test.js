var connect = require('connect'),
	intercept = require('../lib/intercept'),
	writeFns = [
		function (next, data, encoding) {
			console.log("I'm first.");
			next(data);
		},
		function (next, data) {
			console.log("I'm actually useful...");
			data += " World";
			console.log(data);
			next(data);
		},
		function (next, data) {
			console.log("I'm just happy to be here...");
			console.log(data);
			next(data);
		}
	],
	endFns = function (next, data, encoding) {
		console.log("Party's over...");
		next(data);
	};

connect.createServer(
	intercept({write: writeFns, end: endFns}),
	function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write("Hello");
		res.end();
	}
).listen(12345);
