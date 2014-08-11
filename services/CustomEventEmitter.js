/**
 * Instanciation of the event emitter for all the services
 */
var EventEmitter = require("events").EventEmitter;

var eventEmitter = new EventEmitter();

module.exports = eventEmitter;