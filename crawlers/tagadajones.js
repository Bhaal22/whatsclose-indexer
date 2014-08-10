var Band = require('../model/Band');
var CrawlerModule = require('../model/CrawlerModule');
var winston = require('winston');


var newCrawlModule = new CrawlerModule();
newCrawlModule.fullUrl = 'http://www.tagadajones.com/new/#/Dates/';
newCrawlModule.band = new Band();
newCrawlModule.band.name = 'Tagada Jones';
newCrawlModule.band.website = 'http://www.tagadajones.com';
newCrawlModule.band.style.push('Punk');
newCrawlModule.band.style.push('HardCore');

// Override the method that assess the web page structure
newCrawlModule.testDataAcess = function() {
  winston.info('tagada jones testDataAcess');
  return true;
};

// Override the method that retrieve the events data
newCrawlModule.processData = function(window) {

 winston.info('tagada jones processDate');

  var $ = require('jquery')(window);
  var dates_table = $('table.dates_list');
	var rows = $ ('#scroll-content-dates > ul > li');
	
  var results = [];
  rows.each (function (index) {
    var date = $('span.DateDate', this).text ();
		var fullLocation = $(this).text ();
		var location = fullLocation.split ('\n')[2].trim ();
		var dateElements = date.split ("/");
		
		results.push({date: new Date (dateElements[2], dateElements[1], dateElements[0]), location: location});

  });

  return results;
};


module.exports = {
  crawlModule: newCrawlModule
};




