var root_indexer = require("./Indexer.js").I;
var winston = require('../CustomWinston');
var es = require('elasticsearch');
var eventEmitter = require('../CustomEventEmitter');

function ConcertIndexer () {
    this.type = 'concert';
}

ConcertIndexer.prototype = new root_indexer();

ConcertIndexer.prototype.init = function () {
  var self = this;
  console.log('init Concert.indexer');
	
	eventEmitter.on("geocode_ok", function(crawledModule) {
    winston.log ('publishing concert ...');
		self.publish(crawledModule);
	});
}

ConcertIndexer.prototype.exists = function (data) {
    return this.es_client.search ({
        index: this.index,
        body: {
            query: {
                match: {
                    band_name: data.band_name,
                    date: data.date
                    }
                }
        }
    });
}

module.exports = {
  indexer: ConcertIndexer
};
