var Q = require('q');

var root_indexer = require(__base + 'services/indexing/indexer.es/Indexer.js');
var winston = require(__base + 'services/CustomWinston');
var eventEmitter = require(__base + 'services/CustomEventEmitter');

/** listened events **/
var CRAWLING_BAND = 'crawling_band';

/** fired events **/

/** attributes **/
function BandIndexer() {
  this.type = 'band';
}

BandIndexer.prototype = new root_indexer.I();

/** methods **/
BandIndexer.prototype.init = function () {
  var self = this;
  
  eventEmitter.on(CRAWLING_BAND, function(band) {
    winston.info ('publishing band ' + band.name);
    self.publish(band);
  });
  
};

BandIndexer.prototype.update = function (id, band) {
  console.log(band.last_crawl_date);
  this.es_client.update({
    index: this.index,
    type: this.type,
    id: id,
    body: {
      doc: {
        last_crawl_date: band.last_crawl_date
      }
    }
  });
}

BandIndexer.prototype.exists = function (band) {
  return this.es_client.search ({
    index: this.index,
    type: this.type,
    body: {
      query: {
        match: {
          'name': band.name
        }
      }
    }
  }).then (function(body) {

    var deferred = Q.defer();
    var results = body.hits.total;
    
    winston.log(body);

    if (results === 0) {
      deferred.reject (Error (results));
    }
    else  {
      deferred.resolve (body.hits.hits[0]._id);
    }
    
    return deferred.promise;
  }).catch (function(error) {
    winston.err(error);
  });
};

module.exports = {
  indexer: BandIndexer
};
