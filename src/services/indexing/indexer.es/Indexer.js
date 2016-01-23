var Q = require('q');

// It seems that elasticsearch.Client doens't close the connection, that's why the indexer doesn't stop... => using elasticsearchclient instead
var esClient = require('elasticsearchclient');

var winston = require(__base + 'services/CustomWinston');

/** listened events **/

/** fired events **/

/** attributes **/
function Indexer (client) {
  this.index = 'whatsclose';
  this.type = '';
  this.es_client = client;
}

/** methods **/
Indexer.prototype = {
  init: function () {
    throw 'Not implemented';
  },

  exists: function (data) {
    throw 'Not implemented';
  },
  
  update: function (es_data, data) {
    var deferred = Q.defer();
    deferred.reject('Not implemented');
    return deferred.promise;
  },

  publish: function (data) {
    var self = this;
    var _data = data;

    this.exists (data)
      .catch (function (error) {
        self.es_client.create({
          index: self.index,
          type: self.type,
          body: _data
        }, function (err, resp) {
          if (err != undefined)
            console.log ('error %s', err);
        });
      }).then(function(es_data) {
        return self.update(es_data, data);

        //output : id, body to update
      }).then(function(update_data) {

        winston.warn('[' + data.bandName + '] Updating document id ' + update_data.id);
        self.es_client.update({
          index: self.index,
          type: self.type,
          id: update_data.id,
          body: {
            doc: update_data.doc
          }
        }, function (err, resp) {
          if (err != undefined)
            console.log ('error %s', err);
        });
      }).catch(function(error) {
        if (error != 'Not implemented')
          winston.warn(error);
      });
  }
};

module.exports = {
  I: Indexer
};
