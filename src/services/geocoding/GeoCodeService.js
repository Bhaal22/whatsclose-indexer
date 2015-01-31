// TO REFACTOR

var Q = require('q');
var geocoder = require('geocoder');
var sleep = require('sleep');

var eventEmitter = require(__base + 'services/CustomEventEmitter');
var winston = require(__base + 'services/CustomWinston.js');


/** listened events **/
var CRAWLED_EVENT = 'crawled';

/** fired events **/
var GEOCODE_OK = 'geocode_ok';
var GEOCODE_MULTIPLE = 'geocode_multiple';
var GEOCODE_ERROR = 'geocode_error';

/** attributes **/
function GeoCoderService(name) {
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;
    
    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

/** methods **/
GeoCoderService.prototype = {
  filter_locations: function(locations) {
    
    var address_component_is_city = function (element, index, array) {
      var ret = element.types.indexOf('locality');
      return ret != -1;
    };

    var ret = locations.filter (function(element) {
      return address_component_is_city(element);
    });

    if (ret.length === 0) 
      return locations;
    return ret;
  },

  init: function () {
	  var self = this;
	  eventEmitter.on(CRAWLED_EVENT, function(crawledModule) {
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
        	    eventEmitter.emit(GEOCODE_OK, concert);
            }
            else {
              var filtered_cities = self.filter_locations(data.results);
 
              if (filtered_cities.length > 1) {

                var location = concert.location;
                winston.warn ("multiple geometries for location %s %d", location, filtered_cities.length);
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
                    styles: concert.styles,
                    geometries: geometries
                  };
                  
                  eventEmitter.emit(GEOCODE_MULTIPLE, send);
                }
                catch (e) {
                  console.log (e);
                  console.log(e.stack);
                }
              }
              else if (filtered_cities.length == 1) {
                var geometry = filtered_cities[0].geometry;

                concert.geometry = {
                  lat: geometry.location.lat,
                  lon: geometry.location.lng
                };
        	      eventEmitter.emit(GEOCODE_OK, concert);
              }
            }
            
          }).fail (function (error) {
            winston.error("error getting geometry");
            console.log(concert.location);
	          console.log (error.stack);
            eventEmitter.emit (GEOCODE_ERROR, error);
          });
        });
		  }
	  });
  },

  searchGeometry: function (concert) {
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
  }
};

module.exports = new GeoCoderService();

