// helper for including js files
global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
};
global.include = function(file) {
  return require(abs_path('/' + file));
};

// instantiate game controller
var controller = include('/public/js/controller.js');
var gameController = new controller();

// variable for this script
var port = (process.env.VCAP_APP_PORT || 3000);
var express = require("express");
var users = require('./routes/users');
var game = require('./routes/api-game');

// setup database
var mongodb = require('mongodb');
if (process.env.VCAP_SERVICES) {
	var env = JSON.parse(process.env.VCAP_SERVICES);
	if (env['mongodb-2.2']) {
		var mongo = env['mongodb-2.2'][0].credentials;
	}
}
if (!mongo) { 
	var mongo = {
			"username" : "user1",
			"password" : "secret",
			"url" : "mongodb://localhost:27017/memory"
	};
}
var mongoose = require('mongoose');
mongoose.connect(mongo.url);
var db = mongoose.connection;

// create application
var app = express();

//Make some objects accessible to our router
app.use(function(req,res,next){
    req.db = db;
    req.controller = gameController;
    next();
});


// process controller every interval
setInterval(gameController.Process, 2000);

// application context
app.use(express.static(__dirname + '/public'));
app.use('/users', users);
app.use('/game', game);


// ready to go
app.listen(port);
console.log("Server listening on port " + port);