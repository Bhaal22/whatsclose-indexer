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

MultipleConcertIndexer.prototype.update = function (es_data, data) {
  var deferred = Q.defer();

  if (es_data._source.venue != data.venue)
    deferred.resolve({
      id: es_data._id,
      doc: { venue: data.venue }
    });
  else
    deferred.reject('[' + data.bandName + '] No need to update document id ' + es_data._id);

  return deferred.promise;
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
            { match: { 'venue': data.venue }},
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
        deferred.reject (results);
      else if (results === 1) {
        deferred.resolve (body.hits.hits[0]);
      }
      else
        deferred.reject('Too much elements');

      return deferred.promise;
    });
}

module.exports = {
  indexer: MultipleConcertIndexer
};
