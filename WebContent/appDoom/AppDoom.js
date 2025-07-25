/**
 * 
 */
/**
 * class AppF1Cronos
 */
class  AppDoom {        
	
	//constructor	
	constructor(THREE,FBXLoader) {
		this.app_THREE 	 = THREE;
		this.gamePadControl = new GamepadControl(this,null);
		this.listenButtonsUnpressed = true;
		this.preparePage();
		this.loadWglApp(THREE,FBXLoader);		
		this.prepareWglCursor();
	}//end constructor
	
	updateControlGamePad(gamePad){
		this.gamePadControl.gamePad = gamePad;
		this.gamePadControl.process();
	}//end function
		
	preparePage(){		
		$('#containerGamePad').css('display', 'none');			
		$('#containerMonitor').fadeIn('slow');
	
	}//end function
		
	loadWglApp(THREE,FBXLoader){
		let objCanvas = document.getElementById("gl_canvas");	
		let monitorWidth	= $('#containerMonitor').width();	
		let glmonitorWidth 	= Math.round(XF_Math.getValuePercent(monitorWidth,99));	
		let glmonitorHeight = Math.round(XF_Math.getValuePercent(monitorWidth,50));		
		this.wglApp = new AppDoomWgl(this,objCanvas,glmonitorWidth,glmonitorHeight,THREE,FBXLoader);		
	}//end function
	
	prepareWglCursor(){						
		let cursoSize = 52;	
		let cursorTop 		= this.wglApp.monitor.top + 
							  Math.floor(this.wglApp.monitor.heightHalf - (cursoSize/2)); 								  
		let cursorLeft 		= this.wglApp.monitor.left + 
							  Math.floor(this.wglApp.monitor.widthHalf - (cursoSize)); 						   	
		let strcursorLeft	= cursorLeft.toString().concat('px');	
		let strcursorTop= cursorTop.toString().concat('px');	
		//$('#wglCursorContainer').width(0);
		$('#wglCursorContainer').css('top',strcursorTop);
		$('#wglCursorContainer').css('left',strcursorLeft);		
		$('#wglCursorContainer').fadeIn('slow');	
	}//end function
		

	
	//....................................................................................			
	// gamepad functions
	//....................................................................................
	executeGamePadActionButtonUnpressed(buttonIndex) {	
		//console.log(buttonIndex);
		/*
		switch(buttonIndex){			
			case 4:	break;		
			case 5:	break;				
			case 6: break;							
			case 7:	break;
		}//end switch	
		*/	
	}//end function	
	
	executeGamePadActionButton(buttonIndex) {	
		console.log(buttonIndex);
		switch(buttonIndex){	
			case 1: 								 	
				break;	
			case 0: 
				break;	
			case 2: 
				break;													
			case 3:	
				break;					
			case 5:
				break;			
			case 4:	//LB			
				//this.player.moveBack();
				break;		
			case 6: //LT
				//this.player.speedDown();
				break;					
			case 7: //RT
				this.player.speedUp();
				break;
		}//end switch	
	}//end function
		
	executeGamePadActionAxis(axisIndex,axisValue) {			
		//console.log(axisIndex);
		//turn plane Y
		switch(axisIndex){	
			/*
			case 0:
				if(axisValue==0){
					this.wglApp.player.moveZeroLR();
				}
				else {
					if(axisValue>0){
						this.wglApp.player.moveDerecha();
					}
					else {
						this.wglApp.player.moveIzquierda();
					}
				}			
				break;	
			*/		
			case 1:
				if(axisValue==0){
					this.wglApp.player.moveZeroFB();
				}
				else {
					if(axisValue>0){
						this.wglApp.player.moveBack();
					}
					else {
						this.wglApp.player.moveFront();
					}
				}			
				break;
											
			case 2: 
				if(axisValue==0){
					this.wglApp.player.girarZero();
				}
				else {
					if(axisValue>0){
						this.wglApp.player.girarDerecha();
					}
					else {
						this.wglApp.player.girarIzquierda();
					}
				}			
				break;	
				
			case 3: 
				if(axisValue==0){
					this.wglApp.player.viewZero();
				}
				else {
					if(axisValue>0){
						this.wglApp.player.viewDown();
					}
					else {
						this.wglApp.player.viewUp();
					}
				}				
				break;			
		}//end switch	

	}//end function		
}//end class