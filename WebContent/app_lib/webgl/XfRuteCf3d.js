/**
 * 
 */
class  XfRuteCf3d {        
    
	constructor(center,radius,countSteps) {			
		this.center = center;
		this.radius = radius;
		this.countSteps = countSteps;
		this.stepIndex = 0;
		this.activeStepIndex = 0;
		this.points = null;
		this.stepPoint = null;
		this.init();
	}//end constructor
	
	init(){
		//let centerCoord2d = [this.center[0],this.center[2]];
		let centerCoord2d = [0,0];
		let cfCoords = XF_Math2dCf.getCfPoints(centerCoord2d,this.radius,this.countSteps);
		this.points = [];	
		for(let idx=0;idx<this.countSteps;idx++) {	
			this.points[idx] = [cfCoords[idx][0],this.center[1],cfCoords[idx][1]];
		}
		this.stepPoint = this.points[0];
		
		//console.log(this.stepPoint);
		
	}//end function
		
	dinamic(){		
		this.stepIndex++;			
		if(this.stepIndex==this.countSteps){			
			this.stepIndex =0;
		}
		this.stepPoint = this.points[this.stepIndex];
	
		
	}//end function
	



	
}//end class