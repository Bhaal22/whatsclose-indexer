var band = require('../bands/Band.js');

function Concert(date, location) {
  this.date = date;
  this.location = location;
}

function FakeVolbeat() {
  this.url = 'http://plop';
  this.datesPath = '/3/dats/';
  this.name = 'Volbeat';
  this.style = ['Metal'];
  this.concerts = [];
}

FakeVolbeat.prototype = new band.Band();
FakeVolbeat.prototype.extract_concert_information = function ($) {
  var dates_table = $('table.dates_list');
  
  var rows = $ ('.dates_list > tr');
  var band = this;
  rows.each (function (index) {

    var date = $('td.dates_date', this).text ();
    var location = $('td.dates_info2', this).text ();

    band.concerts.push (new Concert (new Date (date), location));
  });
}

module.exports = {
  Band: FakeVolbeat
};
