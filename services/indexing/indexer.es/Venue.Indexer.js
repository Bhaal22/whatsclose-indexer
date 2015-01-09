var Q = require('q');

var root_indexer = require(__base + 'services/indexing/indexer.es/Indexer.js');
var winston = require(__base + 'services/CustomWinston');
var eventEmitter = require(__base + 'services/CustomEventEmitter');

/** listened events **/
var CRAWLING_BAND = 'crawling_band';

/** fired events **/

/** attributes **/
function VenueIndexer(client) {
  this.type = 'venue';
  this.es_client = client;
}

VenueIndexer.prototype = new root_indexer.I();

/** methods **/
VenueIndexer.prototype.init = function () {
  var self = this;
  
  eventEmitter.on(CRAWLING_BAND, function(venue) {
    winston.info ('publishing venue ' + venue);
    self.publish(band);
  });
  
};

VenueIndexer.prototype.exists = function (venue) {
  return this.es_client.search ({
    index: this.index,
    type: this.type,
    body: {
      query: {
        match: {
          'name': venue.name
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
  indexer: VenueIndexer
};
