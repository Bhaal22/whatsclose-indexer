var Band = require('../../model/Band');
var CrawlerModule = require('../../model/CrawlerModule');
var winston = require('winston');
require('datejs');


var rise_against_module = new CrawlerModule();
rise_against_module.fullUrl = 'http://www.dropkickmurphys.com/tour/';
rise_against_module.band = new Band();
rise_against_module.band.name = 'Dropkick Murphys';
rise_against_module.band.website = 'http://www.dropkickmurphys.com/';

rise_against_module.band.styles = ['Melodic hardcore', 'punk rock', 'hardcore punk'];

// Override the method that assess the web page structure
rise_against_module.testDataAcess = function() {
  winston.info('volbeat testDataAcess');
  return true;
};

rise_against_module.date = function (d) {
  var regex = /(\d+\/\d+)\s*-\s*(\d+\/\d+)\/(\d+)/;

  var date_return;
  var match = d.match(regex);

  if (match) {
    var first = match[1];
    var last = match[2];
    var year = match[3];
    
    try {
      date_return = Date.parseExact(first + '/' + year, ['MM/dd/yyyy', 
                                                         'MM/d/yyyy',
                                                         'M/dd/yyyy',
                                                         'M/d/yyyy']);
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
    date_return = Date.parseExact(d, ['MM/dd/yyyy', 
                                      'MM/d/yyyy',
                                      'M/dd/yyyy',
                                      'M/d/yyyy']);
    } catch(e) {
      console.log(e);
    }
  } 

  return date_return.toString('yyyy-MM-dd');
}

// Override the method that retrieve the events data
rise_against_module.processData = function(window) {
  winston.info('rise against processDate');

  var $ = require('jquery')(window);
  

  var results = [];
  // var rows = $ ('table.bit-events > tbody > tr');
  
  $( "#book" ).load(function() {

  var self = this;

  console.log('rise_against entries: ', rows.length - 1);
  rows.slice(1).each (function (index) {
    var infos = $('td', this);
    
    var date = $(infos[0]).text().trim();
    var location = $(infos[1]).text().trim();

    results.push({ date: self.date (date), location: location });
  });

  return results;
};


module.exports = {
  crawlModule: rise_against_module
};
