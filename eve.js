var url = require('url');
var http = require('http');
var _ = require('underscore');

var cli = require('./cli');
var events = require('./events');

var optimist = require('optimist');

optimist = optimist
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

events.addListener(cli);

var acceptor = http.createServer().listen(argv.port);

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
    events.success(options, request, serverResponse);
  });

  connector.on('error', function(e) {
    response.end();
    connector.end();
    events.failure(options, request, e);
  });

  request.pipe(connector);
  request.resume();
});
