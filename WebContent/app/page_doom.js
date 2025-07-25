
// @ts-ignore
$(document).bind("mobileinit", function(){
	// @ts-ignore
	$.mobile.page.prototype.options.domCache = false;    
	// @ts-ignore
	$.mobile.ajaxEnabled = true;
});

var wglApp = null;
var initialized = false;
var gamepads = null;
var interval = null;
var intervalGP = null;
var start = null;

function prepareByPlatform() {
	// @ts-ignore
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


function page_init(THREE,FBXLoader,FirstPersonControls,PointerLockControls) { //fbxLoader,mtlLoader	
	 // @ts-ignore
	 $("#gl_canvas").css("cursor", "none")
	window.addEventListener("gamepadconnected", function() {
		startApp(THREE,FBXLoader,FirstPersonControls,PointerLockControls);
		intervalGP = setInterval(executeListener,100);
	});
	window.addEventListener("gamepaddisconnected", function() {
	  // @ts-ignore
	  rAFStop(start);
	});
	if(!('GamepadEvent' in window)) {
	  interval = setInterval(pollGamepads, 500);
	}
		
	prepareMainMenu();

};//end function


function startApp(THREE,FBXLoader,FirstPersonControls,PointerLockControls) {
	// @ts-ignore
	var stlmonitorWidth = Math.round($('#containerMonitor').width());
	var stlmonitorHeight = 500;// stlmonitorWidth ;	
	var objCanvas = document.getElementById("gl_canvas");
	wglApp = new WebGLAppDoom(
		objCanvas,stlmonitorWidth,stlmonitorHeight,
		THREE,FBXLoader,FirstPersonControls,PointerLockControls);		
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
  	// @ts-ignore
  	gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  	if (!gamepads)return;
  		
  	if(wglApp != null){
		wglApp.updateControlGamePad(gamepads[0]); 
	}
}//end function	

function gameLoop() {
  	// @ts-ignore
  	gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  	if (!gamepads)return;
    // @ts-ignore
    start = rAF(gameLoop);
};//end function


// @ts-ignore
function onAlert(exeIndex) {	
	//this.renderFractalImage(exeIndex);
}//end function

function prepareMainMenu() {
	

	// @ts-ignore
	$('#opcion_1').click(function(){		
		wglApp.executeFire();
	});	
	
	// @ts-ignore
	$('#opcion_2').click(function(){		
		
	});	

	// @ts-ignore
	$('#opcion_3').click(function(){		
		//wglApp.active = false;	
	});	

	// @ts-ignore
	$('#opcion_4').click(function(){		
		//wglApp.start();	
	});	

	// @ts-ignore
	$('#opcion_5').click(function(){		
		alert('#opcion_5');		
	});	


	// @ts-ignore
	$('#model_1').click(function(){		
		wglApp.chargeNewTexture(0);
	});	
	
	// @ts-ignore
	$('#model_2').click(function(){		
		wglApp.chargeNewTexture(1);
	});	

	// @ts-ignore
	$('#model_3').click(function(){		
		wglApp.chargeNewTexture(2);	
	});	

	// @ts-ignore
	$('#model_4').click(function(){		
		wglApp.chargeNewTexture(3);
	});	

	// @ts-ignore
	$('#model_5').click(function(){		
		wglApp.chargeNewTexture(4);	
	});	

}//end

