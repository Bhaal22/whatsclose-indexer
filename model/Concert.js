// attributes
var Concert = function () {
  this.bandName; 
  this.date;
  this.location;
  this.venue = '';
  this.geometry = { };
  this.styles = [];
};

// methods
// CrawlerModule.prototype = {

// }

// Exporting only the function (no object structure) for constructor easy use (cf crawler files in folder crawler)
module.exports = Concert;
