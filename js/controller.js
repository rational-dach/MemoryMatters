var player = include('js/player.js');
var game = include('js/game.js');

function Controller() {

    var gameRequests = [];
    var games = [];
    var requestID = 0;

    // user reuests a new game
    this.RequestGame = function(user, type) {
        if (type == player.usertype.COMPUTER) {
            var request = {name: user, type: type, time: Date.now(), id: requestID};
            gameRequests.push(request);
            return {id: requestID++};
        }
    };

    // user queries status of game
    this.QueryGame = function(id) {
        for (var i=0; i<games.length; i++) {
            if (games[i].id == id && games[i].IsActive()) {
                var gameState = games[i].GetState();
                var status = {active: true, state: gameState};
                return status;
            }
        }
        var status = {active: false};
        return status;
    };

    // user plays the game
    this.PlayGame = function(id, username, pos) {
        var ret = {card: -1};
        for (var i=0; i<games.length; i++) {
            if (games[i].id == id && games[i].IsActive()) {
                ret.card = games[i].TurnCard(username, pos);
                break;
            }
        }
        return ret;
    };

    // housekeeping, tasks we need to execute without user action
    this.Process = function() {
        // check if we can turn a request into a game
        for (var i=0; i<gameRequests.length; i++) {
            if (gameRequests[i].type == player.usertype.COMPUTER) {
                var newGame = new game(4,4,gameRequests[i].id);
                var player1 = new player("DevOps", player.usertype.COMPUTER);
                newGame.SetPlayer(player1);
                var player2 = new player(gameRequests[i].name, player.usertype.HUMAN);
                newGame.SetPlayer(player2);
                games.push(newGame);
                gameRequests.splice(i--, 1);
            }
        }

        // drop inactive games
        for (var i=0; i<games.length; i++) {
            if (!games[i].IsActive()) {
                games.splice(i--, 1);
            }
            else {
                games[i].Process();
            }
        }
    };
}

module.exports = Controller;