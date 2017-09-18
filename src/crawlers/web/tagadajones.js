var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var newCrawlModule = new CrawlerModule();
newCrawlModule.fullUrl = 'http://www.tagadajones.com/new/fr/home#/Dates/';
newCrawlModule.band = new Band();
newCrawlModule.band.name = 'Tagada Jones';
newCrawlModule.band.website = 'http://www.tagadajones.com';

newCrawlModule.band.styles = [ "Punk hardcore", "Crossover thrash", "Digital hardcore", "Metalcore" ];

// Override the method that assess the web page structure
newCrawlModule.testDataAcess = function() {
    winston.info('tagada jones testDataAcess');
    return true;
};

// Override the method that retrieve the events data
newCrawlModule.processData = function(window) {

    winston.info('tagada jones processDate');

    var $ = require('jquery')(window);
	  var rows = $('#scroll-content-dates > ul > li');

    var results = [];

    console.log('tagada jones entries: ', rows.length);
    rows.each (function (index) {
        var date = $('span.DateDate', this).text();
        var fullLocation = $('span.DateDetail', this).text();

        var details = fullLocation.split('\n');
//        winston.info(details);
        var location = details[1].trim() + ',' + details[2].trim();
        var venue = details[3].trim();
        var dateElements = date.split("/");

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




