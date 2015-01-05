// Path handling '__base' definition
global.__base = __dirname + '/';

var winston = require(__base + 'services/CustomWinston.js');
var eventEmitter = require(__base + 'services/CustomEventEmitter');
var svcHandler = require(__base + 'services/ServicesHandler.js');
var argv = require('yargs').argv;


var CRAWLED_EVENT = 'crawled';
var nb_dates = 0;
var must_index = [];
var indexed = [];


var show_help = function () {
  console.log ("--- Whatsclose indexer help ---");
};

if (argv.help) {
  show_help ();
} else if (argv.show_events) {
  dump_event_description ();
} else {
  

  eventEmitter.on(CRAWLED_EVENT, function (crawlModule) {
    nb_dates = nb_dates + crawlModule.band.concerts.length;
    must_index[crawlModule.band.bandName] = crawlModule.band.concerts.length;

    winston.info ("--- Whatsclose Main --- " + nb_dates + " dates crawl");
  });

  eventEmitter.on(GEOCODE_OK, function (_data) {
    must_index[_data.bandName]--;
  });

  eventEmitter.on(GEOCODE_MULTIPLE, function (_data) {
    must_index[_data.bandName]--;
  });


  
  // Services initialization
  svcHandler.init();
  
  // Entry Point for indexation
  eventEmitter.emit("crawlData");


//   setInterval(function () {
//     var remaining = must_index.reduce(function(previousValue, currentValue, index, array){
//   return previousValue + currentValue;
// });
//   }, 10000);
}

