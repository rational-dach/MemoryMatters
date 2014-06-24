var express = require('express');
var router = express.Router();
var User = require('../model/usermodel.js');

//invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  next();
});

/* GET users listing. */
router.get('/test', function(req, res) {
  res.send('respond with a resource');
});


router.get('/useridcheck', function(req, res) {
	
	//TODO this is a hack
	User.isUserIdUnique(req.query.userId, function (result){
		  console.log(result);
	res.send(result);
	});
});


/* GET Userlist page. */
router.get('/', function(req, res) {
    var db = req.db;
    db.collection('users').find().toArray(function(e,result){
    	res.send(result);
    });
});

/* create user. */
router.get('/create', function(req, res) {
    var db = req.db;
    var name = req.query.name;
    var passwd = req.query.passwd;
    // TODO fix field attribute assignments
    var test = new User({
    	_id: req.query.userId
    	, firstName: req.query.firstName
    	, lastName: req.query.lastName
    	, email: req.query.eMail
    	, password: req.query.password
    });
    console.log(req);
    	/*
    db.collection('users').insert({_id:name, passwd:passwd}, function (err, doc) {
		if(err) res.send(err);
		else res.send("done");
    });*/
    test.save(function (err) {
    	  if (err)
    	  {	
    		  console.log('Error saving user ', test, err);
    		  res.send(err);
    	  }
    	  else
    	  {	
    		  console.log('OK saving user ', test);
    		  res.send("done");
    	  }  
   });	
 });

module.exports = router;
