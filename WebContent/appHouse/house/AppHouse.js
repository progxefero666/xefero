/**
 * class AppHouse
 */
var thisAppHouse = null;
class AppHouse{
		
    //constructor	this.app_THREE 	 	= THREE;
	constructor(THREE,FBXLoader,PointerLockControls) {
		this.app_THREE 	= THREE;
		thisAppHouse = this;		
		this.wglApp = new AppHouseWgl(this,THREE,FBXLoader,PointerLockControls);	
		this.init();
	}//end constructor
		
	init(){			
		this.state = 'intro';								
		document.body.style.cursor = 'none';	
		this.loadListeners();		
	}//end function
	
	reset(){
		document.body.style.cursor = 'default';
		$('#wglCursorContainer').fadeOut('slow'); 		
	}
			
	loadListeners(){
		document.getElementById('instructions').addEventListener( 'click',this.onIntroClick );
		
		document.body.addEventListener( 'click',this.onPointerClick );
		document.getElementById('wglCursorContainer').addEventListener( 'click',this.onPointerClick );
	}//end function
	
	onIntroClick(event){		
		thisAppHouse.wglApp.controls.lock();
		event.stopPropagation();
		thisAppHouse.prepareWglCursor();
				
	}//end function
		
	onPointerClick(event){	
		if(thisAppHouse.wglApp.controls.isLocked ){
			console.log('onPointerClick');
		}					
		/*		
		let coordX = ( ( event.clientX - thisAppWglHouse.boundingClientRect.left ) / 
					 ( thisAppWglHouse.boundingClientRect.right - thisAppWglHouse.boundingClientRect.left ) ) * 2 - 1;
		let coordY =  - ( ( event.clientY - thisAppWglHouse.boundingClientRect.top ) /
					 ( thisAppWglHouse.boundingClientRect.bottom - thisAppWglHouse.boundingClientRect.top) ) * 2 + 1;
		thisAppWglHouse.mousePointer.x = coordX;
		thisAppWglHouse.mousePointer.y = coordY;
		console.log(thisAppWglHouse.mousePointer.x);
		*/	
		thisAppHouse.wglApp.checkInters = true;	
	}//end function
			
	prepareWglCursor(){		
		let cursoSize = 52;	
		let cursorLeft 		= Math.floor(this.wglApp.monitor.widthHalf - (cursoSize/2)); 
		let cursorTop 		= Math.floor(this.wglApp.monitor.heightHalf - (cursoSize/2)); 								   	
		let strcursorLeft	= cursorLeft.toString().concat('px');	
		let strcursorTop= cursorTop.toString().concat('px');	
		//$('#wglCursorContainer').width(0);
		$('#wglCursorContainer').css('top',strcursorTop);
		$('#wglCursorContainer').css('left',strcursorLeft);		
		$('#wglCursorContainer').fadeIn('slow');	
	}//end function
				
	/*				
	$('#storeCar').click(function(){	});			

	*/	
		
}//end class