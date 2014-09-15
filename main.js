// Path handling '__base' definition
global.__base = __dirname + '/';

var eventEmitter = require(__base + 'services/CustomEventEmitter');
var svcHandler = require(__base + 'services/ServicesHandler.js');
var argv = require('yargs').argv;

var show_help = function () {
  console.log ("--- Whatsclose indexer help ---");
};

if (argv.help) {
  show_help ();
} else if (argv.show_events) {
  dump_event_description ();
} else {
  
  // Services initialization
  svcHandler.init();
  
  // Entry Point for indexation
  eventEmitter.emit("crawlData");
}

