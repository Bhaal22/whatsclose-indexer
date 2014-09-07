var fs = require('fs');
var http = require('http');
var env = require('jsdom').env;
var Q = require('q');
var winston = require('./CustomWinston.js');

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

var auth = function () {
  //https://graph.facebook.com/oauth/access_token?client_id=699899433422062&client_secret=4a9c3c206928726923400b1073c6df56&grant_type=client_credentials
  
  var endpoint = {
    hostname: 'www.google.com',
    port: 443,
    path: '/oauth/access_token',
    method: 'GET' };
  
  var request = http.request(options, function(res) {
    
    var data = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      data += chunk
    });

    res.on('end', function () {
      console.log (data);
    });
  });

};

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
