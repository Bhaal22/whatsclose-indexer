var root_indexer = require("./Indexer.js");
var winston = require('../CustomWinston');
var eventEmitter = require('../CustomEventEmitter');
var Q = require('q');

function ConcertIndexer () {
  this.type = 'concert';
}

ConcertIndexer.prototype = new root_indexer.I();

ConcertIndexer.prototype.init = function () {
  var self = this;
  console.log('init Concert.indexer');
	
	eventEmitter.on("geocode_ok", function(crawledModule) {
    winston.log ('publishing concert ...');
		self.publish(crawledModule);
	});
}

ConcertIndexer.prototype.exists = function (data) {
  

  return this.es_client.search ({
    index: this.index,
    body: {
      query: {
        bool: {
          must: [
            { match: { 'bandName' : data.bandName }},
            { match: { 'date': data.date }}
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
    indexer: ConcertIndexer
  };
