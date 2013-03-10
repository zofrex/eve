var cli = require('./cli');
var events = require('./events');
var proxy = require('./proxy');

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

var server = new proxy.Server(argv.port, argv['proxy-mode'], argv['target-host']);
