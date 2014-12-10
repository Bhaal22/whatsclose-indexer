var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';

var andreas_nicolas = require(__base + 'crawlers/web/andreas_nicolas').crawlModule;

describe('Andreas et Nicolas Suite', function(){
  it('get Andreas et Nicolas Tour generation', function(done){

    andreas_nicolas.crawlWebData().
      then (function (data) {
       
        var concerts = andreas_nicolas.band.concerts;

        expect(concerts).to.not.be.empty();

        done ();
      });
  });

  it('checks Andreas et Nicolas stylez', function(done){

    andreas_nicolas.crawlWebData().
      then (function (data) {
       
        var styles = andreas_nicolas.band.styles;
        expect(styles[1]).to.equal("Monkey punk");
        

        done ();
      });
  });

  it('checks Andreas et Nicolas venues', function(done){

    andreas_nicolas.crawlWebData().
      then (function (data) {
       
        var concerts = andreas_nicolas.band.concerts;
        expect(concerts[0].venue).not.to.be.equal("");

        console.log(concerts[0].location);
        expect(concerts[0].location).not.to.be.equal("");
        

        done ();
      });
  });

  
});
