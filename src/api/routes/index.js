'use strict';

var fs = require('fs');
var version = require('../../config/settings').version;

module.exports = function(app) {

  fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  }).forEach(function(file) {
    var name = file.substr(0, file.indexOf('.'));
    require('./' + name + '.routes')(app);
  });

  // home route
  app.route('/').get(function(req,res) {

    return res.status(200).json({
      status: {
        code: 200,
        msg: 'ok',
      },
      data: {
        info: 'Welcome to the voOot API. ',
        version: version,
        endpoints: {
          account: 'Get user info',
          person: '[GET, PUT, POST]: A person',
          event: '[GET, PUT, POST]: An event'
        }
      }
    });
  });


  // final fallback
  app.route('/*').get(function(req,res){
    return res.json({
      statusCode: 404,
      msg: 'not found'
    });
  });
};
