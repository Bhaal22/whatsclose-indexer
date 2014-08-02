var winston = require('winston');
var es = require('elasticsearch');

function Indexer (index) {
  this.index = index;
  this.es_client = new es.Client ({
    host: 'localhost:9200',
    port: '9200'
  });
}

Indexer.prototype.publish = function (data) {
  this.es_client.create({
    index: this.index,
    type: 'concert',
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
  })
}

module.exports = {
  I: Indexer
};
