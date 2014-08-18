var winston = require('../CustomWinston');
var es = require('elasticsearch');
var Q = require('q');

function Indexer () {
  this.index = 'whatsclose';
  this.type = '';
  this.es_client = new es.Client ({
    host: 'localhost:9200',
    port: '9200'
  });
}


Indexer.prototype.init = function () {
  throw 'Not implemented';
}

Indexer.prototype.exists = function (data) {
  throw 'Not implemented';
}

Indexer.prototype.publish = function (data) {
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

module.exports = {
  I: Indexer
};
