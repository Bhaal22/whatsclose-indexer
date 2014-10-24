var http = require('http');
var env = require('jsdom').env;
var Q = require('q');
var winston = require('winston');

// attributes
var CrawlerModule = function () {
  this.enabled = true;
  this.version;
  this.fullUrl = '';
  this.last_indexed;

  this.band = {};
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
      http.get(opts, deferred.resolve).on('error', deferred.reject);
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
    var extractData = function (html){
      var deferred = Q.defer();
      
      var isPageOK = currentModule.testDataAcess(html);
      if (isPageOK){
        // We expect raw objects containing date & location attributes
        var results = currentModule.processData(html);
        for (var i = 0, ii = results.length; i < ii; i++) {
          currentModule.band.addConcertEvent(results[i].date, results[i].location, results[i].venue);
        }
      }
      else{
        winston.error('The web page contains errors, we can\'t crawl it !!!');
      }

      deferred.resolve(currentModule);
      return deferred.promise;
    }

    // Defered chaining
    
    return httpGet(currentModule.fullUrl).then(function (res){
      
      return loadBody(res);
      
    }, currentModule.httpGetError).then(function (webData) {
      
      return envPromise(webData);

    }).then(function (window){
      
      return extractData(window);

    }, currentModule.envError);

  },

  /**
   * [testDomElements description]
   * @param  { [{elt,nullable,expectedValue},...] } tests DOM elements to tests and their expected behaviour
   * @return {boolean}
   */
  testDomElements: function(tests){
    var isPageOK = true;
    for (var i = tests.length - 1; i >= 0; i--) {
      var currentElement = tests[i].elt;
      var isNullable = tests[i].nullable;
      var expectedValue = tests[i].expectedValue;

      if (!isNullable && (currentElement === undefined || currentElement === null))
        isPageOK = false;
      if (expectedValue && currentElement !== expectedValue)
        isPageOK = false;
    };
    return isPageOK;
  },

  httpGetError: function(error){
    winston.error('HTTP GET error while processing the crawl module');
  },

  envError: function(error){
    winston.error('JSDOM ENV error while processing the crawl module');
  }
}

// Exporting only the function (no object structure) for constructor easy use (cf crawler files in folder crawler)
module.exports = CrawlerModule;
