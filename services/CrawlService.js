var fs = require('fs');
var http = require('http');
var env = require('jsdom').env;
var Q = require('q');
var winston = require('winston');

// attributes
var CrawlService = function () {
  this.crawl_modules = [];
}

// methods
CrawlService.prototype = {

	init: function() {
    console.log (__dirname);
		// retrieve the crawlers js files
    var crawlersDir = fs.readdirSync('./crawlers');
    var crawlModules = [];

    for (var i = 0, ii = crawlersDir.length; i < ii; i++) {
    
      winston.info('Crawler file found : ' + crawlersDir[i]);
      // Load the js files as node modules
      var module = require('../crawlers/' + crawlersDir[i].replace(/.js$/, ""));
      this.crawl_modules.push(module);
    };
  },

  run: function() {
    var promises = [];
    // Parsing every crawling module and calling the testDataAcess & crawlWebData functions
    for (var i = 0, ii = this.crawl_modules.length; i < ii; i++) {

      winston.info('Start processing module : ' + this.crawl_modules[i].crawlModule.band.name);
      if (this.crawl_modules[i].crawlModule.isValid()){
    
        // check if the page web is still well defined
        var isPageOK = this.crawl_modules[i].crawlModule.testDataAcess();
        if (isPageOK) {
          winston.info('fullUrl : ' + this.crawl_modules[i].crawlModule.fullUrl);
          var p = this.crawl_modules[i].crawlModule.crawlWebData();
          promises.push (p);
        }
      }
    };
    return Q.all (promises);
  }

// .then (function (res) {
//       try {
//         console.log (res[0]);
//       } catch (e) {
//         console.log('exception');
//         }
//     });
//   }   
}

module.exports = new CrawlService ();
