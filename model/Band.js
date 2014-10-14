var Concert = require('./Concert');
var winston = require('winston');

// attributes
var Band = function () {
  this.name; 
  this.website;
  this.styles = [];
  this.concerts = [];
}
	
// methods
Band.prototype = {

	toString: function () {
	  return 'Band:' + this.name;
	},

	addConcertEvent: function (date, location, venue) {
		var event = new Concert();
    event.venue = venue;
		event.date = date;
  	event.location = location;
		
		event.bandName = this.name;
		
		// Same goes for the style
		event.styles = this.styles;

		this.concerts.push(event);
	}

};

// Exporting only the function (no object structure) for constructor easy use (cf crawler files in folder crawler)
module.exports = Band;
