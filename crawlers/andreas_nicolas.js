var Band = require('../model/Band');
var CrawlerModule = require('../model/CrawlerModule');
var winston = require('winston');
require('datejs');


var band_module = new CrawlerModule();
band_module.fullUrl = 'http://www.andreasetnicolas.com/shows.php';
band_module.band = new Band();
band_module.band.name = 'Andréas et Nicolas';
band_module.band.website = 'http://www.andreasetnicolas.com';

band_module.band.styles = ['Punk rock', 'Monkey punk'];

// Override the method that assess the web page structure
band_module.testDataAcess = function() {
  return true;
};

band_module.date = function (d) {
  var convert = Date.parseExact(d, 'dd.MM.yy')
  return convert.toString ('yyyy-MM-dd');
}

// Override the method that retrieve the events data
band_module.processData = function(window) {
  winston.info('Andreas et Nicolas processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var dates = $('#showslist > table > td > span.date');
  var venues = $('#showslist > table > td > span.salle');
  var locations = $('#showslist > table > td > span.ville');

  var self = this;

  for (var i = 0; i < dates.length; i++) {
    var date = {
      date: self.date ($(dates[i]).text()),
      venue: $(venues[i]).text(),
      location: $(locations[i]).text()
    };

    results.push (date);
  }

  return results;
};


module.exports = {
  crawlModule: band_module
};
