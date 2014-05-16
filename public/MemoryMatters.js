/*
 * @autor: Talla Romual
 * @version: 1.0
 * @name: MemoryMatters.js
 * */

/**
 global variables
 */
	
var number_of_cards = 0;
var button1, button2;
var id;
var Temp;
var firstcard,secondcard;
var img_name1, img_name2;
var number_of_click = 0;
var button1, button2;
var player1 = 1, computer = 2,player2=3;
var activePlayer = player1;
var fistCard=0,seconCard=0;
var challenger=0;
var difficulty=0,low=1,medium=2,hard=3;
var computerLevel;
		
var array_of_bilder_index = new Array();
var computerArraycardsReal = new Array(); /* to keep id of unopened card for the computer*/
var computerArraycardTemp = new Array(); /* to keep id of unopened card without the id of card pair that were already cliked*/
var array_cards = new Array();
var tempArray = new Array();




		/*  function to start a game*/

function startGame() {
	getSetting();
	// startgame Button hidden
	var startButton = dojo.byId("startgame");
	startButton.style.visibility = "hidden";

	 	//set the  backbutton visible
	var returnButton = document.getElementById("back");
	returnButton.style.visibility = "visible";
}
	/*function to increase the Score*/

function calculateScore() {
	var text = 0;
	if (activePlayer == player1) {
		var player1Score = document.getElementById("score1");
		text = player1Score.innerHTML;
		text = parseInt(text);
		text = text+5;
		player1Score.innerHTML = text.toString();
	} else if (activePlayer == computer||activePlayer == player2){
		var player2Score = document.getElementById("score2");
		text = player2Score.innerHTML;
		text = parseInt(text);
		text = text+5;
		player2Score.innerHTML = text.toString();

	}

}

		/* random function
		 * @return {myarray} the random array
		 * */
function shuffle(myarray) {
	var tmp, rand;
	for ( var i = 0; i < myarray.length; i++) {
		rand = Math.floor(Math.random() * myarray.length);
		tmp = myarray[i];
		myarray[i] = myarray[rand];
		myarray[rand] = tmp;
	}
	return myarray;
}

		/*function to change Player*/

function changePlayer() {
	var text;
	var active_Player = document.getElementById("activePlayer");
	switch(activePlayer){
	case player1:
		if (challenger == computer) {
			window.setTimeout(function(){
				activePlayer = computer;
				text = "Computer";
				active_Player.innerHTML = text;
				computerPlay();
				},1500);
			
		}
		else if(challenger == player2){
			window.setTimeout(function() {
				activePlayer = player2;
				text = "Player2";
				active_Player.innerHTML = text;
			
			}, 1500);
			
		}
		break;
	case computer:
		window.setTimeout(function(){
			activePlayer = player1;
			document.querySelector("body").style.cursor = "auto"; // to show the cursor
			text = "Player1";
			active_Player.innerHTML = text;
		},1500);
		
		break;
	case player2:
		window.setTimeout(function() {
			activePlayer = player1;
			text = "Player1";
			active_Player.innerHTML = text;
			document.querySelector("body").style.cursor = "auto";
		
		}, 1500);
	}
}

		/*function to make computer play*/
function computerPlay() {
	document.querySelector("body").style.cursor = "none";
	computerLevel=difficulty;
	switch(computerLevel){
	case 1:
		firstcard=0,secondcard=0;
		var tmp_firstcard=0;
		var tmp_secondcard=0;
		while(tmp_firstcard==tmp_secondcard){
			tmp_firstcard = Math.floor((Math.random() *computerArraycardsReal.length)+1);
			tmp_secondcard = Math.floor((Math.random() *computerArraycardsReal.length)+1);
			}
		firstcard=computerArraycardsReal[tmp_firstcard-1];
		secondcard=computerArraycardsReal[tmp_secondcard-1];
		button1= document.getElementById(firstcard);
		button2= document.getElementById(secondcard);
		img_name1=button1.firstChild.getAttribute("alt");
		img_name2=button2.firstChild.getAttribute("alt");
		window.setTimeout(function() {
			turn(button1);
			turn(button2);
			compare(img_name1, img_name2);
		},1000);
		
		break;
	case 2:
		/*hilf = firstcard;
		secondcard=0;
		//computerArraycardTemp=new Array();
		computerArraycardTemp = cutArray(computerArraycardsReal,hilf,0);
		alert(computerArraycardTemp );
		var tmp_secondcard = Math.floor((Math.random() *computerArraycardTemp.length)+1);
		var tmp_firstcard = Math.floor((Math.random() *computerArraycardTemp.length)+1);
		secondcard = computerArraycardsReal[tmp_secondcard-1];
		firstcard = computerArraycardsReal[tmp_firstcard-1];
		button1= document.getElementById(firstcard);
		button2= document.getElementById(secondcard);
		img_name1=button1.firstChild.getAttribute("alt");
		img_name2=button2.firstChild.getAttribute("alt");
		turn(button1);
		turn(button2);
		compare(img_name1, img_name2);
		break;*/
	case 3:
		}
}

		



		/*function to display the message of end of the Game*/
