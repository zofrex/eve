var events = require('events');

var emitter = new events.EventEmitter();

exports.addListener = function(obj) {
  emitter.on('success', obj.onSuccess);
  emitter.on('failure', obj.onFailure);
}

exports.success = function(options, request, response) {
  emitter.emit('success', options, request, response);
}

exports.failure = function(options, request, e) {
  emitter.emit('failure', options, request, e);
}
