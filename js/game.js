var player = include('js/player.js');

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
	var lastTurn = {pos1: 0, val1: -1, pos2: 0, val2: -1};
	
	// create the board
	var tmpval = 0;
	var tmpstep = 0; 
	for (var i = 0; i < x*y; i++) {
		board[i] = tmpval;
		tmpstep++;
		if (tmpstep > 1) {
			tmpval++;
			tmpstep=0;
		}
	}
	
	function calcPairsLeft() {
		var cards = 0;
		for (var i = 0; i < x*y; i++) {
			if (board[i] != -1)
				cards++;
		}
		pairsLeft = cards/2;
	};
	
	// shuffle cards
	this.Shuffle = function() {
		for (var i = 0; i < x*y; i++) {
			var rand = Math.floor(Math.random()*x*y);
			var tmp = board[i];
			board[i] = board[rand];
			board[rand] = tmp;
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
	this.TurnCard = function(username, pos) {
		var ret = 0;
		if (pairsLeft <= 0)
			return -1;
		if (players[curPlayer].name != username)
			return -1;
		ret = board[pos];
		if (board[pos] < 0)
			return -1;
		
		if (step == 0) {
			lastTurn.pos1 = pos;
			lastTurn.val1 = ret;
			step++;
		}
		else {
			if (board[pos] == board[lastTurn.pos1]) {
				board[pos] = -1;
				board[lastTurn.pos1] = -1;
				players[curPlayer].score++;
				console.log('player: ', players[curPlayer].name, 'Score: ', players[curPlayer].score);
				calcPairsLeft();
			}
//			else {
				curPlayer++;
				curPlayer = curPlayer % players.length;
//			}
			lastTurn.pos2 = pos;
			lastTurn.val2 = ret;
			console.log('Player:', curPlayer);
			step = 0;
		}
		lastActivity = Date.now();
		started = true;
		return ret;
	};
	
	// current state of game
	this.GetState = function() {
		var state = {curPlayer: curPlayer,
					players: players,
					step: step, 
					left: pairsLeft,
					last: lastTurn};
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
		else if (pairsLeft <= 0)
			return false;
		else
			return true;
	};
	
	// called by housekeeping to act in behalf of computer players
	this.Process = function() {
		if (players[curPlayer].type != player.usertype.COMPUTER)
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