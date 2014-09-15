var fs = require('fs');
var Q = require('q');

var winston = require(__base + 'services/CustomWinston.js');
var eventEmitter = require(__base + 'services/CustomEventEmitter');


/** listened events **/
var CRAWL_DATA_EVENT = 'crawlData';

/** fired events **/
var CRAWLED_EVENT = 'crawled';

/** attributes **/
function CrawlService(name) {

  this.crawl_modules = [];

}

/** methods **/
CrawlService.prototype = {
  
  /**
   * retrieve and initialise the available crawl modules 
   * @return {void}
   */
  init: function () {
    var self = this;
    // retrieve the crawlers js files
    var crawlersDir = fs.readdirSync(__base + 'crawlers/web');

    for ( var i = 0, ii = crawlersDir.length; i < ii; i++) {
      var currentCrawlModuleName = crawlersDir[i];
      var regex = /.js$/;

      var match = currentCrawlModuleName.match(regex);

      // if a js file is found, push it into the crawl modules
      if (match) {
        
        winston.info('Crawler file found : ' + currentCrawlModuleName);
        
        // Load the js file as a node module
        var module = require(__base + 'crawlers/web/' + currentCrawlModuleName.replace(/.js$/, ''));
        self.crawl_modules.push(module);
      }
    };
    
    // register the listening callbacks
    eventEmitter.on(CRAWL_DATA_EVENT, function() {
      self.crawlData();
    });
  },

  /**
   * crawl each module web page
   * @return {void}
   */
  crawlData: function() {
    var promises = [];
    // Parse every crawling module and call the testDataAcess & crawlWebData functions
    var process = function(crawlModule) {
      var band = crawlModule.band;

      if (crawlModule.isValid()) {

        winston.warn('Start processing module : ' + band.name);
        // check if the page web is still well defined
        var isPageOK = crawlModule.testDataAcess();
        if (isPageOK) {
          winston.info('fullUrl : ' + crawlModule.fullUrl);
          return crawlModule.crawlWebData();
        }
      }
    };

    this.crawl_modules.forEach(function(module) {
      var p = process(module.crawlModule);

      p.then(function(crawlModule) {
        // Fire event "crawled"
        eventEmitter.emit(CRAWLED_EVENT, crawlModule);
      });

      promises.push(p);
    });

    return Q.all(promises);
  }

};

module.exports = new CrawlService();