
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
	if(vwidth< 600) {    	    	 
		// @ts-ignore
		countGalleryPictures = 2;		
        // @ts-ignore
        $('.layout_common').css('width', '96%');
    	// @ts-ignore
    	$('.layout_mobile').css('width', '0%');
    	// @ts-ignore
    	$('.layout_mobile').css('border-width', '0px');
    	// @ts-ignore
    	$('.layout_mobile').css('-webkit-border-radius', '0px');	
    	// @ts-ignore
    	$('.layout_mobile').opcion_2('-moz-border-radius', '0px');
    	// @ts-ignore
    	$('.layout_mobile').css('border-radius', '0px');
    	
    	// @ts-ignore
    	$('.container_not_mobile').css('display', 'none');    	    	
	}    			
    else{    	
    	// @ts-ignore
    	countGalleryPictures = 3;
        // @ts-ignore
        $('.layout_common').css('width', '70%');
    	// @ts-ignore
    	$('.layout_mobile').css('width', '26%');
    	// @ts-ignore
    	$('.layout_mobile').css('border-width', '2px');
    	// @ts-ignore
    	$('.layout_mobile').css('-webkit-border-radius', '2px');	
    	// @ts-ignore
    	$('.layout_mobile').css('-moz-border-radius', '2px');
    	// @ts-ignore
    	$('.layout_mobile').css('border-radius', '2px');  
    	// @ts-ignore
    	$('.container_not_mobile').css('display', 'block');
    }   
}//end   


function page_init(THREE,FBXLoader,FlyControls,OrbitControls) { //fbxLoader,mtlLoader	
	
	window.addEventListener("gamepadconnected", function() {
		startApp(THREE,FBXLoader,FlyControls,OrbitControls);
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

function startApp(THREE,FBXLoader,FlyControls,OrbitControls) {
	// @ts-ignore
	let stlmonitorWidth = Math.round($('.stlmonitor').width()/1.05);
	let stlmonitorHeight =512; //Math.round($('.stlmonitor').height()); //stlmonitorWidth;
	let objCanvas = document.getElementById("gl_canvas");
	wglApp = new WebGLAppUniverse(
		objCanvas,stlmonitorWidth,stlmonitorHeight,
		THREE,FBXLoader,FlyControls,OrbitControls);		
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

function prepareMainMenu() {
	// @ts-ignore
	$('#opcion_1').click(function(){	
		if(wglApp!=null){
			wglApp.executeFire();
		}
	});	
	// @ts-ignore
	$('#opcion_2').click(function(){		
		//document.dispatchEvent(new KeyboardEvent('keypress', {'key': 'H'}));
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
	});	
	// @ts-ignore
	$('#model_2').click(function(){		
	});	
	// @ts-ignore
	$('#model_3').click(function(){		
	});	
	// @ts-ignore
	$('#model_4').click(function(){		
	});	
	// @ts-ignore
	$('#model_5').click(function(){		
	});	

}//end


	/*
	document.addEventListener('keypress', (event) => {
	  var keyValue = event.key;
	  var codeValue = event.code;
	  //console.log("keyValue: " + keyValue);
	  //console.log("codeValue: " + codeValue);
	}, false)
	*/

