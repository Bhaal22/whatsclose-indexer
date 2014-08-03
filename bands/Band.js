var Promise = require('es6-promise').Promise;
var http = require('http');
var env = require('jsdom').env;

function Concert(date, location) {
  this.date = date;
  this.location = location;
  this.geometry = {};
}

function Band() {
  this.url = '';
  this.datesPath = '';
  this.name = '';
  this.style = [];

  this.last_indexed = new Date ();
}

Band.prototype.toString = function () {
  return 'Band:' + this.name + '(' + this.url + this.datesPath + ')';
}

Band.prototype.getRawConcertInformation = function (data) {
  var band = this;

  return new Promise (function (resolve, reject) {
    env(data, function (errors, window) {
      if (errors != null)
        reject (errors);
      
      var $ = require('jquery')(window);
      
      band.extract_concert_information ($);
      
      
      resolve(band.concerts);
    });
  });
}

Band.prototype.downloadRawDates = function () {
  var url = this.url + this.datesPath;
  var band = this;

  return new Promise (function (resolve, reject) {
    console.log('Fetching data from %s', url);
    
    http.get(url, function (res) {
      var data = "";
      res.on('data', function (chunk) {
        data += chunk;
      });
      
      res.on('end', function () {
        console.log('end %s', band.toString ());
        band.getRawConcertInformation (data).then (function (response) {
         resolve(band.concerts);
        });
      }).on('error', function(e) {
        console.log('error');
        reject([]);
      });
    }).on ('error', function (e) {
      resolve ([]);
    });
  });
}


module.exports = {
  Band: Band,
  Concert: Concert
};
