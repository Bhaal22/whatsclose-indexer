var winston = require("winston");

var init_logger = function () { 
  winston = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: 'silly',
        prettyPrint: true,
        colorize: true,
        silent: false,
        timestamp: false
      })
    ],
    levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 },
    colors: {
      trace: 'magenta',
      input: 'grey',
      verbose: 'cyan',
      prompt: 'grey',
      debug: 'blue',
      info: 'green',
      data: 'grey',
      help: 'cyan',
      warn: 'yellow',
      error: 'red'
    }
  });

};

init_logger();

module.exports = winston;
