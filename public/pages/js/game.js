(function($){

	var addItem = function(){
		var str = '<li><img src="images/back.png" data-large="images/back.png"/><div class="image_title"><h5 class="title"></h5></div></li>';

		$('#list').html(str+str+str+str+str+str+str+str+str+str+str+str+str+str+str+str);
	};
	addItem();
	$("#menu").load("menu.html");
	
	$(document).ready(function($){ 
		$('#topNav').show();
		$('#play').css("text-decoration","underline");
	});

	$('li').on( 'click', function( event ) {
		//$(this).hide('slow');
		console.log($(this).text());
		$('img', this).attr('src',  "images/logo.jpg");
	});

})(jQuery);

