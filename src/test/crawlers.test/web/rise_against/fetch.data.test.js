var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';

var rise_against = require(__base + 'crawlers/web/rise_against').crawlModule;

describe('Rise Against Suite', function(){
  it('get Rise Against Tour generation', function(done){

    rise_against.crawlWebData().
      then (function (data) {
       
        var concerts = rise_against.band.concerts;
	console.log(concerts);
        expect(concerts).to.not.be.empty();

        done ();
      });
  });

  it('checks Rise Against stylez', function(done){

    rise_against.crawlWebData().
      then (function (data) {
       
        var styles = rise_against.band.styles;
        expect(styles[0]).to.equal("Melodic hardcore");
        expect(styles[1]).to.equal("punk rock");
        

        done ();
      });
  });
  
});
