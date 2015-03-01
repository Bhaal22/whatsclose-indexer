var crawlService = require(__base + 'services/crawling/CrawlService');
var geoCodeService = require(__base + 'services/geocoding/GeoCodeService');
var indexService = require(__base + 'services/indexing/IndexService');

/** listened events **/

/** fired events **/

/** attributes **/
function ServicesHandler(name) {
}

/** methods **/
ServicesHandler.prototype = {
  
  init: function (options) {
    var opts = options || {};
    // Avoid dynamic module loading when unnecessary
    // Here manual loading is straightforward
    crawlService.init(opts.crawl_options);
    geoCodeService.init();
    indexService.init();
  }
};

module.exports = new ServicesHandler();