function endGame(){
	var finalScore =null;
	var playerScore = document.getElementById("score1");
	var score1 = playerScore.innerHTML;
	var  challengerScore = document.getElementById("score2");
	var score2 = challengerScore.innerHTML;
	 if (challenger==player2)
	 { finalScore = "PLAYER1: "+score1+" "+"Points"+" "+"PLAYER2: "+score2+" "+"Points";
	 	if(parseInt(score1)< parseInt(score2))
			alert(finalScore+" "+"\n"+"  "+"PLAYER2 WON!!!");
		else if(parseInt(score1)> parseInt(score2))
			alert(finalScore+" "+"\n"+"  "+"PLAYER1 WON!!!");
		else if(parseInt(score1)== parseInt(score2))
			alert(finalScore+"\n"+"  "+"EQUALITY");}
	 else if (challenger==computer)
	 { finalScore = "PLAYER1: "+score1+" "+"COMPUTER: "+score2;
	 if(parseInt(score1)< parseInt(score2))
		alert(finalScore+" "+"\n"+"  "+"COMPUTER WON!!!");
	else if(parseInt(score1)> parseInt(score2))
		alert(finalScore+"\n"+"  "+"PLAYER1 WON!!!");
	else if(parseInt(score1)== parseInt(score2))
		alert(finalScore+"\n"+"  "+"EQUALITY");}
	
}

		/*function to hold Settings*/

 function getSetting(){
  var tmp_difficulty = null;
  var tmp_size = null;
  var tmp_gameMode = null;
  var second_player = document.getElementById("pscore2"); 
  var str = getCookie("json");
  if(typeof str==="undefined"){
	  createDefautGame(); 
	  }
  else{
  var obj = jQuery.parseJSON(getCookie("json"));
  $.each( obj, function( key, value ) {
			if(key == "dificulty")
				tmp_difficulty = value;
			else if(key == "mode")
				tmp_gameMode = value;
			else if(key == "size")
				tmp_size = value;
		});
 
		if(tmp_gameMode == "Man vs Computer"){
			challenger = computer;
			second_player.innerHTML = "COMPUTER:";
				}
		else if(tmp_gameMode == "Man vs Man"){
			challenger = player2;
		second_player.innerHTML = "PLAYER2:";
		}
		if(tmp_size=="3*4 Cards"){
			number_of_cards=12;
			array_of_bilder_index=["circle.png", "diamond.png", "hexagon.png","square.png", "star.png", "triangle.png" ];}
			else if(tmp_size=="3*2 Cards"){
				number_of_cards=6;
		array_of_bilder_index=["circle.png", "diamond.png", "hexagon.png" ];}
				else if(tmp_size=="4*2 Cards"){
					number_of_cards=8;
				array_of_bilder_index=["circle.png", "diamond.png", "hexagon.png","square.png" ];}
				
		if(tmp_difficulty=="LOW")
			difficulty=low;
		else if(tmp_difficulty=="MEDIUM")
			difficulty=medium;
		else if(tmp_difficulty=="HARD")
			difficulty=hard;
		
		createcards(number_of_cards);
  		}
			
  }
 	/* function to create the default game without Setting*/
 function createDefautGame(){
	 number_of_cards=12;
	  activePlayer=0;
	  array_of_bilder_index=["circle.png", "diamond.png", "hexagon.png","square.png", "star.png", "triangle.png" ];
	  mix(12);
	  mix(number_of_cards);
	  var divElement;
		var gridlay;
		 divElement = dojo.byId("mittel");
		 gridlay = new dojox.mobile.GridLayout({cols : 4});
		 gridlay.placeAt(divElement);
		 gridlay.startup();
		 for ( var i = 1; i <=number_of_cards; i++) {
			 
				var cardlay = new dojox.mobile.Pane({
					class : "cardlay"
				});
				var backButton = new dojox.mobile.Button({
					id : i+"3",
					class : "backdiv",
					
				});
				var foreButton = new dojox.mobile.Button({
					id : i,
					class : "forediv",
				
				});

				backButton.set("innerHTML",
						"<img src='WEB-INF/images/back.png' alt='backImage'/>");
				foreButton.set("innerHTML", "<img src='WEB-INF/images/fore/"
						+ array_cards[i-1] + "' alt='" + array_cards[i-1] + "' />");
				backButton.placeAt(cardlay.containerNode);
				foreButton.placeAt(cardlay.containerNode);
				backButton.startup();
				foreButton.startup();
				gridlay.addChild(cardlay);
				
				dojo.connect(backButton, "onClick",function(event){ clickButtom(event);});
					
			 }
	 
 }
 
 	/*function to create the Game/cards
 	 *@param {size} the number of card integer
 	 * */
 function createcards(size){
	  mix(number_of_cards);
	  var divElement;
		var gridlay;
	 
	 switch(number_of_cards){
	 case 6:
	 	divElement = dojo.byId("mittel");
		gridlay = new dojox.mobile.GridLayout({cols : 2});
		gridlay.placeAt(divElement);
		gridlay.startup();
		break;
	 case 8:
		divElement = dojo.byId("mittel");
		gridlay = new dojox.mobile.GridLayout({cols : 2});
		gridlay.placeAt(divElement);
		gridlay.startup();
		 break;
	 case 12:
		 divElement = dojo.byId("mittel");
		 gridlay = new dojox.mobile.GridLayout({cols : 4});
		 gridlay.placeAt(divElement);
		 gridlay.startup();
		}
	 
	
	 
	 for ( var i = 1; i <=number_of_cards; i++) {
		 
		var cardlay = new dojox.mobile.Pane({
			class : "cardlay", style : "height:29%,width:39%"
		});
		var backButton = new dojox.mobile.Button({
			id : i+"3",
			class : "backdiv",
			
		});
		var foreButton = new dojox.mobile.Button({
			id : i,
			class : "forediv",
		
		});

		backButton.set("innerHTML",
				"<img src='WEB-INF/images/back.png' alt='backImage' class='img'/>" );
		foreButton.set("innerHTML", "<img src='WEB-INF/images/fore/"
				+ array_cards[i-1] + "' alt='" + array_cards[i-1] + "'class='img' />");
		
		backButton.placeAt(cardlay.containerNode);
		foreButton.placeAt(cardlay.containerNode);
		backButton.startup();
		foreButton.startup();
		gridlay.addChild(cardlay);
		
		dojo.connect(backButton, "onClick",function(event){ clickButtom(event);});
			
	 }
	 
	 		// set the south div visible 
		var south_div = document.getElementById("south");
		south_div.style.visibility = "visible";
		
			// set activeplayer visiblity
		var activ_player = document.getElementById("activePlayer");
		activ_player.style.visibility = "visible";
			
 }
 
 		/* fonction to mix the array
 		 *@param {size} number of the cards to mix 
 		 * */
 function mix(size){
  	for(var i=1;i<=size;i++){
  		computerArraycardsReal[i-1]=i;
  		if(i<=size/2)
  		tempArray[i-1]=i-1;
  		else
  		tempArray[i-1]=(i-1)-size/2;
  	
  	}
  	tempArray=shuffle(tempArray);
  	for(var j=1;j<=size;j++){
  		array_cards[j-1]=array_of_bilder_index[tempArray[j-1]];
  		
  	}
 }
 
 		/* fonction to rebuild computerArraycardsReal after maching pair
 		 *@param {myarray,firstcard,secondcard} 
 		 *Array of cards 
 		 *id of two maching cards
 		 *@return {myarray} new array without already matching cards
 		 * */
  function cutArray(myarray,firstcard,secondcard){
	  var tmparray = new Array();
	  var j=0;
	  for(var i=0;i<myarray.length;i++){
		  if(myarray[i]!=firstcard && myarray[i]!=secondcard)
			  tmparray[i-j]= myarray[i];
		  else
			  j++;
		   }
	  myarray=tmparray;
	  return myarray;
}
 
 		/* close  unmaching cards pair */
  function closecard(button1,button2){
	  window.setTimeout(function() {
			button1.setAttribute("style", "z-index:0");
			button2.setAttribute("style", "z-index:0");
		}, 1000);
		changePlayer();
  }
 
 		
  /*function to compare the image of cards pair
 		 *@param {img_name1,img_name2} String image of the Cards 
 		 * */
 function compare(img_name1,img_name2){
	 if (img_name1 == img_name2) {
			calculateScore();
		  	number_of_cards -= 2;
			computerArraycardsReal = cutArray(computerArraycardsReal,firstcard,secondcard);
			if (number_of_cards == 0) {
				if(activePlayer==0){alert("YOU WIN");}
				endGame();
				}
			else if (activePlayer == computer) {
				number_of_click = 0;
				computerPlay();
			}
		} 
		else {
			
			closecard(button1,button2);
			}
	}
 
 	/* function to open the card after click
 	 	*@param {temp} typ dojo button 
	 * */
 function turn(temp){
	 temp.setAttribute("style", "z-index:1000");
	}

 		/*fonction to event onclick 
 		 *@param {event} typ mouseEvent 
 		 * */
 function clickButtom(event){
	 id = event.currentTarget.id;
	 id = id.substr(0,(id.length)-1);
	 temp = document.getElementById(id);
	 turn(temp);
	 if (number_of_click == 0) {
			firstcard=id;
			button1 = temp;
			img_name1 = temp.firstChild.getAttribute("alt");
			number_of_click = 1;
		} else {

			secondcard=id;
			button2 = temp;
			img_name2 = temp.firstChild.getAttribute("alt");
			compare(img_name1,img_name2);
			number_of_click = 0;
		}

		
	}

 		/*function to set the Style of Seting Form*/
