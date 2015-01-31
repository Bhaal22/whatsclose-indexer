var Band = require(__base + 'model/Band');
var CrawlerModule = require(__base + 'model/CrawlerModule');
var winston = require('winston');
require('datejs');


var social_distortion_module = new CrawlerModule();
social_distortion_module.fullUrl = 'http://www.socialdistortion.com/tours';
social_distortion_module.band = new Band();
social_distortion_module.band.name = 'Social Distortion';
social_distortion_module.band.website = 'http://www.socialdistortion.com';

social_distortion_module.band.styles = ['Punk rock', 'Alternative rock', 'rockabilly', 'hardcore punk'];

// Override the method that assess the web page structure
social_distortion_module.testDataAcess = function() {
  return true;
};

social_distortion_module.date = function (d) {
  var date_part = d.split(' ')[1];

  var convert = Date.parseExact(date_part, 'MM/dd/yyyy')
  return convert.toString ('yyyy-MM-dd');
}

social_distortion_module.extract_location_information = function (location) {
  var regex = /\s+|\t+/g;
  var trimmed_location = location.replace (regex, ' ').trim();
  var split_location = trimmed_location.split ('@');
  return {
    location: split_location[0].trim(),
    venue: split_location[1].trim()
  };
}

// Override the method that retrieve the events data
social_distortion_module.processData = function(window) {
  winston.info('social distorsion processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  var dates_table = $('table > tbody');
  var rows = $ ('table > tbody > tr');

  var self = this;

  console.log('social_distortion entries: ', rows.length);
  rows.each (function (index) {   
    
    var date = $('td > strong', this).text().trim();
    var location = $('td', this).contents().filter(function () {
      return this.nodeType == 3;
    })[0].nodeValue;

    var location_information = self.extract_location_information(location);

    results.push({ date: self.date(date), 
                   location: location_information.location,
                   venue: location_information.venue
                 });
  });

  return results;
};


module.exports = {
  crawlModule: social_distortion_module
};
