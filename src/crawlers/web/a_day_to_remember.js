var Band = require('../../model/Band');
var CrawlerModule = require('../../model/CrawlerModule');
var winston = require('winston');
require('datejs');

var jquery = require('jquery');

var _module = new CrawlerModule();
_module.fullUrl = 'http://adtr.com';
_module.band = new Band();
_module.band.name = 'A Day To Remember';
_module.band.website = 'http://adtr.com/';

_module.band.styles = ['Post-Hardcore', 'Pop punk', 'Metalcore', 'Melodic-Hardcore', 'Easycore'];

// Override the method that assess the web page structure
_module.testDataAcess = function() {
  winston.info('ADTR testDataAcess');
  return true;
};

_module.date = function (d) {
  var date_return;
  try {
    date_return = Date.parseExact(d, ['MMM d']);
  } catch(e) {
    console.log(e);
  }
  return date_return.toString('yyyy-MM-dd');
}

// Override the method that retrieve the events data
_module.processData = function(window) {
  winston.info('adtr processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var rows = $ ('#tourDates > li');

  var self = this;
 
  console.log('ADTR entries: ', rows.length - 1);
  rows.slice(1).each (function (index) {
    
    var date = $('span.c1', this).text().trim();
    var venue = $('span.c2', this).text().trim();
    var location = $('span.c4', this).text().trim();

    results.push({ date: self.date (date), venue: venue, location: location });
  });

  return results;
}


module.exports = {
  crawlModule: _module
};
