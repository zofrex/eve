var colors = require('colors');
var _ = require('underscore');

var width = 0;

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
