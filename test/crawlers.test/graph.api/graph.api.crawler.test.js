var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../../';

var service = require('../../../services/GraphApiCrawler');

describe('Graph Api Access Token Suite', function(){
  it('Get Whatsclose Access Token', function(done){

    service.auth().then (function(data) {
      done();
    });
  });
});
