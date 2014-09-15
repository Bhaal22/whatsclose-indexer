var es = require('elasticsearch');
// It seems that elasticsearch.Client doens't close the connection, that's why the indexer doesn't stop... => using elasticsearchclient instead
var esClient = require('elasticsearchclient');

var winston = require(__base + 'services/CustomWinston');

/** listened events **/

/** fired events **/

/** attributes **/
function Indexer () {
  this.index = 'whatsclose';
  this.type = '';
  this.es_client = new esClient ({
    host: 'localhost:9200',
    port: '9200'
  });
}

/** methods **/
Indexer.prototype = {
  init: function () {
    throw 'Not implemented';
  },

  exists: function (data) {
    throw 'Not implemented';
  },

  publish: function (data) {
    var self = this;
    var concert = data;

    this.exists (data)
      .catch (function (error) {
       
        self.es_client.create({
          index: self.index,
          type: self.type,
          body: concert
        }, function (err, resp) {
          if (err != undefined)
            console.log ('error %s', err);

          //console.log ('resp %s', resp);
          //console.log(resp);
        });
      });
  }
};

module.exports = {
  I: Indexer
};
