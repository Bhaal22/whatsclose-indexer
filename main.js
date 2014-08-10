
var winston = require('winston');
var fs = require('fs');
var Q = require('q');

var svc_handler = require('./services/ServicesHandler.js');

svc_handler.init ();

var crawlPromises = svc_handler.services[0].run (); 

crawlPromises.then (function (res) {
  console.log (res[0].band.name);
  console.log (res[1].band.name);
});
