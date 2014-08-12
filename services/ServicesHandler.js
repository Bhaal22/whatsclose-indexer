var winston = require('winston');
var fs = require('fs');
var path = require('path');

//Events
var eventEmitter = require('./CustomEventEmitter');


// attributes
var ServicesHandler = function () {
	this.services = {};
};

// methods
ServicesHandler.prototype = {
  
  init: function() {
	  
  	// retrieve the crawlers js files
  	var servicesDir = fs.readdirSync('services');
  	for (var i = 0, ii = servicesDir.length; i < ii; i++) {
  	  if (servicesDir[i] != path.basename (__filename)) {
  	    winston.info('service file found : ' + servicesDir[i]);
  	    
  	    // Load the js files as node modules
  	    var module = require('./' + servicesDir[i].replace(/.js$/, ""));
        
        try {
          module.init ();
          this.services[module.moduleName] = module;
        } catch (e) {
          console.log (e);
        }
      }
  	};
  }
};

module.exports = new ServicesHandler ();
