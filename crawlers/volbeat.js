var Band = require('../model/Band');
var CrawlerModule = require('../model/CrawlerModule');
var winston = require('winston');


var newCrawlModule = new CrawlerModule();
newCrawlModule.fullUrl = 'http://www.volbeat.dk/3/dates/';
newCrawlModule.band = new Band();
newCrawlModule.band.name = 'Volbeat';
newCrawlModule.band.website = 'http://www.volbeat.dk/';
newCrawlModule.band.style.push('Metal');

// Override the method that assess the web page structure
newCrawlModule.testDataAcess = function() {
  winston.info('volbeat testDataAcess');
  return true;
};

// Override the method that retrieve the events data
newCrawlModule.processData = function(window) {
  winston.info('volbeat processDate');

  var $ = require('jquery')(window);
  var dates_table = $('table.dates_list');
  
  var results = [];
  var rows = $ ('.dates_list > tr');
  rows.each (function (index) {
    var date = $('td.dates_date', this).text ();
    var location = $('td.dates_info2', this).text ();
    results.push({date: new Date(date), location: location});

  });

  return results;
};


module.exports = {
  crawlModule: newCrawlModule
};
