var Band = require('../../model/Band');
var CrawlerModule = require('../../model/CrawlerModule');
var winston = require('winston');
require('datejs');

var jquery = require('jquery');

var _module = new CrawlerModule();
_module.fullUrl = 'http://nightwish.com/en/live';
_module.band = new Band();
_module.band.name = 'Nightwish';
_module.band.website = 'http://nightwish.com';

_module.band.styles = ['Symphonic Metal'];

// Override the method that assess the web page structure
_module.testDataAcess = function() {
  winston.info('Nightwish testDataAcess');
  return true;
};

_module.date = function (d) {
  var date_return;
  try {
    date_return = Date.parseExact(d, ['d MMM yyyy']);
  } catch(e) {
    console.log(e);
  }
  return date_return.toString('yyyy-MM-dd');
}

// Override the method that retrieve the events data
_module.processData = function(window) {
  winston.info('Nightwish processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var rows = $ ('section > ul > li');

  var self = this;

  console.log('Nightwish entries: ', rows.length);
  rows.each (function (index) {
    
    var date = $('div.meta > time', this).text().trim();
    var venue = $('div.description > span.venue', this).text().trim();
    var location = $('div.meta > span.city', this).text().trim();

    results.push({ date: self.date (date), venue: venue, location: location });
  });

  return results;
}


module.exports = {
  crawlModule: _module
};
