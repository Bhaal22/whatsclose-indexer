
var winston = require('winston');
var eventEmitter = require('./services/CustomEventEmitter');
var svc_handler = require('./services/ServicesHandler.js');

var init_logger = function () { 
  //winston.add(winston.transports.File, { filename: 'whatsclose.log' });
  //winston.remove(winston.transports.Console);
  var custom_log_levels = {
    colors: {
      log: 'white',
      warn: 'yellow',
      error: 'red'
    }
  }

  winston.addColors(custom_log_levels.colors);
};

init_logger ();
// Services initialization
svc_handler.init(winston);

// Entry Point for indexation
eventEmitter.emit("crawlData");

