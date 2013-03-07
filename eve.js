#!/usr/bin/env node

var url = require('url');
var http = require('http');
var acceptor = http.createServer().listen(8888);

acceptor.on('request', function(request, response) {
	request.pause();
	var options = url.parse(request.url);
	options.headers = request.headers;
	options.method = request.method;
	options.agent = false;

	var connector = http.request(options, function(serverResponse) {
		serverResponse.pause();
		response.writeHeader(serverResponse.statusCode, serverResponse.headers);
		serverResponse.pipe(response);
		serverResponse.resume();
		console.log(request.method + ' ' + request.url);
		console.log('Request:');
		inspect(request.headers);
		console.log('Response:');
		inspect(serverResponse.headers);
	});
	request.pipe(connector);
	request.resume();
});

function inspect(thing) {
	console.log(JSON.stringify(thing, null, 2));
}
