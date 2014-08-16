var fs = require('fs');
var winston = require('./CustomWinston');

// It seems that elasticsearch.Client doens't close the connection, that's why the indexer doesn't stop... => using elasticsearchclient instead
var ElasticSearchClient = require('elasticsearchclient');

var serverOptions = {
	host : 'localhost',
	port : 9200,
};

var IndexService = function() {
	this.moduleName = "IndexService";

	// Indexer Initialization
	this.index = 'whatsclose';
	this.type = 'concert';
	
  this.indexers = [];
	//this.elasticSearchClient = new ElasticSearchClient(serverOptions);
};


// It is necessary to declare each function to keep the inheritance of EventEmitter
IndexService.prototype.init = function() {
  var indexer_files = fs.readdirSync('services/indexer.es');

  indexer_files.forEach (function (indexer_file) {
    var regex = /.js$/;
    
    var match = indexer_file.match(regex);

    if (match) {
    
  	  winston.info('indexer service file found : ' + indexer_file);
  	  
      //  	var m = require('./indexer.es/Band.Indexer.js').indexer;
      var module = require('./indexer.es/' + indexer_file.replace(/.js$/, "")).indexer;
      
      try {
        var indexer = new module ();
        indexer.init();
      } catch (e) {
        winston.error(e.toString());
      }
    }
  });
};


// IndexService.prototype.publish = function(document) {
	
// 	winston.info("publishing to ES : %j", document);
// 	this.elasticSearchClient.index(this.index, this.type, document)
// 		.on("data", function(data) {
// 			winston.info("Publishing OK : %j", data);
// 		})
// 		.on("error", function(error) {
//       winston.error("NOT COOL : %s", error);
// 		})
// 		.exec();
// };

module.exports = new IndexService;
