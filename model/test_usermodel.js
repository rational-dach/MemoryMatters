/**
 * New node file
 */

var express = require('express');
var mongoose = require('mongoose');
var User = require('../model/usermodel.js');
var DBVersion = require('../model/dbversioning.js');



//Compile a 'User' model using the userSchema as the structure.
//Mongoose also creates a MongoDB collection called 'Users' for these documents.
//var User = mongoose.model('User', UserSchema);

//Testcode
var mongo = {
        "username" : "user1",
        "password" : "secret",
        "url" : "mongodb://localhost:27017/tescht"
};

var conn = mongoose.connect(mongo.url);
//var User = conn.model('User', UserSchema);

var test = new User({
    _id: 'test'
        , firstName: 'test'
            , lastName: 'test'  
                , email: 'test@localhost'
                    , password: 'password'});

test.save(function(err, test) {
    if (err) return console.error(err);
    console.dir(test);
    console.log('save finished');
    test.comparePassword('password', function(err, isMatch) {
        if (err) return console.error(err);
        console.log('password: matches', isMatch); // -&gt; Password123: true
    });
    User.findOne({firstName: 'test'}, function(err, user){
        if (err) throw err;

        if (user){
            console.log("test");
        }
    });
});

var test2 = new User({
    _id: 'test2'
        , firstName: 'test'
            , lastName: 'test'  
                , email: 'test@localhost'
                    , password: 'password'});

User.isUserIdUnique(test2._id, function (result){
    console.log(result);
//  test.remove();
//  test2.remove();
});


/*
DBVersion.getVersion(function(ver){
	console.log("Version: " + ver);
});*/

/*
DBVersion.V1(function(err){

	console.log(err);

});*/

DBVersion.upgradeDatabase(function(){

    console.log("DB Upgrade OK!");
});

