
// @ts-ignore
$(document).bind("mobileinit", function(){
	// @ts-ignore
	$.mobile.page.prototype.options.domCache = false;    
	// @ts-ignore
	$.mobile.ajaxEnabled = true;
});

var wglApp = null;
var initialized = false;


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
	
	prepareMainMenu();
	
	// @ts-ignore
	var stlmonitorWidth = Math.round($('.container_editor_right').width()/1.05);
	var stlmonitorHeight = stlmonitorWidth ;	
	var objCanvas = document.getElementById("gl_canvas");

	//Application Personaje Woman
	//..........................................................
	wglApp = new WebGLAppWoman(
		objCanvas,stlmonitorWidth,stlmonitorHeight,
		THREE,FBXLoader,FlyControls,OrbitControls);
		
	//Application Personaje Man
	//..........................................................
	//wglApp = new WebGLAppMan(
	//	objCanvas,stlmonitorWidth,stlmonitorHeight,
	//	THREE,FBXLoader,null,OrbitControls);		
	
};//end function


// @ts-ignore
function onAlert(exeIndex) {	
	//this.renderFractalImage(exeIndex);
}//end function

function prepareMainMenu() {
	

	// @ts-ignore
	$('#opcion_1').click(function(){		
		wglApp.executeAnimation();
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

		/*
		var elements=[
			{
				"id":"manmesh.fbx",
				"parent_id":null,
				"position":[0,-60,0],
				"color":[0.0352941,0.0352941,0.0352941,1.0],
				"textures":"completa.jpg"
			}
		];
		this.grpItems =new WebGL_grpobjects('manmesh',[0,0,0],elements,'data/manmesh/');	
		this.grpItems.position[1] = -60;
		this.grpItems.loadWglObjects(THREE,this.scene,fbxLoader,new THREE.TextureLoader());
		*/
		/*
		this.webGL_item = new  WebGL_textobject(
			null,'manmesh.fbx',[0.0352941,0.0352941,0.0352941,1.0],
			[0,-60,0],1.0,'data/manmesh/','completa.jpg',null,null
		);
		
		this.webGL_item.loadWglObject(THREE,this.scene,fbxLoader,new THREE.TextureLoader());
		*/

