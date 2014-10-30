var Band = require('../../model/Band');
var CrawlerModule = require('../../model/CrawlerModule');
var winston = require('winston');
require('datejs');

var jquery = require('jquery');

var _module = new CrawlerModule();
_module.fullUrl = 'http://www.bandsintown.com/DarkTranquillity/upcoming_events';
_module.band = new Band();
_module.band.name = 'Arch Enemy';
_module.band.website = 'http://www.archenemy.net/';

_module.band.styles = ['power metal'];

// Override the method that assess the web page structure
_module.testDataAcess = function() {
  winston.info('sabaton testDataAcess');
  return true;
};

_module.date = function (d) {
  var date_return;
  try {
    var pair = d.split(/T/);

    date_return = Date.parseExact(pair[0], ['yyyy-MM-dd']);
  } catch(e) {
    console.log(e);
  }
  return date_return.toString('yyyy-MM-dd');
}

// Override the method that retrieve the events data
_module.processData = function(window) {
  winston.info('sabaton processDate');
  
  var $ = jquery(window);

  var results = [];
  var rows = $ ('.row-wrapper');

  var self = this;

  console.log('sabaton entries: ', rows.length - 1);
  rows.slice(1).each (function (index) {

    var parent_id = $(this).parent().attr('id');

    var regex = /concert-\d+$/;
    var match = parent_id.match(regex);

    if (match) {

      var date = $('div.table-date > time > meta', this).attr('content');
      var venue = $('div.table-venue', this).text();
      var location = $('div.table-city', this).text();

      results.push({ date: self.date(date), venue: venue, location: location });
    }
  });

  return results;
}


module.exports = {
  crawlModule: _module
};
