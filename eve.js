var cli = require('./cli');
var events = require('./events');
var proxy = require('./proxy');

var argv = cli.argv();

events.addListener(cli);

var server = new proxy.Server(argv.port, argv['proxy-mode'], argv['target-host']);
