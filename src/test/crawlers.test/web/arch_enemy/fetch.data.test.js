var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';

var band_module = require(__base + 'crawlers/web/arch_enemy').crawlModule;

describe('Arch Enemy Suite', function(){
  it('get Arch Enemy Tour generation', function(done) {

    band_module.crawlWebData().
      then (function (data) {
        var concerts = band_module.band.concerts;
        expect(concerts).to.not.be.empty();

        console.dir(concerts);
        done ();
      });
  });  
});
