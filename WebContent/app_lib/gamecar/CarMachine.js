/**
 * class GameCar.GARAGE_PATH
 */
class GameCar{        
       
    static PLAYER_GARAGE_PATH = 'gamecar/cars/';
    static GARAGE_PATH = 'gamecar/cars/';
    
	//constructor	
	constructor(app,modelId,driverName,raceInitPosition) {
		this.app 			  = app;
		this.modelId 		  = modelId;	
		this.driverName 	  = driverName;
		this.wglId			  = null;
		this.raceInitPosition = raceInitPosition;
		this.machine 	= null;
		this.wglCarRotationY	= 0;
		this.wglCarRotationMaxY = XF_Math.RADIAN * 20;			
		this.raceLap 	= 0;
		this.inNextLap 	= false;				
		this.modelPath = GameCar.GARAGE_PATH.concat(this.modelId).concat('/');
		this.bodypointsPath = this.modelPath.concat('bodypoints.json');
		this.chargewheels();
		
		//92 meters per second
		this.boundRadius = 1.49;
		this.config = new CarConfig(92.0,0.07,0.05,0.3,0.0001);
		this.frameVelocityMax = CarUtil.getFrameVelocity(this.config.velocityMax);
		
	}//end constructor
	
	chargewheels(){
		let jsonWheelsObj =  WebGL_util.readJSonObject(this.modelPath.concat('wheels.json'));				
		this.wheels = [];	
			
		let coordFL = [jsonWheelsObj.objects[0].position[0],0,jsonWheelsObj.objects[0].position[2]];	
		
		let distanceFL = XF_Math3dUtil.getDistance3d([0,0,0],coordFL);
		let rotationFL = XF_Math3dUtil.getTwoVertexAngle_Y([0,0,0],coordFL);		
		this.wheels[0] = new CarWheel('frontleft',jsonWheelsObj.objects[0].position[1],distanceFL,rotationFL);	
		
		let coordFR = [jsonWheelsObj.objects[1].position[0],0,jsonWheelsObj.objects[1].position[2]];	
		let distanceFR = XF_Math3dUtil.getDistance3d([0,0,0],coordFR);
		let rotationFR = XF_Math3dUtil.getTwoVertexAngle_Y([0,0,0],coordFR);				
		this.wheels[1] = new CarWheel('frontright',jsonWheelsObj.objects[1].position[1],distanceFR,rotationFR);		
						
	}//end function

		
	alertFinishLap(){
		this.raceLap++;
	}//end function	
		
}//end class


/**
 * class CarMachine(app,modelId,trackPath)
 */
class CarMachine extends GameCar {        
       
	//constructor	
	constructor(app,modelId,driverName,raceInitPosition,trackPath,initPosition) {
		super(app,modelId,driverName,raceInitPosition);

		this.velocity = 0;		
		if(trackPath!=null){			
			this.track	= CarUtil.readCarTrack(trackPath);			
		}
		else {
			this.track	= null;
		}		
		this.initPosition = initPosition;
		this.init(this.app.app_THREE);
	}//end constructor
	
	init(THREE){
	
		//this.machine = new WebGL_groupdtos(this,this.modelPath,this.modelId,null);
		this.machine = new WebGL_groupdtos(this,this.modelPath,'car',null);
		this.machine.loadWglObjects(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);
		
		this.velocity = 0;
			
		this.raceLap = 0;
		this.inNextLap = false;
		this.raceFinished = false;
	}//end function	
	
	alertAllDtosCharged(id){
		this.wglId = this.machine.grdto.id;
		//console.log(this.wglId);
		this.app.controlRace.addCarMachine(this.machine.grdto);
		if(this.initPosition!=null){
			this.machine.grdto.position.x = this.initPosition[0];
			this.machine.grdto.position.y = this.initPosition[1];
			this.machine.grdto.position.z = this.initPosition[2];	
			//this.lastPosition = this.initPosition;	
		}
		else {
			this.stepIndex = -1;
			//this.lastPosition =	null;
		}		 
	}//end function		
		
	dinamic(){
		this.stepIndex++;
		if(this.stepIndex<this.track.steps.length){
			this.update();
		}
		else {
			this.raceFinished = true;
		}
	}//end function	
			
	update(){

		this.currentStep = this.track.steps[this.stepIndex];			
		
		this.velocity = this.currentStep.velocity;
											
		this.machine.grdto.position.x = 0;
		this.machine.grdto.position.y = 0;
		this.machine.grdto.position.z = 0;
		this.machine.grdto.rotation.x = 0;
		this.machine.grdto.rotation.z = 0;	
		this.machine.grdto.rotation.y = 0;
		/*
		this.machine.grdto.rotateZ(this.currentStep.rotationZ);	
		this.machine.grdto.position.x = 0;
		this.machine.grdto.position.y = 0;
		this.machine.grdto.position.z = 0;		
		*/
		this.machine.grdto.rotateY(this.currentStep.rotationY);			
		this.machine.grdto.position.x = this.currentStep.position[0];
		this.machine.grdto.position.y = this.currentStep.position[1];
		this.machine.grdto.position.z = this.currentStep.position[2];
		
		
					
	}//end function		
	
	getPosition(){
		if(this.initPosition!=null){
			return this.initPosition;
		}
		else {
			if(this.currentStep!=null){
				return this.currentStep.position;
			}
			else {
				return this.track.steps[0].position;
			}
		}		
	}//end function	
	
	/*
	this.frameVelocity = 0;	
	if(this.lastPosition!=null)	{
		let distance = 	XF_Math3dUtil.getDistance3d(
							this.lastPosition,
							this.track.steps[this.stepIndex].position);		
		if(distance>0)	{
			this.frameVelocity = CarUtil.getFrameVelocity(distance);		
			this.velocity = CarUtil.getVelocity(this.config.velocityMax,this.config.frameVelocityMax,this.frameVelocity);					
		}
		else {
			this.frameVelocity = 0;		
			this.velocity = 0;					
		}							
	}	
	//this.lastPosition = this.currentStep.position;
	*/
	

}//end class	