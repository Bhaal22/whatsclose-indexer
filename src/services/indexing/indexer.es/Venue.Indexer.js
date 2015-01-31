var Q = require('q');

var root_indexer = require(__base + 'services/indexing/indexer.es/Indexer.js');
var winston = require(__base + 'services/CustomWinston');
var eventEmitter = require(__base + 'services/CustomEventEmitter');

var Venue = require(__base + 'model/Venue');

/** listened events **/
var CRAWLING_BAND = 'crawling_band';
var GEOCODE_OK = 'geocode_ok';

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
  
  eventEmitter.on(GEOCODE_OK, function(concert) {
    winston.info ('publishing venue ' + concert);

    var venue = new Venue(concert);
    self.publish(venue);
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
