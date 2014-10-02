var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../';

var geocode_svc = require(__base + 'services/geocoding/GeoCodeService');
var winston = require(__base + 'services/CustomWinston.js');

describe('Multiple locations suite', function(){
  it('Las Vegas geocoding multiple', function(done) {

    var concert = { 
      location: "Las Vegas, NV"
    };
    geocode_svc.searchGeometry(concert).then (function (data) {
      expect(data.results).to.not.be.empty();

      //winston.info(data.results);


      var idx = geocode_svc.filter_locations(data.results);

      expect(idx).not.to.equal(-1);

      done();
    });
  });

  it('Dublin geocoding multiple', function(done) {

    var concert = { 
      location: "DUBLIN"
    };
    geocode_svc.searchGeometry(concert).then (function (data) {
      expect(data.results).to.not.be.empty();

      //winston.info(data.results);
      done();
    });
  }); 
});
