var connect = require('connect'),
	intercept = require('../lib/intercept'),
	port = 12345,
	writeFns = [
		function (next, data, encoding) {
			console.log("I'm first.");
			next(data);
		},
		function (next, data) {
			console.log("I'm actually useful... here's your updated data:");
			data += " World";
			console.log(data);
			next(data);
		},
		function (next, data) {
			console.log("I'm just happy to be here...");
			next(data);
		}
	],
	endFns = function (next, data, encoding) {
		console.log("Party's over..., here's the data you sent:");
		next(data);
	};

connect.createServer(
	intercept({write: writeFns, end: endFns}),
	function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write("Hello");
		res.end("Sup");
	}
).listen(port, function () {
	console.log("Server started on port", port);
});
