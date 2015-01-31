var Q = require('q');

var root_indexer = require(__base + 'services/indexing/indexer.es/Indexer.js').I;
var winston = require(__base + 'services/CustomWinston.js');
var eventEmitter = require(__base + 'services/CustomEventEmitter');


/** listened events **/
var GEOCODE_MULTIPLE = 'geocode_multiple';

/** fired events **/

/** attributes **/
function MultipleConcertIndexer (client) {
  this.type = 'multiple.concert';
  this.es_client = client;
}

MultipleConcertIndexer.prototype = new root_indexer();

/** methods **/
MultipleConcertIndexer.prototype.init = function () {
  var self = this;
	
	eventEmitter.on(GEOCODE_MULTIPLE, function(crawledModule) {
	  self.publish(crawledModule);
	});
}

MultipleConcertIndexer.prototype.exists = function (data) {
  var concert = data;

  return this.es_client.search ({
    index: this.index,
    type: this.type,
    body: {
      query: {
        bool: {
          must: [
            { match: { 'bandName.exact' : concert.bandName }},
            { match: { 'date': concert.date }}
          ]
        }
      }
    }
  })
    .then (function (body) {
      var deferred = Q.defer();
      var results = body.hits.total;
      
      if (results === 0)
        deferred.reject (Error (results));
      else
        deferred.resolve ();

      return deferred.promise;
    });
}

module.exports = {
  indexer: MultipleConcertIndexer
};
