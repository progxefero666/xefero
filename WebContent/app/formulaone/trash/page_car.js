
$(document).bind("mobileinit", function(){
	$.mobile.page.prototype.options.domCache = false;    
	$.mobile.ajaxEnabled = true;
});

var wglApp = null;
var initialized = false;
var gamepads = null;
var interval = null;
var intervalGP = null;
var start = null;

function prepareByPlatform() {
	var vwidth = $(window).width();
	
	
	 		
	/*
	if(vwidth< 600) {    	    	 
		countGalleryPictures = 2;		
        $('.layout_common').css('width', '96%');
    	$('.layout_mobile').css('width', '0%');
    	$('.layout_mobile').css('border-width', '0px');
    	$('.layout_mobile').css('-webkit-border-radius', '0px');	
    	$('.layout_mobile').opcion_2('-moz-border-radius', '0px');
    	$('.layout_mobile').css('border-radius', '0px');
    	
    	$('.container_not_mobile').css('display', 'none');    	    	
	}    			
    else{    	
    	countGalleryPictures = 3;
        $('.layout_common').css('width', '70%');
    	$('.layout_mobile').css('width', '26%');
    	$('.layout_mobile').css('border-width', '2px');
    	$('.layout_mobile').css('-webkit-border-radius', '2px');	
    	$('.layout_mobile').css('-moz-border-radius', '2px');
    	$('.layout_mobile').css('border-radius', '2px');  
    	$('.container_not_mobile').css('display', 'block');
    }   
    */
}//end   


function page_init(THREE,FBXLoader,OBJLoader,MTLLoader,OrbitControls) { //fbxLoader,mtlLoader	
	// $("#gl_canvas").css("cursor", "none");
	window.addEventListener("gamepadconnected", function() {
		startApp(THREE,FBXLoader,OBJLoader,MTLLoader,OrbitControls);
		intervalGP = setInterval(executeListener,100);
	});
	window.addEventListener("gamepaddisconnected", function() {
	  rAFStop(start);
	});
	if(!('GamepadEvent' in window)) {
	  interval = setInterval(pollGamepads, 500);
	}
		
	prepareMainMenu();

};//end function


function startApp(THREE,FBXLoader,OBJLoader,MTLLoader,OrbitControls) {
	var stlmonitorWidth = Math.round($('#containerMonitor').width());
	var stlmonitorHeight = 400; //stlmonitorWidth; //stlmonitorWidth	
	var objCanvas = document.getElementById("gl_canvas");
	wglApp = new WebGLAppCar(
		objCanvas,stlmonitorWidth,stlmonitorHeight,THREE,FBXLoader,OBJLoader,MTLLoader,OrbitControls);		
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
  		
  	if(wglApp != null){
		wglApp.updateControlGamePad(gamepads[0]); 
	}
}//end function	

function gameLoop() {
  	gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  	if (!gamepads)return;
    start = rAF(gameLoop);
};//end function


function onAlert(exeIndex) {	
	//this.renderFractalImage(exeIndex);
}//end function

function prepareMainMenu() {
	

	$('#opcion_1').click(function(){		
		wglApp.executeFire();
	});	
	
	$('#opcion_2').click(function(){		
		
	});	

	$('#opcion_3').click(function(){		
		//wglApp.active = false;	
	});	

	$('#opcion_4').click(function(){		
		//wglApp.start();	
	});	

	$('#opcion_5').click(function(){		
		alert('#opcion_5');		
	});	


	$('#model_1').click(function(){		
		wglApp.chargeNewTexture(0);
	});	
	
	$('#model_2').click(function(){		
		wglApp.chargeNewTexture(1);
	});	

	$('#model_3').click(function(){		
		wglApp.chargeNewTexture(2);	
	});	

	$('#model_4').click(function(){		
		wglApp.chargeNewTexture(3);
	});	

	$('#model_5').click(function(){		
		wglApp.chargeNewTexture(4);	
	});	

}//end

