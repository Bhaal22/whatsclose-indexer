var root_indexer = require("./Indexer.js").I;
var winston = require('../CustomWinston.js');
var eventEmitter = require('../CustomEventEmitter');
var Q = require('q');

function MultipleConcertIndexer () {
  this.type = 'multiple.concert';
}

MultipleConcertIndexer.prototype = new root_indexer();

MultipleConcertIndexer.prototype.init = function () {
  var self = this;
	
	eventEmitter.on("geocode_multiple", function(crawledModule) {
	  self.publish(crawledModule);
	});
}

MultipleConcertIndexer.prototype.exists = function (data) {
  var concert = data.concert;

  return this.es_client.search ({
    index: this.index,
    type: this.type,
    body: {
      query: {
        bool: {
          must: [
            { match: { 'bandName' : concert.bandName }},
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
