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

newCrawlModule.date = function (d) {
  var regex = /(\d+-\d+)(.*)/;

  var date_return;
  var match = d.match(regex);

  console.log ("match %s", match);
  if (match) {
    var range = match[1];
    var last = match[2];

    var days = range.split(/-/);

    date_return = new Date(days[0] + last);
  } else {
    date_return = new Date(d);
  } 

  return date_return;
}

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
    results.push({date: this.date (date), location: location});

  });

  return results;
};


module.exports = {
  crawlModule: newCrawlModule
};
