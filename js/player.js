function Player(name, usertype) {
    this.name = name;
    this.type = usertype;
    this.score = 0;
    this.level = 6;      //number of last pairs a computer player can remember

    var self = this;
    var board = [];
    var width = 0;
    var height = 0;
    var memory = [];

    this.Prepare = function(x,y) {
        for (var i=0; i<x*y; i++) {
            board[i] = 1; // indicate a card, 0 for no card
        }
        width = x;
        height = y;
    };

    // for computer player
    this.Play = function(game) {
        // check if this is our turn
        var state = game.GetState();
        if (state.players[state.curPlayer] != this)
            return;

        // look at last cards of other player
        var lastTurn = game.GetLast();
        if (lastTurn.val1 == lastTurn.val2) {
            board[lastTurn.pos1] = 0;
            board[lastTurn.pos2] = 0;
        }

        // push to memory
        var mem = {pos: lastTurn.pos1, val: lastTurn.val1};   	
        memory.push(mem);
        mem = {pos: lastTurn.pos2, val: lastTurn.val2};
        memory.push(mem);

        AdjustMemory();

        // check our memory for a match
        var match = -1;
        for (var i=0; i<memory.length; i++) {
            for (var j=i+1; j<memory.length; j++) {
                if (memory[i].val == memory[j].val && memory[i].pos != memory[j].pos) {
                    match = i;
                    break;
                }
            }
            if (match != -1)
                break;
        }

        // step one
        var pos1 = -1;
        if (match != -1) {
            pos1 = memory[match].pos;
        }
        else {
            // try the first available
            for (var i=0; i<width*height; i++) {
                if (board[i] == 1) {
                    pos1 = i;
                    break;
                }
            }
        }
        var card1 = game.TurnCard(this.name, pos1);
        mem = {pos: pos1, val: card1};
        memory.push(mem);
        console.log('computer card 1: ', card1, 'at pos: ', pos1);

        // step 2, check memory first
        var pos2 = -1;
        for (var i=0; i<memory.length; i++) {
            if (memory[i].val == card1) {
                if (memory[i].pos == pos1)
                    continue;
                pos2 = memory[i].pos;
                break;
            }
        }
        if (pos2 == -1) {
            // try the first available
            for (var i=0; i<width*height; i++) {
                if (board[i] == 1 && i != pos1) {
                    pos2 = i;
                    break;
                }
            }
        }
        var card2 = game.TurnCard(this.name, pos2);
        mem = {pos: pos2, val: card2};
        memory.push(mem);
        console.log('computer card 2: ', card2, 'at pos: ', pos2);

        // check if we have a match
        if (card1 == card2) {
            board[pos1] = 0;
            board[pos2] = 0;
            AdjustMemory();
        }
    };

    function AdjustMemory() {
        // clear invalid cards
        for (var i=0; i<memory.length; i++) {
            if (board[memory[i].pos] != 1 || memory[i].val == -1)
                memory.splice(i--, 1);
        }

        // adjust memory to player level
        while (memory.length > self.level) {
            memory.shift();
        }
    }
}

Player.usertype = {
        HUMAN: 0,
        COMPUTER: 1
};

module.exports = Player;
