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

var start_indexing = function(options) {
  var opts = options || {};
  
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
  svcHandler.init(opts);
  
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

if (argv.help) {
  show_help();
}
else if (argv.show_events) {
  dump_event_description ();
}
else if (argv.show_bands) {
  var crawlerService = require(__base + 'services/crawling/CrawlService.js');
  crawlerService.fetch_modules();
  crawlerService.dump_modules_information();
}
else if (argv.index_band) {
  console.log('will index specific bands');

  var bands = argv.index_band.split(",");
  start_indexing(
    {
      crawl_options: {
        bands: bands
      }
    });
}
else {
  start_indexing();
}

