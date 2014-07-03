(function($){

    $.ajaxSetup({ cache: false });
    
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
	    
	    var frame = document.getElementById("iframe");
	    var frameDoc = frame.contentDocument || frame.contentWindow.document;
	    frameDoc.removeChild(frameDoc.documentElement);
	    
		if ($( this ).text() == "Sign In"){
		    $('#iframe').data('location', 'login.html');
		    $('#iframe').attr('src', 'login.html');
		}
		else if ($( this ).text() == "Register"){
		    $('#iframe').data('location', 'register.html');
		    $('#iframe').attr('src', 'register.html');
		}
		else  if ($( this ).text() == "Computer"){
		    $('#iframe').data('location', 'game.html');
		    $('#iframe').attr('src', 'game.html');
		}
	});
	

	$('#iframe').load(function(){
	    //The iframe has loaded or reloaded. 
	    var url = document.getElementById("iframe").contentWindow.location.pathname;
	    var currentFrame = $('#iframe').data('location');
	    if (currentFrame) {
	        if(url.substr(url.length - currentFrame.length) != currentFrame) {
	            console.log("url:", url, "cur: ", currentFrame);
	            ShowWelcome();
	        }
	    }
	    else
	        ShowWelcome();
	});
	
	$(document).ready(function($){ 
		$('#topNav').show();
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
	    		 $("#logon").after("<ul><li id=\"logout\"><a href=\"#\" title=\"log out\">logout</a></li></ul>");

	    		 if ($("#logon_li").find("ul").length > 0) {

	    		     $("<span>").text("^").appendTo($("#logon_li").children(":first"));

	    		     //show subnav on hover
	    		     $("#logon_li").mouseenter(function() {
	    		         $(this).find("ul").stop(true, true).slideDown();
	    		     });

	    		     //hide submenus on exit
	    		     $("#logon_li").mouseleave(function() {
	    		         $(this).find("ul").stop(true, true).slideUp();
	    		     });
	    		 }
	    		 
	    		 $( '#logout' ).on( 'click', function( event ) {
	    		     logout();
	    		 });
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
	         $('#logon').text("Sign In");
	         $("#logon_li").find("ul").each(
	           function() {
	             var elem = $(this);
	               elem.remove();
	           }
	         );
	    	 ShowWelcome();
	     }
	});
}

function ResizeFrame() {
    var content = document.getElementById("iframe");
    content.height = content.contentWindow.document.body.scrollHeight + 20 + "px";
    content.width = content.contentWindow.document.body.scrollWidth + 20 + "px";
}

function ShowWelcome() {
    $('#iframe').data('location', 'welcome.html');
    $('#iframe').attr('src', 'welcome.html');
}

function LoggedIn() {
    checkUser();
    ShowWelcome();
}