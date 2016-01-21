var Q = require('q');

var root_indexer = require(__base + 'services/indexing/indexer.es/Indexer.js');
var winston = require(__base + 'services/CustomWinston');
var eventEmitter = require(__base + 'services/CustomEventEmitter');

/** listened events **/
var GEOCODE_OK = 'geocode_ok';

/** fired events **/

function ConcertIndexer (client) {
  this.type = 'concert';
  this.es_client = client;
}

ConcertIndexer.prototype = new root_indexer.I();

ConcertIndexer.prototype.init = function () {
  var self = this;
  winston.info('init Concert.indexer');
	
	eventEmitter.on(GEOCODE_OK, function(crawledModule) {
    winston.info ('publishing concert for ' + crawledModule.bandName + ' ' + crawledModule.location);
		self.publish(crawledModule);
	});
}

ConcertIndexer.prototype.update = function (es_data, data) {
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

ConcertIndexer.prototype.exists = function (data) {
  return this.es_client.search ({
    index: this.index,
    body: {
      query: {
        bool: {
          must: [
            { match: { 'bandName.exact' : data.bandName }},
            { match: { 'date': data.date }}
          ]
        }
      }
    }
  }).then (function (body) {
    var deferred = Q.defer();
    var results = body.hits.total;
    
    winston.warn("body.hits.total = " + results);
    if (results === 0)
      deferred.reject (results);
    else if (results === 1)
      deferred.resolve (body.hits.hits[0]);
    else
      deferred.reject('Too much elements');
    
    return deferred.promise;
  });
}

module.exports = {
    indexer: ConcertIndexer
};
