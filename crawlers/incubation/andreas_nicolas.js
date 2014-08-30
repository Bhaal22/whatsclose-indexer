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
  var date_part = d.split(' ')[1];

  var convert = Date.parseExact(date_part, 'MM/dd/yyyy')
  return convert.toString ('yyyy-MM-dd');
}

band_module.extract_location_information = function (location) {
  var regex = /\s+|\t+/g;
  var trimmed_location = location.replace (regex, ' ').trim();
  var split_location = trimmed_location.split ('@');
  return {
    location: split_location[0].trim(),
    venue: split_location[1].trim()
  };
}

// Override the method that retrieve the events data
band_module.processData = function(window) {
  winston.info('social distorsion processDate');

  var $ = require('jquery')(window);
  
  var results = [];
  //var rows = $ ('table > tbody > tr');
  var dates = $('#showslist > table > td > span.date');
  var venues = $('#showslist > table > td > span.salle');
  var locations = $('#showslist > table > td > span.ville');

  var self = this;

  console.log(band_module.band.name, ' entries: ', dates.length);
  console.log(band_module.band.name, ' entries: ', venues.length);
  console.log(band_module.band.name, ' entries: ', locations.length);
  // rows.each (function (index) {   
    
  //   var date = $('span.class', this).text().trim();
  //   var location = $('td', this).contents().filter(function () {
  //     return this.nodeType == 3;
  //   })[0].nodeValue;

  //   console.log(date);
  //   var location_information = self.extract_location_information(location);

  //   results.push({ date: date, 
  //                  location: location_information.location,
  //                  venue: location_information.venue
  //                });
  // });

  return results;
};


band_module.exports = {
  crawlModule: social_distortion_module
};
