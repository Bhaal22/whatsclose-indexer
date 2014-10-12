var request = require('superagent');
var expect = require('expect.js');

global.__base = __dirname + '/../../';

var geocode_svc = require(__base + 'services/geocoding/GeoCodeService');
var winston = require(__base + 'services/CustomWinston.js');

describe('Multiple locations suite', function(){
  it('Las Vegas,NV geocoding multiple', function(done) {

    var concert = { 
      location: "Las Vegas, NV"
    };
    geocode_svc.searchGeometry(concert).then (function (data) {
      expect(data.results).to.not.be.empty();

      var idx = geocode_svc.filter_locations(data.results);
      expect(idx).not.to.equal(-1);

      done();
    });
  });

  it('London geocoding multiple', function(done) {

    var concert = { 
      location: "LONDON"
    };
    geocode_svc.searchGeometry(concert).then (function (data) {

      var idx = geocode_svc.filter_locations(data.results);
      expect(idx.length).eql(4);
      done();
    });
  }); 

  it('Amsterdam geocoding multiple', function(done) {

    var concert = { 
      location: "AMSTERDAM"
    };
    geocode_svc.searchGeometry(concert).then (function (data) {

      var idx = geocode_svc.filter_locations(data.results);
      expect(idx.length).eql(2);
      done();
    });
  }); 
  
  it('Saint Casimir geocoding multiple', function(done) {

    var concert = { 
      location: "ST CASIMIR"
    };
    geocode_svc.searchGeometry(concert).then (function (data) {

      // console.dir(data.results);
      // console.log(data.results.length);
      var idx = geocode_svc.filter_locations(data.results);
      expect(idx.length).eql(1);
      done();
    });
  }); 

  it('Las Vegas geocoding multiple', function(done) {

    var concert = { 
      location: "Las Vegas"
    };
    geocode_svc.searchGeometry(concert).then (function (data) {

      var idx = geocode_svc.filter_locations(data.results);
      expect(idx.length).eql(2);
      done();
    });
  }); 
});
