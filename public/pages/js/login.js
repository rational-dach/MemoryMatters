(function($){
	$("#menu").load("menu.html");
	
	$("#Button1").on( 'click', function( event ) {
		login();
	});
})(jQuery);

function login() {
	var ctx = window.location.pathname;
	ctx = ctx.substring(0, ctx.lastIndexOf("/"));
	ctx = ctx.substring(0, ctx.lastIndexOf("/") + 1);
	var url = ctx + "users/login";
	var userId = $('[name="userId"]').val();
	var password = $('[name="password"]').val();
	
	$.get( url, { userId:userId, password:password}, function(data) {
		if (data.loggedIn == "true")
			console.log("yes");
		else
			console.log("no");
	});	
};