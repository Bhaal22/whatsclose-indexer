var root_indexer = require("./Indexer.js").I;
var winston = require('../CustomWinston.js');
var es = require('elasticsearch');
var eventEmitter = require('../CustomEventEmitter');

function MultipleConcertIndexer () {
    this.type = 'multiple.concert';
}

MultipleConcertIndexer.prototype = new root_indexer();

MultipleConcertIndexer.prototype.init = function () {
  	var self = this;
	
	eventEmitter.on("geocode_multiple", function(crawledModule) {
		self.publish(crawledModule);
	});
}

MultipleConcertIndexer.prototype.exists = function (data) {
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
  indexer: MultipleConcertIndexer
};
