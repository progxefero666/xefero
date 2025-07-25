


/**
 * class CarVolante
 */
class CarVolante{
	
    //constructor	
	constructor(pivotDistance,coordY) {
		this.pivotDistance 	= pivotDistance;	
		this.coordY 		= coordY;			
		this.position 		= null;
		this.rotationX		= 0;
		this.rotationY		= 0;
	}//end constructor
		
}//end class

/**
 * class CarBodyPoint
 */
class CarWheel{
	
    //constructor	
	constructor(id,coordY,pivotDistance,pivotRotationY) {
		this.id 	= id;
		this.coordY 	= coordY;
		this.pivotDistance 	= pivotDistance;
		this.pivotRotationY	= pivotRotationY;	
		this.position = null;
		this.rotationY	= 0;
		this.rotationZ	= 0;
	}//end constructor
		
}//end class


/**
 * class CarBodyPoint
 */
class CarBodyPoint{
	
    //constructor	
	constructor(id,pivotDistance,pivotRotationY) {
		this.id 	= id;
		this.pivotDistance 	= pivotDistance;
		this.pivotRotationY	= pivotRotationY;	
		this.position = null;
	}//end constructor
		
}//end class

/**
 * class CarCarConfig
 */
class CarConfig{        
    
    //constructor	
	constructor(velocityMax,acelerationMax,velocityReduce,velocityBrakesInit,velocityBrakesReduce) {
		this.velocityMax 			= velocityMax;
		this.acelerationMax 			= acelerationMax;
		this.velocityReduce 		= velocityReduce;
		this.velocityBrakesInit 	= velocityBrakesInit;
		this.velocityBrakesReduce 	= velocityBrakesReduce;		
	}//end constructor
	
}//end class	