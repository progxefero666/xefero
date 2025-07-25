/**
 * class XfEsceneLiveItemPivot
 */
class XfEsceneLiveItemPivot{        
    
	constructor(size,position,rotation,color,velocity) {
		this.size		= size;		
		this.position 	= position;
		this.rotation 	= rotation;
		this.color		= color;
		this.velocity = velocity;
		this.nextPosition 	= null;
		this.postconstructor();
	}//end constructor
	
	postconstructor(){
		this.positionInit = this.position;
		let angleRadians = XF_Math.toRadians(this.rotation);
		this.positionEnd = XF_Math2dCf.getCfPoint(this.positionInit,this.size,angleRadians); 
	}//end function
	
	setState(position,rotation){
		this.positionInit 	= position;
		this.rotation 	= rotation;
		this.positionEnd = XF_Math2dCf.getCfPoint(this.positionInit,this.size,this.rotation); 
	}
	calculateNextPosition(){
		let radioCalc = this.velocity;
		let angleRadians = XF_Math.toRadians(this.rotation);
		return XF_Math2dCf.getCfPoint(this.positionInit,radioCalc,angleRadians); 
	}//end function
	
	dinamic(){
		this.positionInit = this.calculateNextPosition();
		let angleRadians = XF_Math.toRadians(this.rotation);
		this.positionEnd = XF_Math2dCf.getCfPoint(this.positionInit,this.size,angleRadians);		
	}//end function
	
}//end class
	