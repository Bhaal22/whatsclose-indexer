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

  it('Powerwolf concert on march 29-30 May', function(done){
    
    var date_str = bandModule.date ("29.-30.05.2015");

    var date = Date.parseExact(date_str, 'yyyy-MM-dd');
    expect(date.getDate()).to.equal(29);
    expect(date.getMonth()+1).to.equal(5);

    done();
  });

  it('Powerwolf concert on march 30 July - 1st August', function(done){
    
    var date_str = bandModule.date ("30.07.- 01.08.2015");

    var date = Date.parseExact(date_str, 'yyyy-MM-dd');
    console.log(date);
    expect(date.getDate()).to.equal(30);
    expect(date.getMonth()+1).to.equal(7);

    done();
  });

  it('Powerwolf concert on march 15 Sept 2011', function(done){
    
    var date_str = bandModule.date ("15-09-2011");

    var date = Date.parseExact(date_str, 'yyyy-MM-dd');
    console.log(date);
    expect(date.getDate()).to.equal(15);
    expect(date.getMonth()+1).to.equal(9);

    done();
  });

  
});
