var fs = require('fs');
var http = require('http');
var env = require('jsdom').env;
var Q = require('q');
var winston = require('winston');

// attributes
var CrawlService = function () {
  var outgoing_events = [ 'crawled'];
  this.crawl_modules = [];
  this.moduleName = "CrawlService";
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
    var process = function (crawlModule) {
      var band = crawlModule.band;

      if (crawlModule.isValid()) {

        winston.info('Start processing module : ' + band.name);
        // check if the page web is still well defined
        var isPageOK = crawlModule.testDataAcess();
        if (isPageOK) {
          winston.info('fullUrl : ' + crawlModule.fullUrl);
          return crawlModule.crawlWebData ();
        }
      }
    };

    this.crawl_modules.forEach (function (module) {
      var p = process (module.crawlModule);

      promises.push (p);
    });

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
