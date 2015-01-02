var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';
var volbeat = require(__base +  'crawlers/web/volbeat').crawlModule;

describe('Volbeat Suite', function(){
  it('get Volbeat Tour generation', function(done){

    volbeat.crawlWebData().
      then (function (data) {
       
        var concerts = volbeat.band.concerts;
	console.log(concerts);
        expect(concerts).to.not.be.empty();

        done ();
      });
  });

  it('test date range generation', function(done){
    
    var date = volbeat.date ("04-05 Oct 2014");

    expect(date).to.equal('2014-10-04');

    done ();
  });

  it('test date 16 Sep 2014', function(done){
    
    var date = volbeat.date ("16 Sep 2014");

    expect(date).to.equal('2014-09-16');

    done ();
  });
});
