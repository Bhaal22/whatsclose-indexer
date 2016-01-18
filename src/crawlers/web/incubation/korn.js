var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var newCrawlModule = new CrawlerModule();
newCrawlModule.fullUrl = 'http://www.korn.com/tour/';
newCrawlModule.band = new Band();
newCrawlModule.band.name = 'Korn';
newCrawlModule.band.website = 'http://www.korn.com';

newCrawlModule.band.styles = [ "Punk hardcore", "Crossover thrash", "Digital hardcore", "Metalcore" ]

// Override the method that assess the web page structure
newCrawlModule.testDataAcess = function() {
  winston.info('korn testDataAcess');
  return true;
};

// Override the method that retrieve the events data
newCrawlModule.processData = function(window) {

 winston.info('korn processDate');

  var $ = require('jquery')(window);
  var dates_table = $('table.dates_list');
	var rows = $ ('#scroll-content-dates > ul > li');
	
  var results = [];

  console.log('korn entries: ', rows.length);
  rows.each (function (index) {
    var date = $('span.DateDate', this).text ();
    var fullLocation = $(this).text ();
    var location = fullLocation.split ('\n')[2].trim ();
    var venue = fullLocation.split ('\n')[4].trim ();
    var dateElements = date.split ("/");
		
		results.push({date: new Date (dateElements[2], dateElements[1]-1, dateElements[0]).toString('yyyy-MM-dd'), 
			      location: location,
			      venue: venue
			     });

  });

  return results;
};


module.exports = {
  crawlModule: newCrawlModule
};




