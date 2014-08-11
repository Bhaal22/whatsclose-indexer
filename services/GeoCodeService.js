var eventEmitter = require('./CustomEventEmitter');
var Q = require('q');
var geocoder = require('geocoder');
var sleep = require('sleep');

function GeoCoderService () {
  var outgoing_events = [ 'geocode_ok', 'geocode_multiple', 'geocode_error' ];
  var incoming_events = [ 'crawled' ];
  this.moduleName = "GeoCoderService";
  
  this.init = function () {
	  var self = this;
	  eventEmitter.on("crawled", function(crawledModule) {
		 if (crawledModule) {
			 var concertsList = crawledModule.band.concerts;
			 for ( var i = 0; i < concertsList.length; i++) {
				var concert = concertsList[i];
				
				self.searchGeometry(concert.location).then(function(geo) {
					concert.geometry = geo.location.lat + "," + geo.location.lng;
					eventEmitter.emit("index", concert);
				});
			}
		 }
	  });
  },

  this.searchGeometry = function (location) {
    var geometry = {};

    var computeGeometry = function(location) {
    	var deferred = Q.defer();
    	
    	geocoder.geocode(location, function ( err, data ) {
    		var geometry = [];
	        sleep.usleep (500000);
	        console.log ("%s : %s", location, data.results.length);
	        
	        if (data.status === 'OK') {
	          geometry = data.results[0].geometry;
	          deferred.resolve (geometry);
	        }
	        else {
	          var notIndexedConcertIndex = 'concerts_in_error';
	          //indexer.publish (concert, notIndexedConcertIndex);
	          winston.error("error getting geometry");
	          console.log (data);
	          deferred.resolve (geometry);
	        }
	    });
    	
    	return deferred.promise;
    };
    
    return computeGeometry(location);
    
  };
};



module.exports = new GeoCoderService();

