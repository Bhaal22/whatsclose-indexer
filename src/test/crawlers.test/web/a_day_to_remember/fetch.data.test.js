var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';
var bandModule = require(__base + 'crawlers/web/incubation/a_day_to_remember').crawlModule;

describe('A Day To Remember Suite', function(){
  it('get A Day To Remember Tour generation', function(done){

    bandModule.crawlWebData().
      then (function (data) {
       
        var concerts = bandModule.band.concerts;
        
        console.log(concerts);
        expect(concerts).to.not.be.empty();

        done ();
      });
  });

  it('A Day To Remember stylez', function(done){

    bandModule.crawlWebData().
      then (function (data) {
       
        var styles = bandModule.band.styles;
        expect(styles[0]).to.equal("Symphonic Metal");
       
        done ();
      });
  });

  it('A Day To Remember special dates', function(done){
    
    var date = bandModule.date ("APR 4");

    expect(date).to.equal('2015-04-04');
    done();
  });

  it('A Day To Remember special dates', function(done){
    
    var date = bandModule.date ("Mar 15");

    expect(date).to.equal('2015-03-15');
    done();
  });
});
