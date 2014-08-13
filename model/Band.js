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
		event.date = date;
  	event.location = location;
		
		// bandname to remove ?
  		// JC => we're indexing concert (right?). How do you know what group it is if not indexed in the concet document ?
		event.bandName = this.name;
		
		// Same goes for the style
		event.style = this.style;

		this.concerts.push(event);
	}

};

// Exporting only the function (no object structure) for constructor easy use (cf crawler files in folder crawler)
module.exports = Band;