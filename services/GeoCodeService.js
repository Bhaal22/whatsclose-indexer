var eventEmitter = require('./CustomEventEmitter');
var Q = require('q');
var geocoder = require('geocoder');
var sleep = require('sleep');
var winston = require('./CustomWinston.js');

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


        concertsList.forEach (function (concert) {
          self.searchGeometry(concert).then (function (data) {
            if (data.results.length === 1) {
        	    var geometry = data.results[0].geometry;
              
        	    concert.geometry = {
                lat: geometry.location.lat,
                lon: geometry.location.lng 
              };
        	    eventEmitter.emit("geocode_ok", concert);
            }
            else {
              var location = concert.location;
              winston.warn ("multiple geometries for location %s %d", location, data.results.length);
              try {
                var geometries = data.results.map (function (geometry) {
                  
                  var conv = {
                    formatted_address: geometry.formatted_address,
                    lat: geometry.geometry.location.lat,
                    lon: geometry.geometry.location.lng
                  };
                  
                  return conv;
                });

                var send = {
                  bandName: concert.bandName,
                  date: concert.date,
                  location: concert.location,
                  styles: concert.style,
                  geometries: geometries
                };

                eventEmitter.emit("geocode_multiple", send);
              } catch (e) {
                console.log (e);
                console.log(e.stack);
              }
            }
            
          }).fail (function (error) {
            winston.error("error getting geometry");
	          console.log (error.stack);
            eventEmitter.emit ("geocode_error", error);
          });
        });
		  }
	  });
  },

  this.searchGeometry = function (concert) {
    var geocoderPromisify = Q.nbind(geocoder.geocode, geocoder);
    var location = concert.location;

    return geocoderPromisify(location).then (function (data) {
      var deferred = Q.defer ();
      sleep.usleep (500000);

      try {
        
	      if (data.status === 'OK') {
          deferred.resolve (data);
	      }
	      else {
          winston.error (data);
          deferred.reject(Error (location));
	      }
      } catch(e) {
        console.log ('exception %s', e);
      }

      return deferred.promise;
    }).fail (function (err) {
      console.log (err);
    });
  };
};



module.exports = new GeoCoderService();

