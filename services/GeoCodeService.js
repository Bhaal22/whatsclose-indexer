var Q = require('q');
var geocoder = require('geocoder');
var sleep = require('sleep');

function GeoCoderService () {
  var outgoing_events = [ 'geocode_ok', 'geocode_multiple', 'geocode_error' ];
  var incoming_events = [ 'crawled' ];
  this.init = function () {
    
  },

  this.run = function (location) {
    var deferred = Q.defer();
    var geometry = [];

    var computeGeometry = function (data) {
      sleep.usleep (500000);
      console.log ("%s : %s", location, data.results.length);
      
      if (data.status === 'OK') {
        geometry = data.results[0].geometry;
        resolve (geometry);
      }
      else {
        var notIndexedConcertIndex = 'concerts_in_error';
        //indexer.publish (concert, notIndexedConcertIndex);
        console.log (data);
      }
    }

    geocoder.geocode(location, deferred.resolve).then (function (res) {
      computeGeometry (data);
    });
    
    return deferred.promise;
  }
};



module.exports = new GeoCoderService()

