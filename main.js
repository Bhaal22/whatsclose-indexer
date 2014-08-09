var Promise = require('es6-promise').Promise;

var volbeatModule = require('./bands/volbeat.js');
var tagadaModule = require('./bands/tagada_jones.js');
var fakeBandModule = require("./test/fake_band.js");

var indexerModule = require ('./bands/Indexer.js');

var band1 = new volbeatModule.Band();
var band2 = new tagadaModule.Band();
var fake = new fakeBandModule.Band ();

var indexer = new indexerModule.I ();

var geocodesvc = require ('./GeoCodeService').geocodesvc;

console.log('Starting bands indexer');
console.log(band1.toString());
console.log(band2.toString());

var bands = [ band1, band2];

var promises = [];


// bands.forEach (function (band) {
//   promises.push (band.downloadRawDates ());
// });

// Promise.all (promises).then (function (bandPromises) {
//   console.log (bandPromises.length);

//   Promise.all (bandPromises).then (function (concertPromises) {
//     console.log (concertPromises.length);

//     Promise.all (concertPromises).then (function (concertPromise) {
//       console.log (concertPromise.length);
//       return geocodesvc.resolve (concertPromise);
//     }).then (function (geometry) { 
//       console.log (geometry);
//     });
//   });
// });
var p = [];
bands.forEach (function (band) {
  band.downloadRawDates().then (function (concerts) {

    concerts.forEach (function (concert) {
      geocodesvc.resolve(concert.location).then (function (geo) {
        console.log(geo);
      });
    });
  });
});

// Promise.all (promises).then (function (bandPromises) {
//   console.log (bandPromises.length);
//   return bandPromises;
  
// }).then (function (

// Promise.all(promises).then (function (promiseSequence) {
//   console.log ("then %s", promiseSequence.length);

//   var nb = promiseSequence.reduce (function (prev, current) {
//     return prev + current.length;
//   }, 0);

//   console.log (nb);

//   promiseSequence.forEach (function (promise) {
//     console.log(promise.length);

//     var geocodepromises = [];

//     promise.forEach (function(concert) {
//       var location = concert.location;
//       geocodepromises.push (geocodesvc.resolve (location));

//       Promise.all (geocodepromises). then (function (geocodesPromiseSequence) {
//         geocodesPromiseSequence.forEach (function (geocodePromise) {
//           console.log (geocodePromise);
//         });
//       });
//     });
      
// //    	console.log ('sleeping');
// //    	console.log(concert.bandName);
// //    	console.log(concert.location);
//     	//indexer.publish(concert);
      
//   });
// }); 

// bands.reduce (function (promiseSequence, band) {
//   return promiseSequence.then (function () {
//     return band.downloadRawDates ();
//   }).then (function (concerts) {
//     console.log ("then %s", response.length);

//     concerts.map (function (concert) {
//       console.log (concert);
//     });
//   });
// });

// var concertsToIndex = 0;

// band1.downloadRawDates (function (concerts) {
//   console.log (concerts);

//   concerts.map (function (concert) {
//     indexer.publish (concert);
//   });

//   concertsToIndex = concertsToIndex + concerts.length;
//   console.log ("%d concerts to index" , concerts.length);
// });

// console.log(band2.toString());

// band2.downloadRawDates (function (concerts) {
//   console.log (concerts);
  
//     concerts.map (function (concert) {
//       indexer.publish (concert);
//     });

//   concertsToIndex = concertsToIndex + concerts.length;
//   console.log ("%d concerts to index" , concerts.length);
// });

// band1.downloadRawDates ().then (function(response) {
  
// });

// console.log ("%d concerts to index" , concertsToIndex);
