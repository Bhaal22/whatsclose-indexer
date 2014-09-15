var winston = require(__base + 'services/CustomWinston');

var BandIndexer = require(__base + 'services/indexing/indexer.es/Band.Indexer').indexer;
var ConcertIndexer = require(__base + 'services/indexing/indexer.es/Concert.Indexer').indexer;
var MultipleConcertIndexer = require(__base + 'services/indexing/indexer.es/Multiple.Concert.Indexer').indexer;


/** listened events **/

/** fired events **/

/** attributes **/
function IndexService() {



}

/** methods **/
IndexService.prototype = {

  init: function() {

    // Avoid dynamic module loading when unnecessary
    // Here manual loading is straightforward
    var band = new BandIndexer;
    band.init();
    var concert = new ConcertIndexer;
    concert.init();
    var multipleConcert = new MultipleConcertIndexer;
    multipleConcert.init();

  }

};

module.exports = new IndexService();

