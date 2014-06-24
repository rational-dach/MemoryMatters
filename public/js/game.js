var player = include('public/js/player.js');

function Game(x,y,id) {
	this.width = x;
	this.height = y;
	this.id = id;
	this.lastActivity;
		
	var step = 0;
	var players = [];
	var curPlayer = 0;
	var pairsLeft = 0;
	var started = false;
	var board = [];
	var lastTurn = {x1: 0, y1: 0, val1: 0, x2: 0, y2: 0, val2: 0};
	
	// create the board
	var tmpval = 0;
	var tmpstep = 0; 
	for (var i = 0; i < x; i++) {
		board[i] = [];
		for (var j = 0; j < y; j++) {
			board[i][j] = tmpval;
			tmpstep++;
			if (tmpstep > 1) {
				tmpval++;
				tmpstep=0;
			}
		}
	}
	
	function calcPairsLeft() {
		var cards = 0;
		for (var i = 0; i < x; i++) {
			for (var j = 0; j < y; j++) {
				if (board[i][j] != -1)
					cards++;
			}
		}
		pairsLeft = cards/2;
	};
	
	// shuffle cards
	this.Shuffle = function() {
		for (var i = 0; i < x; i++) {
			for (var j = 0; j < y; j++) {
				var randx = Math.floor(Math.random()*x);
				var randy = Math.floor(Math.random()*y);
				var tmp = board[i][j];
				board[i][j] = board[randx][randy];
				board[randx][randy] = tmp;
			}
		}
	};
	
	// register new player for game
	this.SetPlayer = function(newplayer) {
		players.push(newplayer);
		newplayer.Prepare(this.width, this.height);
		// let human player start the game
		if (newplayer.type != player.usertype.COMPUTER)
			curPlayer = players.length - 1;
	};
	
	// turn card
	this.TurnCard = function(username, x, y) {
		var ret = 0;
		if (pairsLeft <= 0)
			return -1;
		if (players[curPlayer].name != username)
			return -1;
		ret = board[x][y];
		if (board[x][y] < 0)
			return -1;
		
		if (step == 0) {
			lastTurn.x1 = x;
			lastTurn.y2 = y;
			lastTurn.val1 = ret;
			step++;
		}
		else {
			if (board[x][y] == board[lastTurn.x1][lastTurn.y1]) {
				board[x][y] = -1;
				board[lastTurn.x1][lastTurn.y1] = -1;
				players[curPLayer].score++;
				calcPairsLeft();
			}
			lastTurn.x2 = x;
			lastTurn.y2 = y;
			lastTurn.val2 = ret;
			curPlayer = curPlayer++ % players.length;
			step = 0;
		}
		lastActivity = Date.now();
		started = true;
		return ret;
	};
	
	// current state of game
	this.GetState = function() {
		var state = {user: players[curPlayer], step: step, left: pairsLeft};
		return state;
	};
	
	// look at last cards
	this.GetLast = function() {
		return lastTurn;
	};
	
	// consider a game with no activity within the last 5 minutes
	// as orphaned
	this.IsActive = function() {
		if (Date.now() - lastActivity > 60*5*1000)
			return false;
		else
			return true;
	};
	
	// called by housekeeping to act in behalf of computer players
	this.Process = function() {
		if (players[curPlayer] != player.usertype.COMPUTER)
			return;
		if (!started)
			return;
		
		players[curPlayer].Play(this);
	};
	
	this.Shuffle();
	calcPairsLeft();
	lastActivity = Date.now();
}

module.exports = Game;