var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../../';

var tagada = require(__base + 'crawlers/web/tagadajones').crawlModule;

describe('Tagada Jones Suite', function(){
  it('get Tagada Jones Tour generation', function(done) {

    tagada.crawlWebData().
      then (function (data) {
        var concerts = tagada.band.concerts;

        console.dir(concerts);
        expect(concerts).to.not.be.empty();

        done ();
      });
  });  
});
