/**
 * class CarTrack
 */
class  CarTrack{        
    
	constructor(){
		this.steps = [];
	}//end constructor
	
	addStep(step){
		this.steps.push(step);
	}//end function
	
}//end class	

/**
 * class GameCarStep
 */
class  GameCarStep{        
    
	constructor(position,velocity,rotationY,rotationZ){
		this.position = position;
		this.velocity = velocity;
		this.rotationY = rotationY;
		this.rotationZ = rotationZ;		
		
	}//end constructor
	
}//end class	

