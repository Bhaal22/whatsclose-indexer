var eventEmitter = require('./services/CustomEventEmitter');
var svc_handler = require('./services/ServicesHandler.js');
var argv = require('yargs').argv;


var Concert = require('./model/Concert');
var ci = require('./services/indexer.es/Concert.Indexer');

var show_help = function () {
  console.log ("--- Whatsclose indexer help ---");
};


// var ci = require('./services/indexer.es/Multiple.Concert.Indexer');

// var indexer = new ci.indexer ();

// var c = new Concert ();

// c.bandName = 'test';
// c.location = 'fake';
// c.date = '2014-09-01';

// var concert = {
//   concert: c,
//   geometrie: []
// };

// indexer.publish (concert);



if (argv.help) {
  show_help ();
} else if (argv.show_events) {
  dump_event_description ();
} else {
  
  // Services initialization
  svc_handler.init();
  
  // Entry Point for indexation
  eventEmitter.emit("crawlData");
}

