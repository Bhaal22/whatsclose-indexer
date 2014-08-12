var fs = require('fs');
var http = require('http');
var env = require('jsdom').env;
var Q = require('q');

// Events
var eventEmitter = require('./CustomEventEmitter');

var CRAWL_DATA_EVENT = "crawlData";
var CRAWLED_EVENT = "crawled";

// attributes
var CrawlService = function() {
	this.crawl_modules = [];
	this.moduleName = "CrawlService";
  this.logger = {};
};

// It is necessary to declare each function to keep the inheritance of EventEmitter
CrawlService.prototype.init = function(winston) {
  this.logger = winston;

	var self = this;
	// retrieve the crawlers js files
	var crawlersDir = fs.readdirSync('./crawlers');

	for ( var i = 0, ii = crawlersDir.length; i < ii; i++) {

		this.logger.info('Crawler file found : ' + crawlersDir[i]);
		// Load the js files as node modules
		var module = require('../crawlers/'
				+ crawlersDir[i].replace(/.js$/, ""));
		this.crawl_modules.push(module);
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

			self.logger.warn('Start processing module : ' + band.name);
			// check if the page web is still well defined
			var isPageOK = crawlModule.testDataAcess();
			if (isPageOK) {
				self.logger.info('fullUrl : ' + crawlModule.fullUrl);
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
