var Promise = require('es6-promise').Promise;
var geocoder = require('geocoder');
var sleep = require('sleep');

function GeoCoderService () {
  
  this.resolve = function (location) {

    return new Promise (function(resolve, reject) {
      var geometry = [];
      geocoder.geocode(location, function ( err, data ) {
        
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
      });
    });
  }
};



module.exports = {
  geocodesvc: new GeoCoderService()
}

