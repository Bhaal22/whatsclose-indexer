
var winston = require('winston');
var eventEmitter = require('./services/CustomEventEmitter');
var svc_handler = require('./services/ServicesHandler.js');

// Services initialization
svc_handler.init();

// Entry Point for indexation
eventEmitter.emit("crawlData");

