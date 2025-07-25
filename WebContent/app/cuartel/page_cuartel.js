
// @ts-ignore
$(document).bind("mobileinit", function(){
	// @ts-ignore
	$.mobile.page.prototype.options.domCache = false;    
	// @ts-ignore
	$.mobile.ajaxEnabled = true;
});

var wglApp = null;
var initialized = false;


function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	if(wglApp!=null){
		wglApp.onPointerMove(event);		
	}
}


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


function page_init(THREE,FBXLoader,OrbitControls) { //fbxLoader,mtlLoader	
	
	//prepareMainMenu();
	
	// @ts-ignore
	var stlmonitorWidth = Math.round($('#containerMonitor').width()/1.05);
	var stlmonitorHeight = 400; //stlmonitorWidth; //stlmonitorWidth	
	var objCanvas = document.getElementById("gl_canvas");

	document.addEventListener('keypress', (event) => {
	
	  var keyValue = event.key;
	  var codeValue = event.code;
	  console.log("keyValue: " + keyValue);
	  console.log("codeValue: " + codeValue);
	
	}, false)

	

	//Application Harley
	//..........................................................
	
	wglApp = new WebGLAppCuartel(
		objCanvas,stlmonitorWidth,stlmonitorHeight,THREE,FBXLoader,OrbitControls);
	
	//wglApp = new WebGLAppPruebas(
	//	objCanvas,stlmonitorWidth,stlmonitorHeight,
	//	THREE,FBXLoader,OrbitControls);
	
		
	//window.addEventListener( 'pointermove', onPointerMove );
	
	prepareMainMenu();
	
};//end function


// @ts-ignore
function onAlert(exeIndex) {	
	//this.renderFractalImage(exeIndex);
}//end function

function prepareMainMenu() {
	

	// @ts-ignore
	$('#opcion_1').click(function(){		
		wglApp.executeTest();
	});	
	
	// @ts-ignore
	$('#opcion_2').click(function(){		
		alert('#opcion_2');	
	});	

	// @ts-ignore
	$('#opcion_3').click(function(){		
		alert('#opcion_3');	
	});	

	// @ts-ignore
	$('#opcion_4').click(function(){		
		alert('#opcion_4');		
	});	

	// @ts-ignore
	$('#opcion_5').click(function(){		
		alert('#opcion_5');		
	});	



}//end



