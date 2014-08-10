var root_indexer = require("./Indexer").I
var winston = require('winston');
var es = require('elasticsearch');

function ConcertIndexer () {
    this.type = 'concert';
}

ConcertIndexer.prototype = new root_indexer();
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
