var static = require('node-static');
var director = require('director');
var http = require('http');
var _ = require('underscore')._;
var events = require('./events');

var files = new static.Server('./webui/');

var connections = [];

var routes = {
  "/requests": {
    get: requests
  }
};

var config = {
  notfound: serveStatic
};

var router = new director.http.Router(routes).configure(config);

var server = http.createServer(function(request, response){
  router.dispatch(request, response, function(error) {
    if(error) {
      response.writeHead(404);
      response.end();
    }
  });
});

function requests() {
  var response = this.res;
  this.req.socket.setTimeout(Infinity);
  response.writeHead(200, {"Content-Type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
  connections.push(response);

  this.req.on('close', function() {
    connections = _(connections).reject(function(conn) {
      return conn == response;
    });
  });
}

function serveStatic() {
  files.serve(this.req, this.res);
}

function broadcastSuccess(options, request, response, conn) {
  conn.write('event: success\n');
  conn.write('data: ' + JSON.stringify({url: request.url}) + '\n\n');
}

exports.listen = function(host, port) {
  server.listen(port, host);
}

exports.onSuccess = function(options, request, response) {
  _(connections).each(_.partial(broadcastSuccess, options, request, response));
}

exports.onFailure = function(options, request, e) {

}
