var winston = require('../CustomWinston');
var es = require('elasticsearch');

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

  //if (!this.exists (data)) {
  this.es_client.create({
    index: this.index,
    type: this.type,
    body: data
  }, function (error, response) {
    if (error) {
      winston.error("NOT COOL! [" + error + "]");
    } else {
      if (response) {
        winston.log(response);
      } else {
        winston.log("vas savoir ^^");
      }
    }
  });
  // }
}

module.exports = {
  I: Indexer
};
