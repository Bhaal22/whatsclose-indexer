var Band = require('../model/Band');
var CrawlerModule = require('../model/CrawlerModule');
var winston = require('winston');


var rise_against_module = new CrawlerModule();
rise_against_module.fullUrl = 'http://www.riseagainst.com/tour';
rise_against_module.band = new Band();
rise_against_module.band.name = 'Rise Against';
rise_against_module.band.website = 'http://www.riseagainst.com/';

rise_against_module.style = ['Melodic hardcore', 'punk rock', 'hardcore punk'];

// Override the method that assess the web page structure
rise_against_module.testDataAcess = function() {
  winston.info('volbeat testDataAcess');
  return true;
};

rise_against_module.date = function (d) {
  var regex = /(\d+\/\d+)-(\d+\/\d+)\/(\d+)/;

  var date_return;
  var match = d.match(regex);

  if (match) {
    var first = match[1];
    var last = match[2];
    var year = match[3];
    
    date_return = new Date(first + '/' + year);
  } else {
    date_return = new Date(d);
  } 

  return date_return;
}

// Override the method that retrieve the events data
rise_against_module.processData = function(window) {
  winston.info('rise against processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var dates_table = $('table > tbody');
  var rows = $ ('table > tbody > tr');

  var self = this;

  console.log (rows.length);
  rows.slice(1).each (function (index) {
    var infos = $('td', this);
    
    var date = $(infos[0]).text();
    var location = $(infos[1]).text();

    results.push({ date: self.date (date), location: location });
  });

  return results;
};


module.exports = {
  crawlModule: rise_against_module
};
