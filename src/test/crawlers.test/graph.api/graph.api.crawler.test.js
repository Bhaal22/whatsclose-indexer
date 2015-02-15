var request = require('superagent');
var expect = require('expect.js');

var q = require('Q');

global.__base = __dirname + '/../../../';

var service = require(global.__base + 'services/crawling/GraphApiCrawler');

describe('Graph Api Access Token Suite', function(){
  it('Get Whatsclose Access Token', function(done){

    service.auth().then (function(data) {
      
      console.log(service.access_token);
      expect(service.access_token).to.eql('699899433422062|wZxwD5n_ES3KOMCkSJIbGa-z2WA');
      done();
    });
  });

  it('Get Whatsclose Access Token', function(done){
    
    service.init().then (function (data) {
      console.log(service.access_token);
      
      expect(service.crawl_modules).to.not.be.empty();
    
      done();
    });
  });
});
