var eventEmitter = require('./CustomEventEmitter');
var Q = require('q');
var geocoder = require('geocoder');
var sleep = require('sleep');

function GeoCoderService () {
  var outgoing_events = [ 'geocode_ok', 'geocode_multiple', 'geocode_error' ];
  var incoming_events = [ 'crawled' ];
  this.moduleName = "GeoCoderService";
  
  this.init = function (winston) {
    this.logger = winston;
	  var self = this;
	  eventEmitter.on("crawled", function(crawledModule) {
      this.logger.info ("starting geocoding ...");
		  if (crawledModule) {
			  var concertsList = crawledModule.band.concerts;
        // concertsList.forEach (function (concert) {
        //   self.searchGeometry (concert);
        // });
			  for ( var i = 0; i < concertsList.length; i++) {
				  //self.searchGeometry (concertsList[i]);
				   self.searchGeometry(concertsList[i]).then(function(data) {

             if (data.length === 1) {
               concert.geometry = data[0];
					     eventEmitter.emit("geocode_ok", concert);
             }
             else {
               winston.warn ("multiple geometries for laction %s", concert.location);
               eventEmitter.emit("geocode_multiple", { 
                 concert: concert,
                 geometries: data
               });
             }

				   }).catch (function (data) {
             eventEmitter.emit ("geocode_error", concert);
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
	      
	      if (data.status === 'OK') {
	        var geometry = data.results[0].geometry;

	        concert.geometry = geometry.location.lat + "," + geometry.location.lng;
          // eventEmitter.emit("geocode_ok", concert);
	        deferred.resolve(data.results);
	      }
	      else {
	        this.logger.error("error getting geometry");
	        console.log (data);
	        deferred.resolve(Error (location));
	      }
	    });
    	
    	return deferred.promise;
    };
    
    return computeGeometry(concert);
    
  };
};



module.exports = new GeoCoderService();

