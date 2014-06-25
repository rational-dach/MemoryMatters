(function($){

	//cache nav
	var nav = $("#topNav");

	checkUser();
	
	//add indicators and hovers to submenu parents
	nav.find("li").each(function() {
		if ($(this).find("ul").length > 0) {

			$("<span>").text("^").appendTo($(this).children(":first"));

			//show subnav on hover
			$(this).mouseenter(function() {
				$(this).find("ul").stop(true, true).slideDown();
			});

			//hide submenus on exit
			$(this).mouseleave(function() {
				$(this).find("ul").stop(true, true).slideUp();
			});
		}
	});
	
	$( 'li' ).on( 'click', function( event ) {
		if ($( this ).text() == "Open Old Game"){
			window.location.href='./../indexOld.html';
		}
	});

	$( '#logon' ).on( 'click', function( event ) {
		if ($( this ).text() == "Sign In"){
			window.location.href='login.html';
		}
	});
	
	$( 'li' ).on( 'click', function( event ) {
		if ($( this ).text() == "logout"){
		logout();
		}
	});

	$( 'li' ).on( 'click', function( event ) {
		if ($( this ).text() == "Register"){
			window.location.href='register.html';
		}
	});

	$( 'li' ).on( 'click', function( event ) {
		if ($( this ).text() == "Computer"){
			window.location.href='game.html';
		}
	});
		
})(jQuery);

function checkUser() {
	var ctx = window.location.pathname;
	ctx = ctx.substring(0, ctx.lastIndexOf("/"));
	ctx = ctx.substring(0, ctx.lastIndexOf("/") + 1);
	var url = ctx + "users/currentUser";
	
	$.ajax({
	     async: false,
	     type: 'GET',
	     url: url,
	     success: function(data) {
	    	 if (data.username && data.username != "") {
	    		 $('#logon').text(data.username);
	    		 $("#logon").after("<ul><li><a href=\"#\" title=\"Sub Nav Link 1\">logout</a></li></ul>");
	    		 $("<span>").text("^").appendTo($("#logon").children(":first"));
	    	 }
	     }
	});
};

function logout() {
	var ctx = window.location.pathname;
	ctx = ctx.substring(0, ctx.lastIndexOf("/"));
	ctx = ctx.substring(0, ctx.lastIndexOf("/") + 1);
	var url = ctx + "users/logout";
	
	$.ajax({
	     async: false,
	     type: 'GET',
	     url: url,
	     success: function(data) {
	    	 location.reload();
	     }
	});
}