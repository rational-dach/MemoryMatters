/*jslint node:true*/
var port = (process.env.VCAP_APP_PORT || 3000);
var express = require("express");
var users = require('./routes/users');

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

//Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


// application context
app.use(express.static(__dirname + '/public'));
app.use('/users', users);


// ready to go
app.listen(port);
console.log("Server listening on port " + port);