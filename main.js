var Promise = require('es6-promise').Promise;

var volbeatModule = require('./bands/volbeat.js');
var tagadaModule = require('./bands/tagada_jones.js');
var fakeBandModule = require("./test/fake_band.js");

var indexerModule = require ('./bands/Indexer.js');
var geocoder = require('geocoder');
var sleep = require('sleep');

var band1 = new volbeatModule.Band();
var band2 = new tagadaModule.Band();
var fake = new fakeBandModule.Band ();

var indexer = new indexerModule.I ('concerts');


console.log('Starting bands indexer');
console.log(band1.toString());
console.log(band2.toString());

//var bands = [ band1, band2, fake ];
var bands = [ band1, band2];

var sequence = Promise.resolve ();

var promises = [];


bands.forEach (function (band) {
  promises.push (band.downloadRawDates ());
});

Promise.all(promises).then (function (promiseSequence) {
  console.log ("then %s", promiseSequence.length);

  var nb = promiseSequence.reduce (function (prev, current) {
    return prev + current.length;
  }, 0);

  console.log (nb);

  promiseSequence.forEach (function (promise) {
    console.log(promise.length);
    promise.forEach (function(concert) {
//      geocoder.geocode(concert.location, function ( err, data ) {
//        console.log ('sleeping');
//        sleep.usleep (500000);
//        console.log ("%s : %s", concert.location, data.results.length);
//        
//        if (data.status === 'OK') {
//          console.log (data.results[0].geometry); 
//          indexer.publish (concert);
//        }
//        else {
//          var notIndexedConcertIndex = 'concerts_in_error';
//          indexer.publish (concert, notIndexedConcertIndex);
//          console.log (data);
//        }
//      });
      
    	console.log ('sleeping');
    	console.log(concert.bandName);
    	console.log(concert.location);
    	indexer.publish(concert);
      
    });
  });

}); 

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
