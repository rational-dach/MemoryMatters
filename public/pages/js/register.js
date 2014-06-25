(function($){
	$("#menu").load("menu.html");
	
	$("#Button1").on( 'click', function( event ) {
		addUser();
	});
	
	$(document).ready(function($){ 
		$('#topNav').show();
		$('#register').css("text-decoration","underline");
	});
	
})(jQuery);

function addUser() {
	var ctx = window.location.pathname;
	ctx = ctx.substring(0, ctx.lastIndexOf("/"));
	ctx = ctx.substring(0, ctx.lastIndexOf("/") + 1);
	var url = ctx + "users/create";
	// console.log(ctx);
	var userId = $('[name="userId"]').val();
	var firstName = $('[name="firstName"]').val();
	var lastName = $('[name="lastName"]').val();
	var eMail = $('[name="eMail"]').val();
	var password = $('[name="password"]').val();
	// check unique userid
	var url2 = ctx + "users/useridcheck";
	$.get( url2, { userId:userId} , function( data ){
		if(data == false){
			window.alert("User ID not unique");
		}
		else{
			$.get( url, { userId:userId, firstName:firstName,lastName:lastName,eMail:eMail,password:password});
		}
	});
}