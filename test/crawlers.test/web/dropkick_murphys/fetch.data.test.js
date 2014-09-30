var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';

var dropkick = require(__base + 'crawlers/web/dropkick_murphys').crawlModule;

describe('Dropkick Murphys Suite', function(){
  it('get Dropkick Murphys Tour generation', function(done) {

    dropkick.crawlWebData().
      then (function (data) {
        var concerts = dropkick.band.concerts;
        expect(concerts).to.not.be.empty();

        done ();
      });
  });  
});
