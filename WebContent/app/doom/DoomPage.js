
$(document).bind("mobileinit", function(){
	$.mobile.page.prototype.options.domCache = false;    
	$.mobile.ajaxEnabled = true;
});

var gameApp = null;
var initialized = false;
var gamepads = null;
var interval = null;
var intervalGP = null;
var start = null;


function page_init(THREE,FBXLoader) { //fbxLoader,mtlLoader	

	window.addEventListener("gamepadconnected", function() {
		startApp(THREE,FBXLoader);
		intervalGP = setInterval(executeListener,100);
	});
	window.addEventListener("gamepaddisconnected", function() {
	  rAFStop(start);
	});
	if(!('GamepadEvent' in window)) {
	  interval = setInterval(pollGamepads, 500);
	}
};//end function


function startApp(THREE,FBXLoader) {
	
	gameApp = new AppDoom(THREE,FBXLoader);
		
};//end function

function pollGamepads() {
  for (var i = 0; i < gamepads.length; i++) {
    var gp = gamepads[i];
    if(gp) {
      	gameLoop();
     	clearInterval(interval);
    }
  }
}//end function

function executeListener() {
  	gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  	if (!gamepads)return;
  		
  	if(gameApp != null){
		gameApp.updateControlGamePad(gamepads[0]); 
	}
}//end function	

function gameLoop() {
  	gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  	if (!gamepads)return;
    start = rAF(gameLoop);
};//end function


function setPlayerView(viewId) {	
	console.log(viewId);
}//end function



