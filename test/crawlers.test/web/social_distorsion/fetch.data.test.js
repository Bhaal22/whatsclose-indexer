var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';
var social_distorsion = require(__base + 'crawlers/web/social_distorsion').crawlModule;

describe('Social Distorsion Suite', function(){
  it('get Social Distorsion Tour generation', function(done){

    social_distorsion.crawlWebData().
      then (function (data) {
       
        var concerts = social_distorsion.band.concerts;
        
        console.log(concerts);
        expect(concerts).to.not.be.empty();

        done ();
      });
  });

  it('checks Social Distorsion stylez', function(done){

    social_distorsion.crawlWebData().
      then (function (data) {
       
        var styles = social_distorsion.band.styles;
        expect(styles[2]).to.equal("rockabilly");
        expect(styles[3]).to.equal("hardcore punk");
        

        done ();
      });
  });

  it('Social Distorsion special dates', function(done){
    
    var date = social_distorsion.date ("Thu 09/11/2014");

    expect(date).to.equal('2014-09-11');

    done();
  });

  it('Social Distorsion special dates with spaces', function(done){
    
    //var date = social_distorsion.date ("8/29 - 8/31/2014");

    //expect(date).to.equal('2014-08-29');

    done();
  });

  it('Social Distorsion concert on march 2nd', function(done){
    
    //var date_str = social_distorsion.date ("3/2/2014");

    //var date = Date.parseExact(date_str, 'yyyy-MM-dd');
    //expect(date.getDate()).to.equal(2);
    //expect(date.getMonth()+1).to.equal(3);

    done();
  });

  
});
