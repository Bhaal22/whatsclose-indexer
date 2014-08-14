var winston = require('./services/CustomWinston.js');
var eventEmitter = require('./services/CustomEventEmitter');
var svc_handler = require('./services/ServicesHandler.js');
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
  svc_handler.init(winston);
  
  // Entry Point for indexation
  eventEmitter.emit("crawlData");
}

