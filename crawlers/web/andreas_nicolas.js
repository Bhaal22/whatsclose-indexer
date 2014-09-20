var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var band_module = new CrawlerModule();
band_module.fullUrl = 'http://www.andreasetnicolas.com/shows.php';
band_module.band = new Band();
band_module.band.name = 'Andréas et Nicolas';
band_module.band.website = 'http://www.andreasetnicolas.com';

band_module.band.styles = ['Punk rock', 'Monkey punk'];

// Override the method that assess the web page structure
band_module.testDataAcess = function(window) {
  var $ = require('jquery')(window);
  
  // tests on the page
  var tests = [
    {
      elt: $('img.header_logo').attr('alt'),
      nullable: false,
      expectedValue: 'Andréas & Nicolas.com'
    },
    {
      elt: $('div#showslist').length,
      nullable: false,
      expectedValue: 1
    }
  ]

  return this.testDomElements(tests);

};

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


band_module.date = function (d) {
  var convert = Date.parseExact(d, 'dd.MM.yy')
  return convert.toString ('yyyy-MM-dd');
}

module.exports = {
  crawlModule: band_module
};
