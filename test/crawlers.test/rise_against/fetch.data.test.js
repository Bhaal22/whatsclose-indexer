var request = require('superagent');
var expect = require('expect.js');

var rise_against = require('../../../crawlers/rise_against').crawlModule;

describe('Rise Against Suite', function(){
  it('get Rise Against Tour generation', function(done){
    
    // var date = volbeat.date ("04-05 Oct 2014");

    // expect(date.toString()).to.equal("Sat Oct 04 2014 00:00:00 GMT+0200 (CEST)");

    rise_against.crawlWebData().
      then (function (data) {
       
        var concerts = rise_against.band.concerts;
        expect(concerts).to.not.be.empty();

        done ();
      });
  });

  it('Rise Against special dates', function(done){
    
    var date = rise_against.date ("7/31-8/3/2014");

    expect(date.toString()).to.equal("Thu Jul 31 2014 00:00:00 GMT+0200 (Paris, Madrid (heure d’été))");

    done();
  });
});
