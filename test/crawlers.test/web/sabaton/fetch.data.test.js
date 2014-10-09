var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';

var band = require(__base + 'crawlers/web/incubation/sabaton').crawlModule;

describe('Sabaton Suite', function(){
  it('get Sabaton Tour generation', function(done) {

    band.crawlWebData().
      then (function (data) {
        var concerts = band.band.concerts;
        expect(concerts).to.not.be.empty();

        done ();
      });
  });  
});
