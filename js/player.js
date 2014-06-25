function Player(name, usertype) {
	this.name = name;
	this.type = usertype;
	this.score = 0;
	this.level = 4;      //number of last pairs a computer player can remember
	
	var board = [];
	var width = 0;
	var height = 0;
	var memory = [];
	
	this.Prepare = function(x,y) {
		for (var i=0; i<x; i++) {
			board[i] = [];
			for (var j=0; j<y; j++) {
				board[i][j] = 1; // indicate a card, 0 for no card
			}
		}
		width = x;
		height = y;
	};
	
	// for computer player
	this.Play = function(game) {
		// check if this is our turn
		var state = game.GetState();
		if (state.user != this)
			return;
		
		// look at last cards of other player
		var lastTurn = game.GetLast();
	    if (lastTurn.val1 == lastTurn.val2) {
	    	board[lastTurn.x1][lastTurn.y1] = 0;
	    	board[lastTurn.x2][lastTurn.y2] = 0;
	    }
	    else {
	    	var mem = {x: lastTurn.x1, y: lastTurn.y1, val: lastTurn.val1};
	    	memory.push(mem);
	    	var mem = {x: lastTurn.x2, y: lastTurn.y2, val: lastTurn.val2};
	    	memory.push(mem);
	    }
	    
	    // adjust memory to player level
	    while (memory.length > level) {
	    	memory.pop();
	    }
	    
	    // check our memory for a match
	    var match = -1;
	    for (var i=0; i<memory.length; i++) {
	    	for (var j=i+1; j<memory.length; j++) {
	    		if (memory[i].val == memory[j].val) {
	    			match = i;
	    			break;
	    		}
	    	}
	    }
	    
	    // step one
	    var x1 = -1;
	    var y1 = -1;
	    if (match != -1) {
	    	x1 = memory[match].x;
	    	y1 = memory[match].y;
	    }
	    else {
	    	// try the first available
	    	for (var i=0; i<width; i++) {
	    		for (var j=0; j<height; j++) {
	    			if (board[i][j] == 1) {
	    				x1 = i;
	    				y1 = j;
	    				break;
	    			}
	    		}
	    		if (x1 != -1)
	    			break;
	    	}
	    }
	    var card1 = game.TurnCard(this, x1, y1);
	    
	    // step 2, check memory first
	    var x2 = -1;
	    var y2 = -1;
	    for (var i=0; i<memory.length; i++) {
	    	if (memory[i].val == card1) {
	    		x2 = memory[i].x;
	    		y2 = memory[i].y;
	    		break;
	    	}
	    }
	    if (x2 == -1) {
	    	// try the first available
	    	for (var i=0; i<width; i++) {
	    		for (var j=0; j<height; j++) {
	    			if (board[i][j] == 1) {
	    				x2 = i;
	    				y2 = j;
	    				break;
	    			}
	    		}
	    		if (x2 != -1)
	    			break;
	    	}
	    }
	    var card2 = game.TurnCard(this, x2, y2);
	    
	    // check if we have a match
	    if (card1 == card2) {
	    	board[card1.x][card1.y] = 0;
	    	board[card2.x][card2.y] = 0;
	    }
	};
}

Player.usertype = {
	HUMAN: 0,
	COMPUTER: 1
};

module.exports = Player;
