var Band = require('../../model/Band');
var CrawlerModule = require('../../model/CrawlerModule');
var winston = require('winston');
require('datejs');

var jquery = require('jquery');

var _module = new CrawlerModule();
_module.fullUrl = 'http://archenemy.net/2014/index.php?go=tourdates';
_module.band = new Band();
_module.band.name = 'Arch Enemy';
_module.band.website = 'http://www.archenemy.net/';

_module.band.styles = ['Melodic death metal', 'Death Metal'];

// Override the method that assess the web page structure
_module.testDataAcess = function() {
  winston.info('Arch Enemy testDataAcess');
  return true;
};

_module.date = function (d) {
  var date_return;
  try {

    date_return = Date.parseExact(d, ['dd.MM.yyyy']);
  } catch(e) {
    console.log(e);
  }
  return date_return.toString('yyyy-MM-dd');
}

// Override the method that retrieve the events data
_module.processData = function(window) {
  winston.info('Arch Enemy processDate');
  
  var $ = jquery(window);

  var results = [];
  //var rows = $ ('span.newsTitle:contains("UPCOMING CONCERTS")');
  var text = $('div.divContentL').text();

  var self = this;

  var rows = text.split(/\n/);

  console.log('Arch Enemy entries: ', rows.length);
  rows.forEach (function (row) {
    
    var trim_row = row.trim();

    //02.11.2014 - Riddel Centre - Regina, SK (Canada) 
    var regex = /(\d\d\.\d\d\.\d\d\d\d) - ([\w\s]*) - (.*) \|.*/;
    var match = trim_row.match(regex);

    if (match) { 
      var date = match[1];
      var venue = match[2];
      var location = match[3];

      results.push({ date: self.date(date), venue: venue, location: location });
    }
  });
  
  return results;
}


module.exports = {
  crawlModule: _module
};
