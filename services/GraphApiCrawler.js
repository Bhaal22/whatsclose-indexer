var fs = require('fs');
var https= require('https');
var env = require('jsdom').env;
var Q = require('q');
var qs = require('qs');
var url = require('url');
var winston = require('./CustomWinston.js');

var fb_config = require(__base + '/config/fb');

// Events
var eventEmitter = require('./CustomEventEmitter');

var CRAWL_DATA_EVENT = "crawlData";
var CRAWLED_EVENT = "crawled";

// attributes
var CrawlService = function() {
	this.crawl_modules = [];
	this.moduleName = "CrawlService";

  this.access_token = "";
};

CrawlService.prototype.auth = function () {

  var httpGet = function (opts) {
    var deferred = Q.defer();
    https.get(opts, deferred.resolve);

    return deferred.promise;
  };

  var fb_response = function (res) {
    var deferred = Q.defer();

    var body = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk
    });
    
    res.on('end', function (res) {
      console.log(body);

      var json = typeof body === 'string' ? null : body
      , err = null;
      if (!json) {
        try {
          if (~body.indexOf('{') && ~body.indexOf('}')) {
            json = JSON.parse(body);
          } else {

            if (!~body.indexOf('=')) body = 'data=' + body;
            if (body.charAt(0) !== '?') body = '?' + body;

            json = url.parse(body, true).query;
          }
        } catch (e) {
          err = {
            message: 'Error parsing json'
            , exception: e
          };
        }
      }
    });

    return deferred.promise;
  }
  
  var path = qs.stringify(fb_config);
  var endpoint = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: '/oauth/access_token?' + path,
    method: 'GET' };
  
  return httpGet(endpoint).then(function (res) {
    fb_response (res);
  });
}

CrawlService.prototype.init = function() {
	var self = this;

  auth ();
  
	var crawlersDir = fs.readdirSync('./crawlers/graphApi');

	for ( var i = 0, ii = crawlersDir.length; i < ii; i++) {
    var band_file_name = crawlersDir[i];
    var regex = /.js$/;

    var match = band_file_name.match(regex);

    if (match) {

		  winston.info('Crawler file found : ' + band_file_name);
		  // Load the js files as node modules
		  var module = require('../crawlers/graphApi'
				                   + band_file_name.replace(/.js$/, ""));
		  this.crawl_modules.push(module);
    }
	};
	
	eventEmitter.on(CRAWL_DATA_EVENT, function() {
		self.crawlData();
	});
};

CrawlService.prototype.crawlData = function() {
	var self = this;
	var promises = [];
	// Parsing every crawling module and calling the testDataAcess & crawlWebData functions
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
};

module.exports = new CrawlService();
