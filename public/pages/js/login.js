(function($){
    
    $.ajaxSetup({ cache: false });
    
	$("#Button1").on( 'click', function( event ) {
		login();
	});
	
	$(document).ready(function($){ 
		$("body").fadeIn(1000);
		parent.ResizeFrame();
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
		if (data.loggedIn == "true") {
			console.log("yes");
			//parent.ShowWelcome();
			//parent.checkUser();
			parent.LoggedIn();
		}
		else
			console.log("no");
	});	
};