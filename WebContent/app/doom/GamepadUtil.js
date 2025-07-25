

var rAF =window.mozRequestAnimationFrame ||
	  window.webkitRequestAnimationFrame ||
	  window.requestAnimationFrame;
var rAFStop= window.mozCancelRequestAnimationFrame ||
	  window.webkitCancelRequestAnimationFrame ||
	  window.cancelRequestAnimationFrame;

/**
 * class GamepadUtil
 */	  
 class  GamepadUtil {        
	
	//constructor	
	//..........................................................................
	constructor() {
	}//end constructor
	
	static buttonPressed(b) {		
		if (typeof(b) == "object") {
			return b.pressed;
		}
		return b == 1.0;
	}//end
	
	static debugGamePadsInfo(gamepads){
		let info = "Gamepad connected at index " + gamepads.index 
					+ ": " + gamepads.id 
					+ ". It has " + gamepads.buttons.length + " buttons and " 
					+ gamepads.axes.length + " axes.";
	  	console.log(info);
	}//end function
	
} //end class

/**
 * class GamepadUtil
 */	  
 class  GamepadControl {        
	
	//constructor	
	constructor(app,gamePad) {
		this.app = app;
		this.gamePad = gamePad;
			
		this.analogAxesState = [0,0,0,0];
		
		this.buttonPressed4= false;
		this.buttonPressed5= false;
		this.buttonPressed6= false;
		this.buttonPressed7= false;	
	}//end constructor
	
	process() { 	
		//console.log('GamepadControl timer runnning...');		
		//console.log(this.gamePad.buttons.length);
		
		//--------------------------------------------------------------------------------------------------------------
						  
	  	if(GamepadUtil.buttonPressed(this.gamePad.buttons[0])) {
		  	if(!this.groupButtonsR_active){
				this.groupButtonsR_active = true;
				this.groupButtonsR_btnIndex = 0;				
				this.app.executeGamePadActionButton(0);
			  	//console.log('buttonPressed 0');
		  	}		
	  	} 
	  	else {
		 	if(this.groupButtonsR_active){
				 if(this.groupButtonsR_btnIndex == 0){
					 this.groupButtonsR_active = false;
					 this.groupButtonsR_btnIndex = -1;
				 }			 
			} 
	  	}  
	
	  	if(GamepadUtil.buttonPressed(this.gamePad.buttons[1])) {
		  	if(!this.groupButtonsR_active){
				this.groupButtonsR_active = true;
				this.groupButtonsR_btnIndex = 1;
			  	//console.log('buttonPressed 1');
			  	this.app.executeGamePadActionButton(1);
		  	}		
	  	} 
	  	else {
		 	if(this.groupButtonsR_active){
				 if(this.groupButtonsR_btnIndex == 1){
					 this.groupButtonsR_active = false;
					 this.groupButtonsR_btnIndex = -1;
				 }			 
			} 
	  	}
	  
	 	 if(GamepadUtil.buttonPressed(this.gamePad.buttons[2])) {
		  	if(!this.groupButtonsR_active){
				this.groupButtonsR_active = true;
				this.groupButtonsR_btnIndex = 2;
			  	//console.log('buttonPressed 2');
			  	this.app.executeGamePadActionButton(2);
		  	}		
	 	 } 
	  	else {
		 	if(this.groupButtonsR_active){
				 if(this.groupButtonsR_btnIndex == 2){
					 this.groupButtonsR_active = false;
					 this.groupButtonsR_btnIndex = -1;
				 }			 
			} 
	 	}
	  
	 	if(GamepadUtil.buttonPressed(this.gamePad.buttons[3])) {
		  	if(!this.groupButtonsR_active){
				this.groupButtonsR_active = true;
				this.groupButtonsR_btnIndex = 3;
			  	//console.log('buttonPressed 3');
			  	this.app.executeGamePadActionButton(3);
		  	}		
	  	} 
	  	else {
		 	if(this.groupButtonsR_active){
				 if(this.groupButtonsR_btnIndex == 3){
					 this.groupButtonsR_active = false;
					 this.groupButtonsR_btnIndex = -1;
				 }			 
			} 
	  	}		
	  	
	  	if(GamepadUtil.buttonPressed(this.gamePad.buttons[4])) {
			  this.buttonPressed4 = true;
			  this.app.executeGamePadActionButton(4);
		}
		else {
			if(this.buttonPressed4){
				this.buttonPressed4 = false;
				if(this.app.listenButtonsUnpressed!=null){
					if(this.app.listenButtonsUnpressed){
						this.app.executeGamePadActionButtonUnpressed(4);
					}				
				}				
			}
		}
		
	  	if(GamepadUtil.buttonPressed(this.gamePad.buttons[5])) {
			 this.buttonPressed5 = true;
			  this.app.executeGamePadActionButton(5);
		}
		else {
			if(this.buttonPressed5){
				this.buttonPressed5 = false;
				if(this.app.listenButtonsUnpressed!=null){
					if(this.app.listenButtonsUnpressed){
						this.app.executeGamePadActionButtonUnpressed(5);
					}				
				}				
			}
		}		
	  	if(GamepadUtil.buttonPressed(this.gamePad.buttons[6])) {
			  this.buttonPressed6 = true;
			  this.app.executeGamePadActionButton(6);
		}
		else {
			if(this.buttonPressed6){
				this.buttonPressed6 = false;
				if(this.app.listenButtonsUnpressed!=null){
					if(this.app.listenButtonsUnpressed){
						this.app.executeGamePadActionButtonUnpressed(6);
					}				
				}				
			}
		}		
		
	  	if(GamepadUtil.buttonPressed(this.gamePad.buttons[7])) {
			  this.buttonPressed7 = true;
			  this.app.executeGamePadActionButton(7);
		}	  	
		else {
			if(this.buttonPressed7){
				this.buttonPressed7 = false;
				if(this.app.listenButtonsUnpressed!=null){
					if(this.app.listenButtonsUnpressed){
						this.app.executeGamePadActionButtonUnpressed(7);
					}				
				}				
			}
		}
		
	    let analogAxes = [];
		if (this.gamePad.axes) {
		    for (let idx = 0; idx < this.gamePad.axes.length; idx++) {
		      analogAxes.push(this.gamePad.axes[idx].toFixed(2));
			}
		}

		for (let axisIndex=0; axisIndex<analogAxes.length;axisIndex++) {

			if(analogAxes[axisIndex]==0){
				if(this.analogAxesState[axisIndex]!=0){
					this.analogAxesState[axisIndex]=0;
					this.app.executeGamePadActionAxis(axisIndex,0);
				}
			}
			else {
				if(analogAxes[axisIndex]<0){
					if(analogAxes[axisIndex]< (-0.9)){		
						if(this.analogAxesState[axisIndex]!=(-1)){
							this.analogAxesState[axisIndex]= -1;
							this.app.executeGamePadActionAxis(axisIndex,-1);
						}							
					}
				}
				else{
					if(analogAxes[axisIndex]> 0.9){
						if(this.analogAxesState[axisIndex]!=(1)){
							this.analogAxesState[axisIndex]= 1;
							this.app.executeGamePadActionAxis(axisIndex,1);
						}					
					}
				}						
			}//end else
		
		}//end for
		
		//...............................................................................
		//check axis 2
		//...............................................................................

		
	}//end function
		
} //end class	

//....................................................................................
//class GamepadTimer
//....................................................................................
class GamepadTimer{
	
	constructor(objListener,interval) {
		this.objListener = objListener;
		this.interval = interval;
		this.tid = null;
	}
	
	run() {
		this.tid = setInterval(executeTimerCode, this.interval)
		var objAlert = this.objListener;
		function executeTimerCode() {		
			objAlert.onAlert();		
		}
	}

	abort() {
		clearTimeout(this.tid);	 	
	}

} //End class XfTimer
