var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var band_module = new CrawlerModule();
band_module.fullUrl = 'http://www.espaceleoferre.mc/';
band_module.band = new Band();
band_module.band.name = 'LF Monaco';
band_module.band.website = 'http://www.espaceleoferre.mc/';

band_module.band.styles = ['Variété'];

// Override the method that assess the web page structure
band_module.testDataAcess = function(window) {
  var $ = require('jquery')(window);
  
  // tests on the page
  var tests = [
    {
      elt: $('ul#listeEven').length,
      nullable: false,
      expectedValue: 1
    }
  ]

  return true;

};

// Override the method that retrieve the events data
band_module.processData = function(window) {
  winston.info('LF Monaco processDate');


  var $;
  try{
    $ = require('jquery')(window);
    //$ = window.jQuery;
  }
  catch (err){
    winston.error('TOO BAD DUDE : ' + err);
  }
  
  

  var results = [];
  var locations = 'Espace Leo Ferre, Monaco';
  var dates = $('ul#listeEven span.date');
  var venues = $('ul#listeEven span.titre');
  
  var self = this;

  for (var i = 0; i < dates.length; i++) {

    var full_location = $(locations[i]).text();
    var date = {
      date: $(dates[i]).text(),
      venue: $(venues[i]).text().replace('"', '\''),
      location: locations
    };

    results.push (date);
  }

  return results;
};


band_module.date = function (d) {
  var convert = Date.parseExact(d, 'dd.MM.yy')
  return convert.toString ('yyyy-MM-dd');
}

module.exports = {
  crawlModule: band_module
};
