var winston = require('winston');
var fs = require('fs');

// attributes
var ServicesHandler = function () {
	this.services = [];
}

// methods
ServicesHandler.prototype = {

  init: function() {

  	// retrieve the crawlers js files
  	var servicesDir = fs.readdirSync('services');
  	
  	for (var i = 0, ii = servicesDir.length; i < ii; i++) {
  	  
  	  winston.info('Crawler file found : ' + servicesDir[i]);
  	  
  	  // Load the js files as node modules
  	  var module = require('./services/' + servicesDir[i].replace(/.js$/, ""));

  	  servicesDir.push(module);
  	};
  }
}

module.exports = ServicesHandler;
