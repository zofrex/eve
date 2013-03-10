var colors = require('colors');
var _ = require('underscore');

var width = 0;

function log(options, request, response) {
  logMethod(request, options);
  logHeaders('Request headers', request);
  logHeaders('Response headers', response);
}

exports.log = log;

function logMethod(request, options) {
  var method = colorMethod(request.method);
  console.log('');
  console.log(method + ' ' + options.path);
}

exports.logMethod = logMethod;

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

exports.logHeaders = logHeaders;

function pad(s, length) {
  var result = s;
  for(var i = s.length; i < length; i++) {
    result = result + ' ';
  }
  return result;
}
