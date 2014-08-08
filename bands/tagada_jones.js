var band = require('./Band.js');

function TagadaJones() {
  this.url = 'http://www.tagadajones.com';
  this.datesPath = '/new/#/Dates/';
  this.name = 'Tagada Jones';
  this.style = ['Punk', 'HardCore'];
  this.concerts = [];
}

TagadaJones.prototype = new band.Band();
TagadaJones.prototype.extract_concert_information = function ($) {
  var dates_table = $('table.dates_list');
  
  var rows = $ ('#scroll-content-dates > ul > li');
  var currentBand = this;
  rows.each (function (index) {

    var date = $('span.DateDate', this).text ();
    var fullLocation = $(this).text ();
    
    var location = fullLocation.split ('\n')[2].trim (); 
    var dateElements = date.split ("/");

    currentBand.concerts.push (new band.Concert (currentBand.name, new Date (dateElements[2], dateElements[1], dateElements[0]),
                                                 location));
  });
}

module.exports = {
  Band: TagadaJones
};
