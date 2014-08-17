var request = require('superagent');
var expect = require('expect.js');

var volbeat = require('../../../crawlers/volbeat').crawlModule;

describe('Suite one', function(){
  it('test date generation', function(done){
    
    var date = volbeat.date ("04-05 Oct 2014");

    expect(date.toString()).to.equal("Sat Oct 04 2014 00:00:00 GMT+0200 (CEST)");

    done ();
  });
});