function gradient(id, level)
{
	var box = document.getElementById(id);
	box.style.opacity = level;
	box.style.MozOpacity = level;
	box.style.KhtmlOpacity = level;
	box.style.filter = "alpha(opacity=" + level * 100 + ")";
	box.style.display="block";
	return;
}


function fadein(id) 
{
	var level = 0;
	while(level <= 1)
	{
		setTimeout( "gradient('" + id + "'," + level + ")", (level* 1000) + 10);
		level += 0.01;
	}
}


	/*fonction to open the form for the Setting
	 *@param {formtitle,fadin} typ string und integer
	 * */
function openbox(formtitle, fadin)
{
  var box = document.getElementById('settingbox'); 
  document.getElementById('shadowing').style.display='block';

  var btitle = document.getElementById('settingboxtitle');
  btitle.innerHTML = formtitle;
  
  if(fadin)
  {
	 gradient("settingbox", 0);
	 fadein("settingbox");
  }
  else
  { 	
    box.style.display='block';
  }  	
}


		/*function to closse the Setting formular */

function closebox()
{
   document.getElementById('settingbox').style.display='none';
   document.getElementById('shadowing').style.display='none';
}




		/* function to create and set a cookie 
		 *@param {c_name,value,exday} for name and value of the cookie(typ string),exday for the date of expiration (typ int)
		 * */
function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
	
}

			/*function to get the cookie value
			 *@param {c_name} cookie name 
			 *@return {y} cookie value
			 **/

function getCookie(c_name)
{  
var i,x,y,array_cookies=document.cookie.split(";");
for (i=0;i<array_cookies.length;i++)
{
  x=array_cookies[i].substr(0,array_cookies[i].indexOf("="));
  y=array_cookies[i].substr(array_cookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

	
		/*jquery function for the click event on setting menu*/
$(document).ready(function(){
	$("#ok").click(function(){
	var dificulty = $("#dificulty option:selected").text();
	var  mode= $("input[type='radio']:checked").val();
	var size = $("#size option:selected").text();
	
		var jsonData = '{"dificulty":"'+dificulty+'","mode":"'+mode+'","size":"'+size+'"}';
		setCookie("json",jsonData,1);
		javascript:location.reload();
		closebox();
	});
});