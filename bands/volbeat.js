var band = require('./Band.js');

function Volbeat() {
  this.url = 'http://www.volbeat.dk';
  this.datesPath = '/3/dates/';
  this.name = 'Volbeat';
  this.style = ['Metal'];
}

Volbeat.prototype = new band.Band();
Volbeat.prototype.extract_concert_information = function ($) {
  var dates_table = $('table.dates_list');
  
  var rows = $ ('.dates_list > tr');
  var currentBand = this;
  rows.each (function (index) {

    var date = $('td.dates_date', this).text ();
    var location = $('td.dates_info2', this).text ();

    currentBand.concerts.push (new band.Concert (currentBand.name, new Date (date), location));
  });
}

module.exports = {
  Band: Volbeat
};
