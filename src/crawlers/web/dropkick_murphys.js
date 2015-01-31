var Band = require('../../model/Band');
var CrawlerModule = require('../../model/CrawlerModule');
var winston = require('winston');
require('datejs');


var _module = new CrawlerModule();
_module.fullUrl = 'http://www.bandsintown.com/DropkickMurphys/upcoming_events';
_module.band = new Band();
_module.band.name = 'Dropkick Murphys';
_module.band.website = 'http://www.dropkickmurphys.com/';

_module.band.styles = ['Melodic hardcore', 'punk rock', 'hardcore punk'];

// Override the method that assess the web page structure
_module.testDataAcess = function() {
  winston.info('dropkick testDataAcess');
  return true;
};

_module.date = function (d) {
  var date_return;
  try {
    date_return = Date.parseExact(d, ['yyyy-MM-dd']);
  } catch(e) {
    console.log(e);
  }
  return date_return.toString('yyyy-MM-dd');
}

// Override the method that retrieve the events data
_module.processData = function(window) {
  winston.info('dropkick processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var rows = $ ('.events-table > table > tr');

  var self = this;

  console.log('dropkick entries: ', rows.length - 1);
  rows.slice(1).each (function (index) {
    var infos = $('td', this);
    
    var date = $('td.date > meta', this).attr('content');
    var venue = $(infos[1]).text().trim();
    var location = $(infos[2]).text().trim();

    results.push({ date: self.date (date), venue: venue, location: location });
  });

  return results;
}


module.exports = {
  crawlModule: _module
};
