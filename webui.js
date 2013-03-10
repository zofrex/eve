var static = require('node-static');
var director = require('director');
var http = require('http');

var files = new static.Server('./webui/');

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
  console.log("Requests");
  this.res.writeHead(200, { 'Content-Type': 'text/plain' })
  this.res.end('hello world');
}

function serveStatic() {
  files.serve(this.req, this.res);
}

exports.listen = function(host, port) {
  server.listen(port, host);
}
