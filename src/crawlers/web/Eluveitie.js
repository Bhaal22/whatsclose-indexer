var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var band_module = new CrawlerModule();
band_module.fullUrl = 'http://eluveitie.ch/tour/';
band_module.band = new Band();
band_module.band.name = 'Eluveitie';
band_module.band.website = 'http://eluveitie.ch/';

band_module.band.styles = ['Folk Metal','Melodic Death Metal','Pagan Metal'];

// Override the method that assess the web page structure
band_module.testDataAcess = function(window) {
  var $ = require('jquery')(window);
  
  // tests on the page
  var tests = [
  ];

  return this.testDomElements(tests);

};

// Override the method that retrieve the events data
band_module.processData = function(window) {
  winston.info('Eluveitie processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var rows_datum = $ ('div.map-table > table > tbody > tr > td.tbl-datum');
  var rows_venue = $ ('div.map-table > table > tbody > tr > td.tbl-venue');
  var rows_location = $ ('div.map-table > table > tbody > tr > td.tbl-stadt');

  var self = this;

  console.log('Eluveitie entries: ', rows_datum.length);
  rows_datum.each (function (index) {

    console.log(index);
    
    var date = {
      date: self.date ($(rows_datum[index]).text()),
      venue: $(rows_venue[index]).text(),
      location: $(rows_location[index]).text()
    };
    
    results.push (date);
  });

  return results;
};

/*
 * Most simple date converter
 */
band_module.date = function (d) {
  var convert = Date.parseExact(d, 'dd.MM.yyyy');
  return convert.toString ('yyyy-MM-dd');
}

module.exports = {
  crawlModule: band_module
};
