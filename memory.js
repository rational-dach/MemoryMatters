//helper for including js files
global.base_dir = __dirname;
global.abs_path = function(path) {
    return base_dir + path;
};
global.include = function(file) {
    return require(abs_path('/' + file));
};

//instantiate game controller
var controller = include('/js/controller.js');
var gameController = new controller();

//variable for this script
var cfenv = null;
try { 
    cfenv = require('cfenv');
}
catch(err) {
}

var express = require("express");
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//handle our DB Versioning stuff
var DBVersion = require('./model/dbversioning.js');

//get the core cfenv application environment
var mongo = "";
var port = 3000;
var host = "localhost";
if (cfenv) {
    var appEnv = cfenv.getAppEnv();

    //  setup database
    if (appEnv.services && appEnv.services['mongolab']) {
        var mongoService = appEnv.services['mongolab'][0];
        console.log(mongoService);
        if (mongoService) {
            var mongo = mongoService.credentials;
        }
    }

    port = appEnv.port;
    host = appEnv.host;
}

if (mongo == "") { 
    mongo = {
            "username" : "user1",
            "password" : "secret",
            "uri" : "mongodb://localhost:27017/memory"
    };
}

console.log(mongo);

mongoose.connect(mongo.uri,function(cb) {
    // upgrade DB first after initial connection;
    DBVersion.upgradeDatabase(function(){
        console.log("DB Upgrade OK!");
    });
});
var db = null; //mongoose.connection;

//create application
var app = express();

//session handling
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())
var sessionStore = new session.MemoryStore;
app.use(session({secret: '1234567890QWERTY', store: sessionStore}));

//authentication
var authentication = include('/js/auth.js');
var auth = new authentication();
app.use(auth.passport.initialize());
app.use(auth.passport.session());
app.get('/ibmid', auth.passport.authenticate('ibmid', { scope: ['profile'] }));
app.get('/ibmid/callback', auth.passport.authenticate('ibmid', { failureRedirect: '/', scope: ['profile'] }), function(req, res) {
    res.redirect('/');
});

//Make some objects accessible to our router
app.use(function(req,res,next){
    req.db = db;
    req.controller = gameController;
    req.passport = auth.passport;
    if ((req.originalUrl != "/pages/game.html") &&
            (req.originalUrl.indexOf("/pages/") == 0 || 
                    req.originalUrl == "/" || 
                    req.originalUrl == "/users/login" ||
                    req.originalUrl.indexOf("/users/currentUser") == 0)) {
        next();
    }
    else if (req.isAuthenticated()) { 
        return next();
    }
    else {
        res.redirect('/pages/login.html');
    }
});

//process controller every interval
setInterval(gameController.Process, 2000);

//application context
var users = require('./routes/users');
var api_game = require('./routes/api-game');
app.use(express.static(__dirname + '/public'));
app.use('/users', users);
app.use('/game', api_game);


//ready to go
app.listen(port);
console.log("Server listening on port " + port);