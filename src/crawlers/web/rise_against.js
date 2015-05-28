var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var rise_against_module = new CrawlerModule();
rise_against_module.fullUrl = 'http://www.bandsintown.com/RiseAgainst/upcoming_events';
rise_against_module.band = new Band();
rise_against_module.band.name = 'Rise Against';
rise_against_module.band.website = 'http://www.riseagainst.com/';

rise_against_module.band.styles = ['Melodic hardcore', 'punk rock', 'hardcore punk'];

// Override the method that assess the web page structure
rise_against_module.testDataAcess = function() {
  winston.info('rise against testDataAcess');
  return true;
};

rise_against_module.date = function (d) {
  var date_return;
  try {
    date_return = Date.parseExact(d, ['yyyy-MM-dd']);
  } catch(e) {
    console.log(e);
  }
  return date_return.toString('yyyy-MM-dd');
}

// Override the method that retrieve the events data
rise_against_module.processData = function(window) {
  winston.info('rise against processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var rows = $ ('.events-table > table > tr');

  var self = this;
  
  console.log('rise_against entries: ', rows.length);
  rows.slice(1).each (function (index) {
    var infos = $('td', this);
    
    var date = $('td.date > meta', this).attr('content');
    var venue = $(infos[1]).text().trim();
    var location = $(infos[2]).text().trim();
    
    results.push({ date: self.date (date), venue: venue, location: location });
    
    
  });

  return results;
};


module.exports = {
  crawlModule: rise_against_module
};
