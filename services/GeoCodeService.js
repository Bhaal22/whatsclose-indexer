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
        // concertsList.forEach (function (concert) {
        //   self.searchGeometry (concert);
        // });
			  for ( var i = 0; i < concertsList.length; i++) {
				  //self.searchGeometry (concertsList[i]);
				   self.searchGeometry(concertsList[i]).then(function(concert) {
					 eventEmitter.emit("geocode_ok", concert);
				  });
			  }
		  }
	  });
  },

  this.searchGeometry = function (concert) {

    var computeGeometry = function(concert) {
    	 var deferred = Q.defer();
    	 var location = concert.location;
    	
    	geocoder.geocode(location, function ( err, data ) {
	      sleep.usleep (500000);
	      console.log ("%s : %s", location, data.results.length);
	      
	      if ((data.status === 'OK') && (data.results.length == 1)) {
	        var geometry = data.results[0].geometry;
	        concert.geometry = geometry.location.lat + "," + geometry.location.lng;
          // eventEmitter.emit("geocode_ok", concert);
	        deferred.resolve(concert);
	      }
        else if ((data.status === 'OK') && (data.results.length > 1)) {
          eventEmitter.emit("geocode_multiple", {
            concert: concert,
            geometries: data.results
          });
        }
	      else {
	        var notIndexedConcertIndex = 'concerts_in_error';
	        //indexer.publish (concert, notIndexedConcertIndex);
	        winston.error("error getting geometry");
	        console.log (data);
	        deferred.resolve(concert);
	      }
	    });
    	
    	return deferred.promise;
    };
    
    return computeGeometry(concert);
    
  };
};



module.exports = new GeoCoderService();

