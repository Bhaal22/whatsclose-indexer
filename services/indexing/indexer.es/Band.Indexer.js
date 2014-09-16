var winston = require(__base + 'services/CustomWinston');
var eventEmitter = require(__base + 'services/CustomEventEmitter');

/** listened events **/
var CRAWLING_BAND = 'crawling_band';

/** fired events **/

/** attributes **/
function BandIndexer() {

  this.type = 'band';

}

/** methods **/
BandIndexer.prototype = {
  init: function () {
    var self = this;

    eventEmitter.on(CRAWLING_BAND, function(band) {
      self.publish(band);
    });

  },

  exists: function (band) {
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
};

module.exports = {
  indexer: BandIndexer
};
