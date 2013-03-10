var colors = require('colors');
var _ = require('underscore');
var optimist = require('optimist');

var width = 0;

exports.argv = function() {
  var _optimist = optimist
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

  var argv = _optimist.argv;

  if(!argv['proxy-mode']) {
    argv = _optimist.demand('target-host').argv;
  }

  return argv;
}

exports.onSuccess = function(options, request, response) {
  logMethod(request, options);
  logHeaders('Request headers', request);
  logHeaders('Response headers', response);
}

exports.onFailure = function(options, request, e) {
  logMethod(request, options);
  logHeaders('Request headers', request);
  console.log('Problem with request:'.red + e.message.red);
  console.log(e);
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
    console.log(pad(name, width) + ' ' + (value ? value.grey : ''));
  });
}

function pad(s, length) {
  var result = s;
  for(var i = s.length; i < length; i++) {
    result = result + ' ';
  }
  return result;
}
