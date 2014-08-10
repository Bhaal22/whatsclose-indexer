//var Promise = require('es6-promise').Promise;
var http = require('http');
var env = require('jsdom').env;
var Q = require('q');
var winston = require('winston');

// attributes
var CrawlerModule = function () {
  this.enabled = true;
  this.version;
  this.fullUrl = 'http://www.volbeat.dk/3/dates/';
  this.last_indexed;

  this.band;
}

// methods
CrawlerModule.prototype = {
  isValid: function() {
    winston.info('CrawlerModule.isValid');
    return this.enabled;
  },

  tostring: function() {
    var bandName = (this.band)
      ? this.band.toString
      : '';
    return bandName + '(' + this.url + this.datesPath + ')';
  },

      
  // #01 : connect to url and retrieve DOM page
  // #02 : TODO : test DOM page to verify if the crawl module is outdated
  // #03 : extract DOM data of interest
  // #04 : transform DOM data to raw data
  // #05 : create the concert event
  // #06 : index that f***ing shit !!!

  crawlWebData: function() {
  
    // #B : Promises refactor
    var currentModule = this;

    // Bind defer on http.get callback function
    var httpGet = function (opts) {
      var deferred = Q.defer();
      http.get(opts, deferred.resolve);
      return deferred.promise;
    };

    // Bind defer on ended response callback function
    var loadBody = function (res) {
      var deferred = Q.defer();
      var data = '';
      res.on('data', function (chunk) {
          data += chunk;
      });
      res.on('end', function () {
          deferred.resolve(data);
      });
      return deferred.promise;
    };

    // Bind defer on env (DOM extraction library) callback function
    var envPromise = Q.nfbind(env);

    // Bind defer on extractData custom function
    var extractData = function (window){
      var deferred = Q.defer();
      
      // We expect raw objects containing date & location attributes
      var results = currentModule.processData(window);
      for (var i = 0, ii = results.length; i < ii; i++) {
        winston.info('New event !!!! : ' + results[i].date + ' - ' + results[i].location);
        currentModule.band.addConcertEvent(results[i].date, results[i].location);
      }
      deferred.resolve(currentModule);
      return deferred.promise;
    }

    // Defered chaining
    httpGet(currentModule.fullUrl).then(function (res){
    
      return loadBody(res);

    }).then(function (webData) {
      
      return envPromise(webData);

    }).then(function (window){
      
      return extractData(window);

    }).done();
  },


  // Using ES6 generator features (available in node 0.11)
  // crawlWebData_Generator: function() {
  
  //   // #C : Promises refactor + generator
  //   var currentModule = this;

  //   // Bind defer on http.get callback function
  //   var httpGet = function (opts) {
  //     var deferred = Q.defer();
  //     http.get(opts, deferred.resolve);
  //     return deferred.promise;
  //   };

  //   // Bind defer on ended response callback function
  //   var loadBody = function (res) {
  //     var deferred = Q.defer();
  //     var data = '';
  //     res.on('data', function (chunk) {
  //         data += chunk;
  //     });
  //     res.on('end', function () {
  //         deferred.resolve(data);
  //     });
  //     return deferred.promise;
  //   };

  //   // Bind defer on env (DOM extraction library) callback function
  //   var envPromise = Q.nfbind(env);

  //   // Bind defer on extractData custom function
  //   var extractData = function (window){
  //     var deferred = Q.defer();
      
  //     // We expect raw objects containing date & location attributes
  //     var results = currentModule.processData(window);
  //     for (var i = 0, ii = results.length; i < ii; i++) {
  //       winston.info('New event !!!! : ' + results[i].date + ' - ' + results[i].location);
  //       currentModule.band.addConcertEvent(results[i].date, results[i].location);
  //     }
  //     deferred.resolve(currentModule);
  //     return deferred.promise;
  //   }

  //   // chaining
  //   Q.async(function*() {
  //     try{
  //       var res = yield httpGet(currentModule.fullUrl);

  //       var webData = yield loadBody(res);

  //       var window = yield envPromise(webData);

  //       var updatedModule = yield extractData(window);
  //     }
  //     catch(err){
  //       winston.error('Error : ' + err);
  //     }
  //   })().done();
  // },

    // @deprecated
  crawlWebData_promisesHell: function() {
    
    var url = this.fullUrl;
    var currentBand = this.band;

    // #A : Promises style callback handling (to replace with generators)
    return new Promise (function (resolve, reject) {

      // #01 : connect to url and retrieve DOM page
      winston.info('#01 : connect to url and retrieve DOM page : ', url);
      http.get(url, function (res) {
        var data = "";
        
        res.on('data', function (chunk) {
          data += chunk;
        });
        
        res.on('end', function () {

          // #02 : TODO : test DOM page to verify if the crawl module is outdated
          
          new Promise (function (resolve, reject) {

            // #03 : pre-extract DOM data of interest
            winston.info('#03 : pre-extract DOM data of interest');
          
            env(data, function (errors, window) {
              if (errors != null)
                reject (errors);
              
              var $ = require('jquery')(window);

              var dates_table = $('table.dates_list');
              
              // #04 : transform DOM data to raw data
              winston.info('#04 : transform DOM data to raw data');
              var rows = $ ('.dates_list > tr');
              rows.each (function (index) {

                var date = $('td.dates_date', this).text ();
                var location = $('td.dates_info2', this).text ();

                // #05 : create the concert event
                winston.info('Retrieved event : ' + currentBand.name + ' - ' + date + ' - ' + location);
                currentBand.addConcertEvent(date, location);
                
              });

              resolve(currentBand.concerts);

            });
          }).then (function (response) {
           resolve(currentBand.concerts);
          });
        });
        res.on('error', function(e) {
          reject([]);
        });
      }).on ('error', function (e) {
        resolve ([]);
      });
    });
  }

}

// Exporting only the function (no object structure) for constructor easy use (cf crawler files in folder crawler)
module.exports = CrawlerModule;
