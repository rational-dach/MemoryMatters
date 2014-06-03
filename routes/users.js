var express = require('express');
var router = express.Router();

//invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  next();
});

/* GET users listing. */
router.get('/test', function(req, res) {
  res.send('respond with a resource');
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
    db.collection('users').insert({_id:name, passwd:passwd}, function (err, doc) {
		if(err) res.send(err);
		else res.send("done");
    });
});

module.exports = router;
