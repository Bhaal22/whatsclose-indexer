var root_indexer = require("./Indexer.js").I;
var winston = require('../CustomWinston.js');
var es = require('elasticsearch');
var eventEmitter = require('../CustomEventEmitter');

function BandIndexer () {
    this.type = 'band';
}

//BandIndexer.prototype = new root_indexer();

BandIndexer.prototype.init = function () {
  	var self = this;
	
	eventEmitter.on("crawling_band", function(band) {
		self.publish(band);
	});
}

BandIndexer.prototype.exists = function (band) {
    return this.es_client.search ({
        index: this.index,
        body: {
            query: {
                match: {
                    name: band.name
                    }
                }
        }
    });
}

module.exports = {
  indexer: BandIndexer
};
