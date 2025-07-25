/**
 * class XfRute3d
 */
 class XfRute3d {        
    
	constructor(ruteItems) {
		this.ruteItems = ruteItems;
		this.stepIndex = 0;
		this.activeStepIndex = 0;
		this.stepPoint = this.ruteItems[this.stepIndex];
		this.parent = null;
	}//end constructor
	
	setStepIndex(stepIndex){	
		this.stepIndex = stepIndex;
		this.stepPoint = this.ruteItems[this.stepIndex];	
	}
	dinamic(velocity){		
		this.stepIndex+=velocity;
		if(this.stepIndex >= this.ruteItems.length){	
			this.stepIndex 	= this.stepIndex-this.ruteItems.length;	
			this.parent.onRouteEnd();
		}
		this.stepPoint = this.ruteItems[this.stepIndex];
	}//end function
	
	
}//end class