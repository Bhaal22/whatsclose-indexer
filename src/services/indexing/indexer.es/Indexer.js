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
  
  update: function (id, data) {
    /** do nothing **/
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
      }).then(function(id) {
        self.update(id, _data);
      });
  }
};

module.exports = {
  I: Indexer
};
