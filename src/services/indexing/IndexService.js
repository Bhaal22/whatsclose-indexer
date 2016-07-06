var es = require('elasticsearch');

var winston = require(__base + 'services/CustomWinston');

var BandIndexer = require(__base + 'services/indexing/indexer.es/Band.Indexer').indexer;
var ConcertIndexer = require(__base + 'services/indexing/indexer.es/Concert.Indexer').indexer;
var MultipleConcertIndexer = require(__base + 'services/indexing/indexer.es/Multiple.Concert.Indexer').indexer;
var VenueIndexer = require(__base + 'services/indexing/indexer.es/Venue.Indexer').indexer;


/** listened events **/

/** fired events **/

/** attributes **/
function IndexService() {
}

/** methods **/
IndexService.prototype = {

  init: function() {
    
    var host = "localhost:9200";
    var port = 9200;

    if ((process.env.ELASTICSEARCH_IP != undefined) || (process.env.ELASTICSEARCH_PORT != undefined)) {
      host = process.env.ELASTICSEARCH_IP + ":" + process.env.ELASTICSEARCH_PORT;
      port = process.env.ELASTICSEARCH_PORT;
    }

    winston.info('Init ES client with host=' + host + ' and port:' + port);
    var client = new es.Client ({
      host: host,
      port: port    
    });

    // Avoid dynamic module loading when unnecessary
    // Here manual loading is straightforward
    var band = new BandIndexer(client);
    band.init();
    var concert = new ConcertIndexer(client);
    concert.init();
    var multipleConcert = new MultipleConcertIndexer(client);
    multipleConcert.init();

    var venueIndexer = new VenueIndexer(client);
    venueIndexer.init();
  }

};

module.exports = new IndexService();

