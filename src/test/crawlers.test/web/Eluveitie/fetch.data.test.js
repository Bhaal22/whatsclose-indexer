var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';
var module = require(__base +  'crawlers/web/Eluveitie').crawlModule;

describe('Eluveitie Suite', function(){
  it('get Eluveitie Tour generation', function(done){

    module.crawlWebData().
      then (function (data) {
       
        var concerts = module.band.concerts;
	      console.log(concerts);
        expect(concerts).to.not.be.empty();
        console.log('Eluveitie found valid entries: ', concerts.length);
        done ();
      });
  });
});
