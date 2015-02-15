var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var band_module = new CrawlerModule();
band_module.fullUrl = 'http://www.skalmold.is/Shows';
band_module.band = new Band();
band_module.band.name = 'Skálmöld';
band_module.band.website = 'http://www.skalmold.is/';

band_module.band.styles = ['Folk metal','viking metal','pagan metal'];

// Override the method that assess the web page structure
band_module.testDataAcess = function(window) {
  var $ = require('jquery')(window);
  
  // tests on the page
  var tests = [
    /** examples
    {
      elt: $('div#show > div.sprite1 > h4').text(),
      nullable: false,
      expectedValue: 'Spectacles (vivants)'
    },
    {
      elt: $('table.show_table').length,
      nullable: false,
      expectedValue: 1
    } */
  ];

  return this.testDomElements(tests);

};

// Override the method that retrieve the events data
band_module.processData = function(window) {
  winston.info('Skálmöld processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var dates = []; //jquery query to get dates 

  var self = this;

  for (var i = 0; i < dates.length; i++) {

    var date = {
      date: self.date (''),
      venue: ''; 
      location: '';
    };

    results.push (date);
  }

  return results;
};

/*
 * Most simple date converter
 */
band_module.date = function (d) {
  var convert = Date.parseExact(d, 'yyyy-MM-dd')
  return convert.toString ('yyyy-MM-dd');
}

module.exports = {
  crawlModule: band_module
};
