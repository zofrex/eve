#!/usr/bin/env node

var url = require('url');
var http = require('http');
var colors = require('colors');

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
		log(options, request, serverResponse);
	});
	request.pipe(connector);
	request.resume();
});

function log(options, request, response) {
	var method = colorMethod(request.method);
	console.log('');
	console.log(method + ' ' + options.path);
	console.log('');
	console.log('Request headers:'.grey);
	logHeaders(request.headers);
	console.log('');
	console.log('Response headers:'.grey);
	logHeaders(response.headers);
}

function colorMethod(method) {
	switch(method) {
		case "GET":
			return method.green;
		case "POST":
			return method.yellow;
		case "PUT":
			return method.cyan;
		case "DELETE":
			return method.red;
	}
}

function logHeaders(headers) {
	for(var name in headers) {
		console.log(name + ': ' + headers[name]);
	}
}
