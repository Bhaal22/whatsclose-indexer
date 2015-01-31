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
  
   init: function () {
    
    // Avoid dynamic module loading when unnecessary
    // Here manual loading is straightforward
    crawlService.init();
    geoCodeService.init();
    indexService.init();
  }
  
  // end: function () {
  //   crawlService.end();
  //   geoCodeService.end();
  //   indexService.end();
  // }
};

module.exports = new ServicesHandler();
