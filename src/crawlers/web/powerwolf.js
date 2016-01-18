var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var band_module = new CrawlerModule();
band_module.fullUrl = 'http://www.bandsintown.com/Powerwolf';
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
  winston.info('dropkick processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var rows = $ ('.events-table table tr');

  var self = this;

  console.log('dropkick entries: ', rows.length - 1);
  rows.slice(1).each (function (index) {
    var infos = $('td', this);
    
    var date = $('td.date meta', this).attr('content');
    var venue = $(infos[1]).text().trim();
    var location = $(infos[2]).text().trim();

    results.push({ date: self.date (date), venue: venue, location: location });
  });

  return results;
};

band_module.date = function (d) {
  var date_return;
  try {
    date_return = Date.parseExact(d, ['yyyy-MM-dd']);
  } catch(e) {
    console.log(e);
  }
  return date_return.toString('yyyy-MM-dd');
}

module.exports = {
  crawlModule: band_module
};
