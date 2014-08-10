
var winston = require('winston');
var fs = require('fs');

// retrieve the crawlers js files
var crawlersDir = fs.readdirSync('crawlers');
var crawlModules = [];

for (var i = 0, ii = crawlersDir.length; i < ii; i++) {
  
  winston.info('Crawler file found : ' + crawlersDir[i]);
  // Load the js files as node modules
  var module = require('./crawlers/' + crawlersDir[i].replace(/.js$/, ""));
  crawlModules.push(module);
};

// Parsing every crawling module and calling the testDataAcess & crawlWebData functions
for (var i = 0, ii = crawlModules.length; i < ii; i++) {

  winston.info('Start processing module : ' + crawlModules[i].crawlModule.band.name);
  if (crawlModules[i].crawlModule.isValid()){
    
    // check if the page web is still well defined
    var isPageOK = crawlModules[i].crawlModule.testDataAcess();
    if (isPageOK){
      //crawlModules[i].crawlModule.processData();
      winston.info('fullUrl : ' + crawlModules[i].crawlModule.fullUrl);
      crawlModules[i].crawlModule.crawlWebData();
    }
  }
};
