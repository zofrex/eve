var url = require('url');
var http = require('http');
var colors = require('colors');
var _ = require('underscore');

var optimist = require('optimist');

optimist
	.usage('Supply either --proxy-mode or --target-host')
	
	.boolean('proxy-mode')
	.describe('proxy-mode', 'Operate as an HTTP proxy')
	
	.default('port', 8888)
	.describe('port', 'Port to listen on')
	.alias('p', 'port')

  .default('host', '0.0.0.0')
	.describe('host', 'Address to listen on (0.0.0.0 if ommitted)')
	.alias('h', 'host')

	.string('target-host')
	.describe('target-host', 'Host to forward requests to')
	.alias('t', 'target-host')
;

var argv = optimist.argv;

if(!argv['proxy-mode']) {
	argv = optimist.demand('target-host').argv;
}

var acceptor = http.createServer().listen(argv.port);
var width = 0;

acceptor.on('request', function(request, response) {
	request.pause();
	var options;
	if(!argv['proxy-mode']) {
		var path = url.parse(request.url).path;
		options = url.parse(argv['target-host'] + path);
	}
	else {
		options = url.parse(request.url);
	}
	options.headers = request.headers;
	options.headers.host = options.hostname;
	options.method = request.method;
	options.agent = false;

	var connector = http.request(options, function(serverResponse) {
		serverResponse.pause();
		response.writeHeader(serverResponse.statusCode, serverResponse.headers);
		serverResponse.pipe(response);
		serverResponse.resume();
		log(options, request, serverResponse);
	});

	connector.on('error', function(e) {
		logMethod(request, options);
		logHeaders('Request headers', request);
		console.log('Problem with request:'.red + e.message.red);
		console.log(e);
		response.end();
		connector.end();
	});

	request.pipe(connector);
	request.resume();
});

function log(options, request, response) {
	logMethod(request, options);
	logHeaders('Request headers', request);
	logHeaders('Response headers', response);
}

function logMethod(request, options) {
	var method = colorMethod(request.method);
	console.log('');
	console.log(method + ' ' + options.path);
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

function logHeaders(title, requestOrResponse) {
	console.log('');
	console.log(title.cyan);
	width = Math.max(width, _.reduce(requestOrResponse.headers, function(memo, value, name) {
		return Math.max(memo, name.length);
	}, 0));
	_.each(requestOrResponse.headers, function(value, name) {
		console.log(pad(name, width) + ' ' + value.grey);
	});
}

function pad(s, length) {
	var result = s;
	for(var i = s.length; i < length; i++) {
		result = result + ' ';
	}
	return result;
}
