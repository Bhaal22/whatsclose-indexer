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
  
  init: function(winston) {
	  
  	// retrieve the crawlers js files
  	var servicesDir = fs.readdirSync('services');
  	for (var i = 0, ii = servicesDir.length; i < ii; i++) {
      var file_name = servicesDir[i];
      var regex = /.js$/;

      var match = file_name.match(regex);
      

  	  if ((servicesDir[i] != path.basename (__filename)) && (match)) {
  	    winston.info('service file found : ' + file_name);
  	    
  	    // Load the js files as node modules
  	    var module = require('./' + file_name.replace(/.js$/, ""));
        
        try {
          module.init (winston);
          this.services[module.moduleName] = module;
        } catch (e) {
          console.log (e);
        }
      }
  	};
  }
};

module.exports = new ServicesHandler ();
