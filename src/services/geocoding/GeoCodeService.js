var Q = require('q');
var geocoder = require('geocoder');

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
  this.concerts = [];
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

  processSingleConcert: function (concert) {
    var retry = 0;
    var max_retries = 5;

    var self = this;
    self.searchGeometryWithRetry(concert, retry, max_retries).then (function (data) {
      if (data.results.length === 0) {
        var send = {
          bandName: concert.bandName,
          date: concert.date,
          location: concert.location,
          styles: concert.styles,
          geometries: []
        };
        
        eventEmitter.emit(GEOCODE_MULTIPLE, send);
      }
      else if (data.results.length === 1) {
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
                geometry: {
                  lat: geometry.geometry.location.lat,
                  lon: geometry.geometry.location.lng
                }
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
  },
  
  init: function () {
	  var self = this;

    var interval = setInterval(function() {
      if (self.concerts.length > 0) {
        var concert = self.concerts.shift();
        self.processSingleConcert(concert);
      }
    }, 200);
    
	  eventEmitter.on(CRAWLED_EVENT, function(crawledModule) {
      winston.info ("starting geocoding ...");

		  if (crawledModule) {
			  self.concerts.push.apply(self.concerts, crawledModule.band.concerts);
        
      };
    });
  },

  searchGeometry: function (concert) {
    var geocoderPromisify = Q.nbind(geocoder.geocode, geocoder);
    var location = concert.location;

    return geocoderPromisify(location).then (function (data) {
      var deferred = Q.defer ();

      try {
	      if (data.status === 'OK') {
          deferred.resolve (data);
	      }
        else if (data.status === 'ZERO_RESULTS') {
          deferred.resolve(data);
        }
	      else {
          winston.error(data.status);
          winston.info ('ERROR received. ' + data.status + ' Retry in progress');
          deferred.reject(Error (location));
	      }
      }
      catch(e) {
        console.log ('exception %s', e);
      }
      
      return deferred.promise;
    });
  },

  searchGeometryWithRetry: function(concert, retry, max_retries) {
    var self = this;
    retry || (retry = 0);


    return self.searchGeometry(concert).fail(function (err) {
      if (retry >= max_retries)
        throw err;

      // wait some time and try again
      return Q.delay(5000).then(function () {
        console.log("SearchGeometry Retry " + retry + "/" + max_retries);
        return self.searchGeometryWithRetry(concert, ++retry, max_retries);
      });
    });
  }
};

module.exports = new GeoCoderService();

