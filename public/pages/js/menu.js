(function($){

    $.ajaxSetup({ cache: false });

    //cache nav
    var nav = $("#topNav");
    var ruleswindow = null;
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

        if ($( this ).text() == "Register"){
            ClearIFrame();
            $('#iframe').data('location', 'register.html');
            $('#iframe').attr('src', 'register.html');
        }
        else  if ($( this ).text() == "Computer"){
            ClearIFrame();
            $('#iframe').data('location', 'game.html');
            $('#iframe').attr('src', 'game.html');
        }
        else if ($ (this).text() == "Rules") {
            if ((ruleswindow == null) || (ruleswindow.closed)) {
                ruleswindow = window.open("gamerules.html","_blank", "top= 10, left=10, width= 600, height = 800");
            }
        else if ($ (this).text() == "about") {
                alert("Memory Matters v0.1");
        }
        }
    });

    $( '#logout_li' ).on( 'click', function( event ) {
        logout();
    });
    $( '#local_li' ).on( 'click', function( event ) {
        ClearIFrame();
        $('#iframe').data('location', 'login.html');
        $('#iframe').attr('src', 'login.html');
    });
    $( '#ibmid_li' ).on( 'click', function( event ) {
        loginIbm();
    });

    ClearLoginMenu();
    checkUser();

    $('#iframe').load(function(){
        //The iframe has loaded or reloaded. 
        var url = document.getElementById("iframe").contentWindow.location.pathname;
        if (url == "/pages/login.html")
            return;

        var currentFrame = $('#iframe').data('location');
        if (currentFrame) {
            if(url.substr(url.length - currentFrame.length) != currentFrame) {
                console.log("url:", url, "cur: ", currentFrame);
                checkUser();
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

    $.get( url, function(data) {
        if (data.username && data.username != "") {
            $('#logon').text(data.username);
            $('#logout_li').show();
            $('#ibmid_li').hide();
            $('#local_li').hide();
            $("<span>").text("^").appendTo($("#logon_li").children(":first"));
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
            ClearLoginMenu();
            ShowWelcome();
        }
    });
}

function ClearLoginMenu() {
    $('#logon').text("Sign In");
    $('#logout_li').hide();
    $('#ibmid_li').show();
    $('#local_li').show();
    $("<span>").text("^").appendTo($("#logon_li").children(":first"));
}

function ResizeFrame() {
    var content = document.getElementById("iframe");
    content.height = content.contentWindow.document.body.scrollHeight + 20 + "px";
    content.width = content.contentWindow.document.body.scrollWidth + 20 + "px";
}

function ClearIFrame() {
    var frame = document.getElementById("iframe");
    var frameDoc = frame.contentDocument || frame.contentWindow.document;
    frameDoc.removeChild(frameDoc.documentElement);
}

function ShowWelcome() {
    $('#iframe').data('location', 'welcome.html');
    $('#iframe').attr('src', 'welcome.html');
}

function LoggedIn() {
    checkUser();
    ShowWelcome();
}

function loginIbm() {
    var ctx = window.location.pathname;
    ctx = ctx.substring(0, ctx.lastIndexOf("/"));
    ctx = ctx.substring(0, ctx.lastIndexOf("/") + 1);
    var url = ctx + "ibmid";

    window.location.href = url;
//  $.get( url, function(data) {
//  }); 
};
