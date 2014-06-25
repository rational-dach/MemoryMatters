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

// login
router.get('/login', function(req, res) {
	var ret = {loggedIn: "false"};
	//fetch user and test password verification
	User.findOne({ _id: req.query.userId }, function(err, user) {
		if (!err) {
			user.comparePassword(req.query.password, function(err, isMatch) {
				if (isMatch) {
					ret.loggedIn = "true";
					req.session.loggedIn = true;
					req.session.username = user._id;
					res.send(ret);
				}
				else
					res.send(ret);
			});
		}
	});
});

//logout
router.get('/logout', function(req, res) {
	req.session.loggedIn = null;
	req.session.user = null;
	res.send("logged out");
});

// current user
router.get('/currentUser', function(req, res) {
	var ret = {username: ""};
	if (req.session.loggedIn == true) {
		ret.username = req.session.username;
		res.send(ret);
	}
	else {
		res.send(ret);
	}
});

module.exports = router;
