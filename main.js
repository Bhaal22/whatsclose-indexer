// Path handling '__base' definition
global.__base = __dirname + '/';

var winston = require(__base + 'services/CustomWinston.js');
var eventEmitter = require(__base + 'services/CustomEventEmitter');
var svcHandler = require(__base + 'services/ServicesHandler.js');
var argv = require('yargs').argv;

var GEOCODE_OK = 'geocode_ok';
var GEOCODE_MULTIPLE = 'geocode_multiple';
var CRAWLED_EVENT = 'crawled';

var nb_dates = 0;
var must_index = {};


var show_help = function () {
  console.log ("--- Whatsclose indexer help ---");
};

if (argv.help) {
  show_help ();
} else if (argv.show_events) {
  dump_event_description ();
} else {
  

  eventEmitter.on(CRAWLED_EVENT, function (crawlModule) {
    var bandName = crawlModule.band.name;
    var nb_concerts = crawlModule.band.concerts.length;

    nb_dates = nb_dates + nb_concerts;
    must_index[bandName] = nb_concerts;

    winston.info ("--- Whatsclose Main --- " + bandName + " " + nb_concerts);
    winston.info ("--- Whatsclose Main --- " + nb_dates + " dates crawl");
  });

  eventEmitter.on(GEOCODE_OK, function (_data) {
    must_index[_data.bandName]--;
  });

  eventEmitter.on(GEOCODE_MULTIPLE, function (_data) {
    must_index[_data.bandName]--;
  });

  eventEmitter.on("exit", function () {
    process.exit(0);
  });


  
  // Services initialization
  svcHandler.init();
  
  // Entry Point for indexation
  eventEmitter.emit("crawlData");


  setInterval(function () {
    winston.info("[Checking for exit] ...");
    var remaining = 0;
    
    console.log(must_index);
    for (var prop in must_index) {
      remaining = remaining + must_index[prop];
    }
      
    winston.info("[Checking for exit]: " + remaining);
    if (remaining === 0)
      eventEmitter.emit("exit");
  }, 10000);
}

