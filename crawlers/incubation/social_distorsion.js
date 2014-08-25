var Band = require('../model/Band');
var CrawlerModule = require('../model/CrawlerModule');
var winston = require('winston');
require('datejs');


var social_distortion_module = new CrawlerModule();
social_distortion_module.fullUrl = 'http://www.socialdistortion.com/tours';
social_distortion_module.band = new Band();
social_distortion_module.band.name = 'Social Distorsion';
social_distortion_module.band.website = 'http://www.socialdistortion.com';

social_distortion_module.band.styles = ['Punk rock', 'Alternative rock', 'rockabilly', 'hardcore punk'];

// Override the method that assess the web page structure
social_distortion_module.testDataAcess = function() {
  return true;
};

social_distortion_module.date = function (d) {
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
social_distortion_module.processData = function(window) {
  winston.info('social distorsion processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var dates_table = $('table > tbody');
  var rows = $ ('table > tbody > tr');

  var self = this;

  console.log('social_distortion entries: ', rows.length - 1);
  rows.slice(1).each (function (index) {
    var infos = $('td', this);
    
    var date = $(infos[0]).text().trim();
    var location = $(infos[1]).text().trim();
    
    results.push({ date: date, location: location });
  });

  return results;
};


module.exports = {
  crawlModule: social_distortion_module
};
