var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var band_module = new CrawlerModule();
band_module.fullUrl = 'http://www.powerwolf.net/2011/tour.htm';
band_module.band = new Band();
band_module.band.name = 'Powerwolf';
band_module.band.website = 'http://www.powerwolf.net';

band_module.band.styles = ['Power Metal'];

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
  winston.info('Powerwolf processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var rows = $('div#contentleft > table > tr');

  var self = this;

  console.log(rows.length);
  var idx = 1;
  rows.each(function (index) {
    var str = $(this).text().trim();
    if (str != '') {
    
      var dt = $('td.date', this).text().trim();
      console.log(dt);
      
      var venue = $('td.venue', this).text().trim();
      console.log(venue);
      var location = $('td.city', this).text().trim();
      console.log(location);
      
      console.log(idx);
      var date = {
        date: self.date (dt),
        venue: venue,
        location: location
      };

      results.push (date);
      idx = idx+1;
    }
  });

  return results;
};

/*
 * Most simple date converter
 */
band_module.date = function (d) {
  var regex = /^(\d+)\.-\s*(\d+)\.(\d+)\.(\d+)$/;
  var regex2 = /^(\d+\.\d+)\.-\s*(\d+\.\d+)\.(\d+)$/;

  var date_return;
  var match = d.match(regex);

  if (match) {
    var first = match[1];
    var last = match[2];
    var month = match[3];
    var year = match[4];

    try {
      date_return = Date.parseExact(first + '.' + month + '.' + year, ['dd.MM.yyyy']);
    } catch (e) {
      console.log(e);
    }
  }
  else {
    var match2 = d.match(regex2);
    
    if (match2) {
      var first = match2[1];
      var last = match2[2];
      var year = match2[3];
      
      try {
        date_return = Date.parseExact(first + '.' + year, ['dd.MM.yyyy']);
      } catch (e) {
        console.log(e);
      }
    }
    else {
      try {
        date_return = Date.parseExact(d, ['dd.MM.yyyy']);
      } catch(e) {
        console.log(e);
      }
    }
  } 

  return date_return.toString('yyyy-MM-dd');
}

module.exports = {
  crawlModule: band_module
};
