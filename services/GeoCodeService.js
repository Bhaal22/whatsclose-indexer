var eventEmitter = require('./CustomEventEmitter');
var Q = require('q');
var geocoder = require('geocoder');
var sleep = require('sleep');
var winston = require('winston');

function GeoCoderService () {
  var outgoing_events = [ 'geocode_ok', 'geocode_multiple', 'geocode_error' ];
  var incoming_events = [ 'crawled' ];
  this.moduleName = "GeoCoderService";
  
  this.init = function () {
	  var self = this;
	  eventEmitter.on("crawled", function(crawledModule) {
      winston.info ("starting geocoding ...");
		  if (crawledModule) {
			  var concertsList = crawledModule.band.concerts;


			  for ( var i = 0; i < concertsList.length; i++) {
				  self.searchGeometry(concertsList[i]);
			  }
		  }
	  });
  },

  this.searchGeometry = function (concert) {

    var geocoderPromisify = function(location) {
      var deferred = Q.defer();

      geocoder.geocode(location, function (err, data) {
        if (err) deferred.reject(err);
        else deferred.resolve(data);
      });
      return deferred.promise;
    };


    //var geocoderPromisify = Q.denodify(geocoder.geocode);

    var location = concert.location;

    geocoderPromisify(location).then (function (data) {
      sleep.usleep (500000);
	    //console.log (data);

      try {
        
	      if (data.status === 'OK') {
          if (data.results.length === 1) {
        	  var geometry = data.results[0].geometry;
        	  concert.geometry = geometry.location.lat + "," + geometry.location.lng;
        	  eventEmitter.emit("geocode_ok", concert);
          }
          else {
            winston.warn ("multiple geometries for laction %s", location);
            eventEmitter.emit("geocode_multiple", { 
              concert: concert,
              geometries: data.results
            });
          }
	      }
	      else {
	        winston.error("error getting geometry");
	        console.log (data);
          eventEmitter.emit ("geocode_error", concert);
	        //deferred.resolve(Error (location));
	      }
      } catch(e) {
        console.log ('exception %s', e);
      }
    });
  };
};



module.exports = new GeoCoderService();

