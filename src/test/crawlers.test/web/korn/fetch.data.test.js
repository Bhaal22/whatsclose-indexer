var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';

var tagada = require(__base + 'crawlers/web/incubation/korn').crawlModule;

describe('Korn Suite', function(){
  it('get Korn Tour generation', function(done) {

    tagada.crawlWebData().
      then (function (data) {
        var concerts = tagada.band.concerts;

        console.dir(concerts);

        concerts.forEach(function(concert) {
          console.log(concert.venue);
        });
        expect(concerts).to.not.be.empty();

        done ();
      });
  });  
});
