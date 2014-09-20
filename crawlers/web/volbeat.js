var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var newCrawlModule = new CrawlerModule();
newCrawlModule.fullUrl = 'http://www.volbeat.dk/3/dates/';
newCrawlModule.band = new Band();
newCrawlModule.band.name = 'Volbeat';
newCrawlModule.band.website = 'http://www.volbeat.dk/';
newCrawlModule.band.styles = ['Metal'];

// Override the method that assess the web page structure
newCrawlModule.testDataAcess = function() {
  winston.info('volbeat testDataAcess');
  return true;
};

newCrawlModule.date = function (d) {
  var regex = /(\d+-\d+)(.*)/;

  var date_return;
  var match = d.match(regex);

  if (match) {
    var range = match[1];
    var last = match[2];

    var days = range.split(/-/);

    date_return = new Date(days[0] + last);
  } else {
      date_return = Date.parse(d);
  } 
  
  return date_return.toString('yyyy-MM-dd');
}

// Override the method that retrieve the events data
newCrawlModule.processData = function(window) {
  winston.info('volbeat processDate');

  var $ = require('jquery')(window);
  var dates_table = $('table.dates_list');
  
  var self = this;
  var results = [];
  var rows = $ ('.dates_list > tr');
  console.log('volbeat entries: ', rows.length);
  rows.each (function (index) {
    var date = $('td.dates_date', this).text ();
    var location = $('td.dates_info2', this).text ();

    results.push({date: self.date (date), location: location});

  });

  return results;
};


module.exports = {
  crawlModule: newCrawlModule
};
