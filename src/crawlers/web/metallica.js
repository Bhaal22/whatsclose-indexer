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
            //div class="event-date-month">Oct</div>
            //<div class="heading heading-m-compact event-date-day">24</div>
            //<div class="event-date-year">2017</div>

        var date_month = $('.event-date > .event-date-month', this).text();
        var date_day   = $('.event-date > .event-date-day', this).text();
        var date_year  = $('.event-date > .event-date-year', this).text();
        
        var location = $(".event-info > h2 > a", this).text();
        var venue = $("div.event-info-venue", this).text();

        results.push({date: new Date (date_year, Date.getMonthNumberFromName(date_month), date_day).toString('yyyy-MM-dd'),
                     location: location,
                     venue: venue
        });

    });

    return results;
};


module.exports = {
    crawlModule: newCrawlModule
};




