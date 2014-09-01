var request = require('superagent');
var expect = require('expect.js');

var andreas_nicolas = require('../../../crawlers/incubation/andreas_nicolas').crawlModule;

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
});
