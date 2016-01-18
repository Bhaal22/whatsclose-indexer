var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';
var bandModule = require(__base + 'crawlers/web/powerwolf').crawlModule;

describe('Powerwolf Suite', function(){
  it('get Powerwolf Tour generation', function(done){
    
    bandModule.crawlWebData().
      then (function (data) {
        
        var concerts = bandModule.band.concerts;
        
        console.log(concerts);
        expect(concerts).to.not.be.empty();
        
        done ();
      });
  });

  
});
