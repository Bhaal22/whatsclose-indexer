var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var newCrawlModule = new CrawlerModule();
newCrawlModule.fullUrl = 'https://www.metallica.com/tour';
newCrawlModule.band = new Band();
newCrawlModule.band.name = 'Metallica';
newCrawlModule.band.website = 'https://www.metallica.com';

newCrawlModule.band.styles = [ "Heavy metal", "thrash metal" ];

// Override the method that assess the web page structure
newCrawlModule.testDataAcess = function() {
    winston.info('metallica testDataAcess');
    return true;
};

// Override the method that retrieve the events data
newCrawlModule.processData = function(window) {

    winston.info('metallica processDate');

    var $ = require('jquery')(window);
    var rows = $('div.list-item');

    var results = [];

    console.log('metallica entries: ', rows.length);
    rows.each (function (index) {
        var date = $('span.DateDate', this).text();
        var fullLocation = $('span.DateDetail', this).text();

        var details = fullLocation.split('\n');
        
        var location = details[1].trim() + ',' + details[2].trim();
        var venue = details[3].trim();
        var dateElements = date.split("/");

        //results.push({date: new Date (dateElements[2], dateElements[1]-1, dateElements[0]).toString('yyyy-MM-dd'),
        //             location: location,
        //             venue: venue
        //});

    });

    return results;
};


module.exports = {
    crawlModule: newCrawlModule
};




