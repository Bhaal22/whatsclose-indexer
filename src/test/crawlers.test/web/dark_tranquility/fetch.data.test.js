var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';

var dt = require(__base + 'crawlers/web/dark_tranquility').crawlModule;

describe('DT Suite', function(){
  it('get DT Tour generation', function(done) {

    dt.crawlWebData().
      then (function (data) {
        var concerts = dt.band.concerts;
	console.log(concerts);
        expect(concerts).to.not.be.empty();
        done ();
      });
  });  
});
