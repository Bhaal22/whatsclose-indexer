var fs = require('fs');
var Q = require('q');

var winston = require(__base + 'services/CustomWinston.js');
var eventEmitter = require(__base + 'services/CustomEventEmitter');


/** listened events **/
var CRAWL_DATA_EVENT = 'crawlData';

/** fired events **/
var CRAWLED_EVENT = 'crawled';
var CRAWLING_BAND = 'crawling_band';

/** attributes **/
function CrawlService() {
  this.crawl_modules = [];
}

/** methods **/
CrawlService.prototype = {

  fetch_modules: function() {
    var self = this;
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
  },

  dump_modules_information: function() {
    var self = this;
    self.crawl_modules.forEach(function(module) {
      console.log(module.crawlModule.band.name);
    });
  },
  
  /**
   * retrieve and initialise the available crawl modules 
   * @return {void}
   */
  init: function () {
    var self = this;

    self.fetch_modules();
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
    var self = this;
    var promises = [];


    this.crawl_modules.forEach(function(module) {
      var p = self._process(module.crawlModule);

      p.then(function(crawlModule) {
        if (crawlModule.band.concerts.length){
          // Fire event "crawled"
          eventEmitter.emit(CRAWLED_EVENT, crawlModule);
        }
      });

      promises.push(p);
    });

    return Q.all(promises);
  },

  /**
   * Parse every crawling module and call the testDataAcess & crawlWebData functions
   * @param  {[type]} crawlModule [description]
   * @return {[type]}             [description]
   */
  _process: function(crawlModule) {
    var band = crawlModule.band;

    eventEmitter.emit(CRAWLING_BAND, band);
    if (crawlModule.isValid()) {

      winston.warn('Start processing module : ' + band.name);
      winston.info('fullUrl : ' + crawlModule.fullUrl);
      
      return crawlModule.crawlWebData();
    }
  }
};

module.exports = new CrawlService();
