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
    var client = new es.Client ({
      host: process.env.ELASTICSEARCH_IP + ":" + process.env.ELASTICSEARCH_PORT || config.es.hostname || "localhost:9200",
	    port: process.env.ELASTICSEARCH_PORT || config.es.port || 9200
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

