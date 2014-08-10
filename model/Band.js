var Concert = require('./Concert');
var winston = require('winston');

// attributes
var Band = function () {
  this.name; 
  this.website;
  this.style = [];
  this.concerts = [];
}
	
// methods
Band.prototype = {

	toString: function () {
	  return 'Band:' + this.name;
	},

	addConcertEvent: function (date, location) {
		var event = new Concert();
		event.date = new Date(date);
  	event.location = location;
		
		// bandname to remove ?
		event.bandName = this.name;

		this.concerts.push(event);
	}

}

// Exporting only the function (no object structure) for constructor easy use (cf crawler files in folder crawler)
module.exports = Band;