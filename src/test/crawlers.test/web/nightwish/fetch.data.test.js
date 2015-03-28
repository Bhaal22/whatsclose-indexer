var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';
var bandModule = require(__base + 'crawlers/web/nightwish').crawlModule;

describe('Nightwish Suite', function(){
  it('get Nigthwish Tour generation', function(done){

    bandModule.crawlWebData().
      then (function (data) {
       
        var concerts = bandModule.band.concerts;
        
        console.log(concerts);
        expect(concerts).to.not.be.empty();

        done ();
      });
  });

  it('Nightwish stylez', function(done){

    bandModule.crawlWebData().
      then (function (data) {
       
        var styles = bandModule.band.styles;
        expect(styles[0]).to.equal("Symphonic Metal");
       
        done ();
      });
  });

  it('Nightwish special dates', function(done){
    
    var date = bandModule.date ("3 Feb 2015");

    expect(date).to.equal('2015-02-03');
    done();
  });

  it('Nightwish special dates', function(done){
    
    var date = bandModule.date ("15 Mar 2015");

    expect(date).to.equal('2015-03-15');
    done();
  });
});
