var winston = require('winston');

var eventEmitter = require('./CustomEventEmitter');

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
	
	this.elasticSearchClient = new ElasticSearchClient(serverOptions);
};


// It is necessary to declare each function to keep the inheritance of EventEmitter
IndexService.prototype.init = function() {
	var self = this;
	
	eventEmitter.on("geocode_ok", function(crawledModule) {
		self.publish(crawledModule);
	});
	
};

IndexService.prototype.publish = function(document) {
	
	winston.info("publishing to ES : %j", document);
	this.elasticSearchClient.index(this.index, this.type, document)
		.on("data", function(data) {
			winston.info("Publishing OK : %j", data);
		})
		.on("error", function(error) {
      winston.error("NOT COOL : %s", error);
		})
		.exec();
};

module.exports = new IndexService();
