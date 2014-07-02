// helper for including js files
global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
};
global.include = function(file) {
  return require(abs_path('/' + file));
};

// instantiate game controller
var controller = include('/js/controller.js');
var gameController = new controller();

// variable for this script
var cfenv = null;
try { 
    cfenv = require('cfenv');
}
catch(err) {
}

var express = require("express");
var users = require('./routes/users');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var api_game = require('./routes/api-game');

//get the core cfenv application environment
var mongo = "";
var port = 3000;
if (cfenv) {
    var appEnv = cfenv.getAppEnv();

//  setup database
    var mongodb = require('mongodb');
    var mongoService = appEnv.getServices('mongodb-2.2');
    if (mongoService) {
        var mongo = mongoService[0].credentials;
    }

    port = appEnv.port;
}

if (mongo == "") { 
	mongo = {
			"username" : "user1",
			"password" : "secret",
			"url" : "mongodb://localhost:27017/memory"
	};
}

mongoose.connect(mongo.url);
var db = mongoose.connection;

// create application
var app = express();

// session handling
app.use(cookieParser());
app.use(session({secret: '1234567890QWERTY'}));

//Make some objects accessible to our router
app.use(function(req,res,next){
	req.db = db;
	req.controller = gameController;
	if (req.originalUrl == "/pages/game.html") {
		if (!req.session.loggedIn)
			res.redirect('/');
		else
			next();
	}
	else {
		next();
	}
});

// process controller every interval
setInterval(gameController.Process, 2000);

// application context
app.use(express.static(__dirname + '/public'));
app.use('/users', users);
app.use('/game', api_game);


// ready to go
app.listen(port);
console.log("Server listening on port " + port);