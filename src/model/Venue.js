var Venue = function (concert) {
  var _concert = concert || {};
    
  this.name = _concert.venue || "";
  this.website = "";
  this.location = _concert.location || "";
  this.geometry = _concert.geometry;
  this.type = "concert hall";
};


module.exports = Venue;
