var Q = require('q');

var root_indexer = require(__base + 'services/indexing/indexer.es/Indexer.js');
var winston = require(__base + 'services/CustomWinston');
var eventEmitter = require(__base + 'services/CustomEventEmitter');

/** listened events **/
var CRAWLING_BAND = 'crawling_band';

/** fired events **/

/** attributes **/
function BandIndexer(client) {
  this.type = 'band';
  this.es_client = client;
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

BandIndexer.prototype.update = function (es_band, band) {
  var deferred = Q.defer();

  deferred.resolve({
    id: es_band._id,
    doc: { last_crawl_date: band.last_crawl_date }
  });
  
  return deferred.promise;
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
      deferred.resolve (body.hits.hits[0]);
    }
    
    return deferred.promise;
  }).catch (function(error) {
    winston.err(error);
  });
};

module.exports = {
  indexer: BandIndexer
};
