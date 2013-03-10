var http = require('http');
var url = require('url');

var events = require('./events');

exports.Server = function Server(port, proxy_mode, target_host) {
  this.acceptor = http.createServer().listen(port);

  this.acceptor.on('request', function(request, response) {
    request.pause();
    var options;
    if(!proxy_mode) {
      var path = url.parse(request.url).path;
      options = url.parse(target_host + path);
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
}
