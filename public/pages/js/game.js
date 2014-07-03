(function($){

	var gameId = -1;
	var user = "";
	var board = [];
	var step = 0;
	var pos1 = undefined;
	var pos2 = undefined;
	var val1 = -1;
	var val2 = -1;
	
	$.ajaxSetup({ cache: false });
	
	LayoutBoard();
	
	$(document).ready(function($){ 
		$("body").fadeIn(1000);
		parent.ResizeFrame();
		step = 3;
		GetUser();
	});

	$('li').on( 'click', function( event ) {
		var idx = $(this).index();
		// try card
		if (board[idx] == 1 && step < 2) {
			TurnCard(idx);
		}
	});
	
	
	// ----------------------------------------------
	
	function LayoutBoard() {
		var tile = '<li><img src="images/back.png" data-large="images/back.png"/><div class="image_title"><h5 class="title"></h5></div></li>';
		var list = "";
		for (var i=0; i<16; i++) {
			list += tile;
			board[i] = 1;
		}
		$('#list').html(list);
	};
	
	function FinishMove(idx1, idx2, match, setStep) {
		console.log('FinishMode: ', match);
		if (match) {
//			$('img', idx1).attr('src', "images/logo.jpg");
//			$('img', idx2).attr('src', "images/logo.jpg");
			board[$(idx1).index()] = 0;
			board[$(idx2).index()] = 0;
		}
		else {
			$('img', idx1).attr('src', "images/back.png");
			$('img', idx2).attr('src', "images/back.png");
		}
		step = setStep;
	}
	
	function GetUser() {
		var ctx = window.location.pathname;
		ctx = ctx.substring(0, ctx.lastIndexOf("/"));
		ctx = ctx.substring(0, ctx.lastIndexOf("/") + 1);
		var url = ctx + "users/currentUser";
		$.get( url, function(data) {
			if (data.username && data.username != "") {
				user = data.username;
				RequestGame(data.username);
			}
		});	
	};
	
	function RequestGame(user) {
		var ctx = window.location.pathname;
		ctx = ctx.substring(0, ctx.lastIndexOf("/"));
		ctx = ctx.substring(0, ctx.lastIndexOf("/") + 1);
		var url = ctx + "game/reqgame";
		
		$.get( url, {user:user}, function(data) {
			gameId = data.id;
		});	
	};
	
	function TurnCard(idx) {
		var ctx = window.location.pathname;
		ctx = ctx.substring(0, ctx.lastIndexOf("/"));
		ctx = ctx.substring(0, ctx.lastIndexOf("/") + 1);
		var url = ctx + "game/playgame";
		if ($(pos1).index() == idx) {
		    console.log("double click same card");
		    return;
		}
		
		$.get( url, {gameid: gameId, user:user, pos: idx}, function(data) {
			if (data.card < 0) {
				alert("no card at this index");
				return;
			}
			step++;
			var file = 'images/cards/card'+data.card+'.jpg';
			if (step <= 1) {
				pos1 = $('#list > li').eq(idx);
				val1 = data.card;
				$('img', pos1).attr('src', file);	
			}
			else {
				pos2 = $('#list > li').eq(idx);
				val2 = data.card;
				$('img', pos2).attr('src', file);
				var match = false;
				if (val1 == val2) {
					match = true;
					console.log("---------- match");
				}
				setTimeout(FinishMove, 3000, pos1, pos2, match, 3);
			}
		});	
	};
	
	function GetState() {
		var ctx = window.location.pathname;
		ctx = ctx.substring(0, ctx.lastIndexOf("/"));
		ctx = ctx.substring(0, ctx.lastIndexOf("/") + 1);
		var url = ctx + "game/querygame";
		
		$.get( url, {gameid:gameId}, function(data) {
			if (data.active) {
				var player = data.state.players[data.state.curPlayer].name;
				
				for (var i=0; i<2; i++) {
					if (data.state.players[i].name == user) {
						$('#homescore').text(data.state.players[i].score);
						if (step == 0)
							$('#curplayer').text(data.state.players[i].name);
					}
					else {
						$('#visitorscore').text(data.state.players[i].score);
						if (step == 3)
							$('#curplayer').text(data.state.players[i].name);
					}
				}
				
				if (step == 3 && player == user) {
					step++;
					var lastTurn = data.state.last;
					if (lastTurn.val1 != -1) {
						var idx = lastTurn.val1;
						var file = 'images/cards/card'+idx+'.jpg';
						pos1 = $('#list > li').eq(lastTurn.pos1);
						$('img', pos1).attr('src', file);
						idx = lastTurn.val2;
						file = 'images/cards/card'+idx+'.jpg';
						pos2 = $('#list li').eq(lastTurn.pos2);
						$('img', pos2).attr('src', file);
						var match = lastTurn.val1 == lastTurn.val2;
						console.log('call FinishMode');
						setTimeout(FinishMove, 3000, pos1, pos2, match, 0);
					}
					else {
						$('#curplayer').text(user);
						step = 0;
					}
				}
			}
		});
	}
	
	setInterval(GetState, 2000);
	
})(jQuery);

