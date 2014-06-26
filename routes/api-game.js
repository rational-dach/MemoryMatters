var express = require('express');
var router = express.Router();
var player = include('js/player.js');

//invoked for any requests passed to this router
router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  next();
});

// user requests a new game
router.get('/reqgame', function(req, res) {
	var id = req.controller.RequestGame(req.query.user, player.usertype.COMPUTER);
	res.send(id);
});

// query game status
router.get('/querygame', function(req, res) {
	var status = req.controller.QueryGame(req.query.gameid);
	res.send(status);
});

// play game
router.get('/playgame', function(req, res) {
	var pos = req.query.pos;
	var ret = req.controller.PlayGame(req.query.gameid, req.query.user, req.query.pos);
	console.log(ret, 'at pos: ', pos);
	res.send(ret);
});

module.exports = router;