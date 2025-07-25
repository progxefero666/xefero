/**
 * class PlayerCar
 */
class CarPlayerBase{        
       
    static GARAGE_PATH = 'gamecar/playercars/';
    
	//constructor	
	constructor(app,team,member) {
		this.app 	  = app;
		this.team 	 = team;	
		this.member  = member;
		this.wglId	 = null;		
		this.machine = null;
		
		this.raceInitPosition = this.app.controlRace.getQualifyPosition(this.team,this.member)
				
		this.wglCarRotationY	= 0;
		this.wglCarRotationMaxY = XF_Math.RADIAN * 20;		
		this.raceLap 	= 0;
		this.inNextLap 	= false;				
		this.modelPath = CarPlayerBase.GARAGE_PATH.concat(this.team).concat('/');
		this.bodypointsPath = this.modelPath.concat('bodypoints.json');
		//let jsonVolanteObj =  WebGL_util.readJSonObject(this.modelPath.concat('redbullvolante.json'));					
		this.volante = new CarVolante(0.283113,0.515372);
				
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

	chargeCarBodyRefPoints(THREE){							
		let jsonObj =  WebGL_util.readJSonObject(this.bodypointsPath);	
			
		this.bodypoints = [];		
		for(let idx=0;idx<jsonObj.points.length;idx++){
			let distance = XF_Math3dUtil.getDistance3d([0,0,0],jsonObj.points[idx].position);
			let rotationY = XF_Math3dUtil.getTwoVertexAngle_Y([0,0,0],jsonObj.points[idx].position);
			this.bodypoints[idx] = new CarBodyPoint(jsonObj.points[idx].id,distance,rotationY);
		}
		
		this.bodyEspheres = [];
		for(let idx=0;idx<this.bodypoints.length;idx++){
			this.bodyEspheres[idx] = WebGL_threeGenObjects
				.createObjectSphereColor(THREE,0.25,16,new THREE.Color('rgb(0,250,0)'),null);
			this.app.scene.add(this.bodyEspheres[idx]);		
		}
  		
	}//end function
			
				
	//......................................................................................................
	//Body Ref Points
	//......................................................................................................

	updateCarBodyRefPoints(){		
		for(let idx=0;idx<this.bodypoints.length;idx++){
			let rotCalc = 0;
			if(this.bodypoints[idx].pivotRotationY>=0){
				rotCalc = XF_Math.getAngleInc(this.wglCarRotationY,this.bodypoints[idx].pivotRotationY);
			}	
			else {
				rotCalc = XF_Math.getAngleDec(this.wglCarRotationY,this.bodypoints[idx].pivotRotationY);
			}	
			this.bodypoints[idx].position = XF_Math3dCf.getCf3dOneVertex(				1,
				WebGL_threeUtil.getVector3Coords(this.position),
				this.bodypoints[idx].pivotDistance,
				rotCalc);							
			this.bodypoints[idx].position.y += this.bodyCenterY;	
					
			this.bodyEspheres[idx].position.x = this.bodypoints[idx].position[0];
			this.bodyEspheres[idx].position.y = this.bodypoints[idx].position[1];
			this.bodyEspheres[idx].position.z = this.bodypoints[idx].position[2];
			
		}		
	}//end function	
				
	alertFinishLap(){
		if(this.raceLap ==0){
			this.start = new Date().getTime();
		}
		else {
			let elapsed = new Date().getTime() - this.start;
			let elapsedSeconds = elapsed/1000;
			console.log(elapsedSeconds);
			this.start = new Date().getTime();
		}
		this.raceLap++;
	}//end function	
		
}//end class




/**
 * class CarPlayer
 */
class CarPlayer extends CarPlayerBase {        
       
	//constructor	
	constructor(app,team,member) {
		super(app,team,member);
		
		this.wglCar	 = null;
		this.wglVolante = null;
		this.wglWheels = null;
					
		this.machine = new WebGL_groupdtos(this,this.modelPath,team,null);
		this.machine.loadWglObjects(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);				
		
		this.volanteDtos = new WebGL_groupdtos(this,this.modelPath,'volante',null);
		this.volanteDtos.loadWglObjects(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);	
		
		this.wheelsDtos = new WebGL_listdtos(this,this.modelPath,'wheels');
		this.wheelsDtos.loadWglObjects(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);		

		this.hviewF = new WebGL_dto(this,'gamecar/car/','target');
		this.hviewF.loadWglObject(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null); 	
	
		this.roadTrack = new GameRoadTrack();
		this.carTrack = new CarTrack();
	}//end constructor	
	
	alertAllDtosCharged(id){		
		switch (id) {
			case 'volante':				
				this.wglVolante = this.volanteDtos.grdto;
				break;
			case this.team:				
				this.wglCar	= this.machine.grdto;	
				this.wglId = this.wglCar.children[0].id;				
				break;
			case 'wheels':
				this.wglWheels = this.wheelsDtos.dtos;				
				break;
	 		case 'target':
	 			let position = this.app.controlRace.getPositionByIndex(this.raceInitPosition);
				this.configure(this.app.app_THREE,position);
				this.app.gameReady = true				 
				break;	  							 	
		 	default:
	    }//end switch		    		
	}//end function		
		
	configure(THREE,initPosition){

		this.velocityFactor = 4;
		//.........................................
		//configuracion cabina		 
		//this.distCarToCameraZ   = 0.5;	
		//this.distCarToCameraY 	= 0.86
		//.........................................
			
		//.........................................
		//configuracion exterior
		this.distCarToCameraZ   = 3.5;	
		this.distCarToCameraY 	= 1.9		
		//.........................................		

		this.hviewDistZ			= 5;
		this.hviewPointF		= [0,0,0];		

		this.turnValueMax 	= XF_Math.RADIAN * 0.28;		
		this.turnReduce	    = XF_Math.RADIAN * 0.01;
		this.turnInc	    = XF_Math.RADIAN * 0.0005;		 
		this.wheelTurnMax 	= XF_Math.RADIAN * 20;
				
		//configure collisions
		this.checkCarsCollisions = true;
		this.checkRoadObjectsCollisions = true;						
		
		this.velocityBack	= this.config.velocityMax / 4;
		this.velocityOut	= this.config.velocityMax / 4;
		
		//init state parameters
		this.velocity 			= 0.0;		
		this.aceleration    	= 0;
		this.velocityBrakes		= 0;
		this.brakesOn 			= false;
		this.frameVelocity 		= 0;		
		this.wheelsRotation		= 0;
		this.intoRoad 			= true;
		this.intoRump 			= false;
		this.rampaHeight		= 0;
		this.rumpFirstPosition  = null;
		this.rumpLastPosition	= null;
		this.inFly 				= false;
		this.flyCountFrames 	= 0;
		this.flyFrameDecY       = 0;
				
		this.moveForward 		= true; 		
		this.moveBackward 		= false; 
		this.acelerationState 	= 'speedCero';
		this.turnToZero 		= false;
		this.turnState 			= 'cero';
		this.turnValue 			= 0;		
		this.rotationY			= 0;

		this.rotationEnergy 	= 0;
		this.brakesEnergy 		= 0;
		this.brakesEnergyMax    = 116;
		
		this.position = WebGL_threeUtil.getVectorFromCoords(THREE,initPosition);		
		this.rotation = new THREE.Vector3(0,0,0);
		this.rotationZ = 0;
		this.ruteAngleY = 0;
		this.bodyCenterY = 0.5;				

		this.cabLight = new THREE.PointLight( 0xffffff,3.0,12,8);
		this.cabLight.position.set(this.position.x,this.position.y + 1,this.position.z );
		this.app.scene.add(this.cabLight);
				
		this.chargeCarBodyRefPoints(THREE);
		this.updateCarBodyRefPoints();
		this.setNextHViews();
		this.setCamera(this.app.camera);
		this.updateWglState();			
				
		this.start = null;
		this.firstExecution = true;
	}//end function
			
	dinamic(THREE,wglCamera,wglMapCamera){		
		/*	
		let elapsed = 0;
		if(this.firstExecution)	{
			this.firstExecution = false;
			this.start = new Date().getTime();
			elapsed = 1;
		}	
		else {
			elapsed = new Date().getTime() - this.start;	
			this.start = new Date().getTime();		
		}		
		let elapsed = this.velocityFactor;
		*/	
		
							
		let positionCoords = this.calculateNextPosition(this.velocityFactor);			
		this.setFrameVelocity(WebGL_threeUtil.getVector3Coords(this.position),positionCoords);
		this.setRotationZ(WebGL_threeUtil.getVector3Coords(this.position),positionCoords);							
		this.position.x = positionCoords[0];
		this.position.y = positionCoords[1];
		this.position.z = positionCoords[2];		
		this.updateCarBodyRefPoints();				
		this.setCamera(wglCamera);								
		this.updateWglState();
		//this.setMapCamera(wglMapCamera);
		
		let stepIndex = this.app.gameRoad.getPathStepIndexInPosition3d(positionCoords);
		//console.log(stepIndex);
		if(this.moveForward){		
			switch (this.acelerationState) {
		 		case 'speedCero':				
					this.reduceVelocity();					
					break;	
				case 'speedUp':	 
					this.incrementVelocity(); 
					break;							
				case 'speedDown':
					this.useBrakes(); 
					break;													
			 	default:
		    }//end switch	
		}//end if	
		
		if(this.brakesOn){
			this.brakesEnergy += 1;
		}
		else {
			this.brakesEnergy = 0;
		}		
				
		if(this.turnToZero){	
			if(this.turnValue>0){				
				let potTurn = this.turnValue - this.turnReduce;	
				if(potTurn>0){
					this.turnValue = potTurn;
				}
				else {
					this.turnValue = 0;
				}				
			}
			else {
				this.turnToZero = false;
			}				
		}//end if
					
			
		// collisions
		//.........................................................................................
		
		let checkRoadCollisions = true;
		//let existCarCollision = this.processCarsCollisions(THREE);		
		//if(existCarCollision){
		//	checkRoadCollisions = false;
		//}		
		if(checkRoadCollisions){
			this.processRoadCollisions(THREE);
		}
		
		this.calculateRotationY();				
		this.setNextHViews();				
		this.updateWheelsStates();
		this.updateVolanteState();
		this.cabLight.position.set(this.position.x,this.position.y + 1,this.position.z);
	}//end function
				
	updateWglState(){				
		this.wglCar.position.x = 0;
		this.wglCar.position.y = 0;
		this.wglCar.position.z = 0;					
		this.wglCar.rotation.x = 0;
		this.wglCar.rotation.y = this.wglCarRotationY;
		this.wglCar.rotation.z = this.rotationZ;							
		this.wglCar.position.x = this.position.x;
		this.wglCar.position.y = this.position.y;
		this.wglCar.position.z = this.position.z;		
				
	}//end function
	
	updateVolanteState(){	
		if(this.wglVolante!=null){
			
			//caculate volante position
			//.......................................................................................
			let pivotPosition = WebGL_threeUtil.getVector3Coords(this.position);					
			this.volante.position =  XF_Math3dCf
					.getCf3dOneVertex(1,pivotPosition,this.volante.pivotDistance,this.rotationY);
			this.volante.position[1] = 	this.volante.coordY;				
			
			//caculate volante rotation car Y
			//.......................................................................................			
			this.volante.rotationY= XF_Math.getAngleInc(this.rotationY,(Math.PI/2));
			
			//caculate volante rotation wglZ
			//.......................................................................................	
			this.volante.rotationX = 0;
			if(this.turnValue>0){								
				if(this.moveForward){
					let percentAngle = XF_Math.getPercent(this.turnValueMax,this.turnValue);			
					let volanteMaxRot = XF_Math.RADIAN * 20;
					let valueAngle =  XF_Math.getValuePercent(volanteMaxRot,percentAngle);			
					if(this.turnState=='right'){
						this.volante.rotationX = valueAngle;
					}
					else {
						this.volante.rotationX = valueAngle * (-1);
					}				
				}	
			}				
			
			//apply values
			//.......................................................................................							
			this.wglVolante.position.x = 0;
			this.wglVolante.position.y = 0;
			this.wglVolante.position.z = 0;				
			this.wglVolante.rotation.y = this.volante.rotationY;		
			this.wglVolante.rotation.z = this.volante.rotationX;					
			this.wglVolante.position.x = this.volante.position[0];
			this.wglVolante.position.y = this.volante.position[1];
			this.wglVolante.position.z = this.volante.position[2];					
		}
		else {
			console.log('wglVolante is null');
		}
	}//end function	
	
	updateWheelsStates(){	

		//calculate wheels position	
		//..........................................................................	
		let pivotPosition = WebGL_threeUtil.getVector3Coords(this.position);
	
		for(let idx=0;idx<this.wheels.length;idx++){			
			let rotCalc = 0;
			if(this.wheels[idx].pivotRotationY>=0){
				rotCalc = XF_Math.getAngleInc(this.rotationY,this.wheels[idx].pivotRotationY);
			}	
			else {
				let valueAux = (Math.PI*2)-this.wheels[idx].pivotRotationY;				
				rotCalc = XF_Math.getAngleDec(this.rotationY,valueAux);
			}		
			this.wheels[idx].position = XF_Math3dCf
				.getCf3dOneVertex(1,pivotPosition,this.wheels[idx].pivotDistance,rotCalc);
			this.wheels[idx].position[1] += this.wheels[idx].coordY;											 				
		}//end for		
								
		//calculate rotation Y
		//..........................................................................	
		let percentAngle = XF_Math.getPercent(this.turnValueMax,this.turnValue);
		let valueAngle 	 = XF_Math.getValuePercent(this.wheelTurnMax,percentAngle);
	
		this.wheels[0].rotationY = 0;
		this.wheels[1].rotationY = 0;
		if(this.turnValue>0){				
			if(this.turnState=='right'){
				this.wheels[0].rotationY = XF_Math.getAngleDec(this.wglCarRotationY,valueAngle);
				this.wheels[1].rotationY = XF_Math.getAngleDec(this.wglCarRotationY,valueAngle);
			}
			else {
				this.wheels[0].rotationY = XF_Math.getAngleInc(this.wglCarRotationY,valueAngle);
				this.wheels[1].rotationY = XF_Math.getAngleInc(this.wglCarRotationY,valueAngle);						
			}	
		}
		else {
			this.wheels[0].rotationY = this.wglCarRotationY;
			this.wheels[1].rotationY = this.wglCarRotationY;		
		}
			
		//calculate wheel rotation Z
		//..........................................................................		
		let angularVelocitySeconds = this.velocity / 0.334;
		let angleCalc = XF_Math.toRadians(angularVelocitySeconds/(100/4));		
		this.wheelsRotation= XF_Math.getAngleInc(this.wheelsRotation,angleCalc);								
		this.wheels[0].rotationZ = this.wheelsRotation * (-1);
		this.wheels[1].rotationZ = this.wheelsRotation * (-1);
							
		this.wglWheels[0].position.x = 0;
		this.wglWheels[0].position.y = 0;
		this.wglWheels[0].position.z = 0;		
		this.wglWheels[0].rotation.y = this.wheels[0].rotationY;					
		this.wglWheels[0].rotation.z = this.wheels[0].rotationZ;						
		this.wglWheels[0].position.x = this.wheels[0].position[0];
		this.wglWheels[0].position.y = this.wheels[0].position[1];
		this.wglWheels[0].position.z = this.wheels[0].position[2];		
		
		this.wglWheels[1].position.x = 0;
		this.wglWheels[1].position.y = 0;
		this.wglWheels[1].position.z = 0;							
		this.wglWheels[1].rotation.y = this.wheels[1].rotationY;	
		this.wglWheels[1].rotation.z = this.wheels[1].rotationZ;								
		this.wglWheels[1].position.x = this.wheels[1].position[0];
		this.wglWheels[1].position.y = this.wheels[1].position[1];
		this.wglWheels[1].position.z = this.wheels[1].position[2];
														
	}//end function	
	
	calculateRotationY(){
							
		if(this.turnValue>0){						
												
			if(this.moveForward){
				
				let percentVelocity = XF_Math.getPercent(this.config.velocityMax,this.velocity);
				let percentAngle  	= XF_Math.getPercent(this.turnValueMax,this.turnValue);		
				let frameBrakesEnergy =  0;			
				if( (percentVelocity>80)&& (percentAngle>80)) {
					let valueCalcV = 20 -(100 - percentVelocity);
					let valueCalcA = 20 -(100 - percentAngle);			
					let valueCalcAV = (valueCalcV + valueCalcA ) / 2;
					let percCalcAV = XF_Math.getPercent(20,valueCalcAV);	
					let frameRotationEnergy = XF_Math.getValuePercent(1,percCalcAV);					
					this.rotationEnergy+=frameRotationEnergy;
					if(this.brakesEnergy>0){
						let percentBrakes = XF_Math.getPercent(this.brakesEnergyMax,this.brakesEnergy);
						frameBrakesEnergy =  XF_Math.getValuePercent(1,percentBrakes);
					}
				}
				let valueRotationAdd = 0;
				let valueWglRotationAdd = 0;
				if(this.rotationEnergy>200){					
					valueRotationAdd = XF_Math.RADIAN * (this.rotationEnergy/5000);
					valueWglRotationAdd= XF_Math.RADIAN * (this.rotationEnergy/1000);
					if(this.brakesEnergy>0){
						valueWglRotationAdd = XF_Math.getAngleInc(valueWglRotationAdd,
						XF_Math.RADIAN * frameBrakesEnergy);						
					}
				}
												
				if(this.turnState=='right'){
					let valueCalcY = XF_Math.getAngleDec(this.rotationY,this.turnValue);	
					if(valueCalcY<0){
						valueCalcY = (Math.PI * 2) + valueCalcY;
					}		
					if(this.rotationEnergy>200){					
						this.rotationY = XF_Math.getAngleInc(valueCalcY,valueRotationAdd);
						this.wglCarRotationY = XF_Math.getAngleDec(valueCalcY,valueWglRotationAdd);	
					}					
					else {
						this.rotationY = valueCalcY;	
						this.wglCarRotationY =this.rotationY;
					}															
				}
				else {
					let valueCalcY = XF_Math.getAngleInc(this.rotationY,this.turnValue);
					if(this.rotationEnergy>200){
						this.rotationY = XF_Math.getAngleDec(valueCalcY,valueRotationAdd);
						this.wglCarRotationY = XF_Math.getAngleInc(valueCalcY,valueWglRotationAdd);
					}
					else {
						this.rotationY = valueCalcY;
						this.wglCarRotationY =this.rotationY;
					}																	
				}			
			}
			else {
				this.rotationEnergy = 0;
				if(this.turnState=='right'){
					this.rotationY = XF_Math.getAngleInc(this.rotationY,this.turnValue);								
				}
				else {
					this.rotationY = XF_Math.getAngleDec(this.rotationY,this.turnValue);	
					if(this.rotationY<0){
						this.rotationY = (Math.PI * 2) + this.rotationY;
					}					
				}
				this.wglCarRotationY =	this.rotationY;	
			}													
		}
		else {
			this.rotationEnergy  = 0;
			this.wglCarRotationY =	this.rotationY;	
		}		
							
	}//end function
		
	setNextHViews(){
		let currentPosition = WebGL_threeUtil.getVector3Coords(this.position);
		let pivot 			= new XF_Pivot();
		pivot.rotatePivot(1,this.rotationY);	
		pivot.movePivot(currentPosition);			
		this.hviewPointF =  pivot.getDirecctionVertex(0,this.hviewDistZ);		
		this.hviewF.dto.position.x = this.hviewPointF[0];
		this.hviewF.dto.position.y = this.hviewPointF[1];
		this.hviewF.dto.position.z = this.hviewPointF[2];
		this.hviewF.dto.rotation.x = 0;
		this.hviewF.dto.rotation.y = this.rotationY;
		this.hviewF.dto.rotation.z = 0;				
	}//end function
			
	calculateNextPosition(miliseconds){
		
		let currentPosition = WebGL_threeUtil.getVector3Coords(this.position);				
		let rotPlaneY = XF_Math3dUtil.getTwoVertexAngle_Y(currentPosition,this.hviewPointF);
		let pivot = new XF_Pivot();
		pivot.rotatePivot(1,rotPlaneY);
		pivot.movePivot([currentPosition[0],currentPosition[1],currentPosition[2]]);
		
		let nextPosition = [0,0,0];
			
		let distCalc = this.velocity * (miliseconds/1000);//0.003;
		if(distCalc>0){
		
			if(this.moveForward){
				nextPosition = pivot.getDirecctionVertex(0,distCalc);
			}
			else {
				nextPosition = pivot.getDirecctionVertexInverse(0,distCalc);
			}
			
			this.intoRoad = true;
			let roadHeight = this.app.gameRoad.getRoadHeightAtPosition3d(this.app.app_THREE,nextPosition);
			if(roadHeight==(-100000)){
				this.intoRoad = false;
				this.rampaHeight	= 0;
				return nextPosition;
			}
			nextPosition[1] = roadHeight;
			
			/*
			let rampCoordY = this.app.gameRoad.getRampHeightAtPosition3d(this.app.app_THREE,nextPosition);
			if(rampCoordY!=(-100000)){
				if(this.inFly){this.inFly = false;}			
				if(!this.intoRump){
					this.intoRump = true;			
					this.rumpFirstPosition = [nextPosition[0],roadHeight,nextPosition[2]];						
				}				
				this.rampaHeight = rampCoordY - this.rumpFirstPosition[1];
				nextPosition[1] = rampCoordY;
			}
			else {
				if(this.intoRump){					
					let rumpLastPosition = [nextPosition[0],roadHeight,nextPosition[2]];
					let distCalc =  XF_Math3dUtil.getDistance3d(this.rumpFirstPosition,rumpLastPosition);	
					let rumpAngle = Math.atan(this.rampaHeight/distCalc);					
					let flyTime = XF_MathPhysic.getCurveTimeFly(this.velocity,rumpAngle);		
					this.flyCountFrames = Math.floor((flyTime * 1000) / 20);						
					this.flyFrameUnitY = this.rampaHeight / this.flyCountFrames;	
					//console.log(this.flyFrameUnitY);				
					this.inFly = true;																							
					this.intoRump = false;
					this.rampaHeight = 0;
				}
				let valueAddY = 0;
				if(this.inFly){
					this.flyCountFrames-=1;
					if(this.flyCountFrames==0){
						this.inFly = false;
					}
					else {
						valueAddY = this.flyCountFrames * this.flyFrameUnitY;
					}									
				}
					
				nextPosition[1] = roadHeight + valueAddY;		
				//console.log(nextPosition[1]);		
			}				
			*/
		}
		else{
			nextPosition = WebGL_threeUtil.getVector3Coords(this.position);		
		}
		
		return nextPosition;
	}//end function						

	setRotationZ(currentPosition,nextPosition){			
		this.rotationZ = 0;	
		let distCalc = XF_Math3dUtil.getDistance3d(currentPosition,nextPosition);
		if(distCalc>0){			
			if(nextPosition[1]>=currentPosition[1]){
				let diffY = nextPosition[1]-currentPosition[1];
				if(diffY>0.0001){					
					let valueCalc =  Math.asin(diffY/distCalc);
					if(!isNaN(valueCalc)){
						this.rotationZ =  valueCalc;
					}					
				}
			}
			else {
				let diffY = currentPosition[1]-nextPosition[1];
				if(diffY>0.0001){			
					let valueCalc= Math.asin(diffY/distCalc)
					if(!isNaN(valueCalc)){
						this.rotationZ = valueCalc*(-1);		
					}													
				}
			}
		}		
	}//end function	
	
	setCamera(wglCamera){	
		let positionCoords = WebGL_threeUtil.getVector3Coords(this.position);				
		let angleCalc = 0;
	
		if(this.moveForward){
			if(this.turnValue>0){
				if(this.turnState=='right'){
					angleCalc = XF_Math.getAngleInc(this.rotationY,(this.turnValue*4));
				}
				else {
					angleCalc = XF_Math.getAngleDec(this.rotationY,(this.turnValue*4));
				}				
			}
			else {
				angleCalc = this.rotationY;
			}		
		}
		else {
			angleCalc = this.rotationY;			
		}					
		let pivot 	= new XF_Pivot();		
		pivot.rotatePivot(1,angleCalc);	
		pivot.movePivot(positionCoords);				
		let cameraCoords =  pivot.getDirecctionVertexInverse(0,this.distCarToCameraZ);		

		wglCamera.position.x = 0;
		wglCamera.position.y = 0;
		wglCamera.position.z = 0;
		wglCamera.rotation.z = 0;	
		wglCamera.rotation.x = this.rotationZ;	
		wglCamera.rotation.y = XF_Math.RADIANS_270 + this.rotationY;			
		wglCamera.position.x = cameraCoords[0];
		wglCamera.position.y = this.position.y + this.distCarToCameraY;
		wglCamera.position.z = cameraCoords[2];		
							
	}//end function

	setMapCamera(wglMapCamera){
		
		/*
		let coord = WebGL_threeUtil.getVector3Coords(this.position);
		let roadStepIndex = this.app.gameRoad.getPathStepIndexInPosition3d(coord);
		let futureStepIndex = roadStepIndex + 8;
		if(futureStepIndex>=this.app.gameRoad.roadPath.length){
			futureStepIndex = futureStepIndex - this.app.gameRoad.roadPath.length;
		}		 
		let futureStepCoords = this.app.gameRoad.roadPath[futureStepIndex];		
		wglMapCamera.position.x = futureStepCoords[0];	
		wglMapCamera.position.z = futureStepCoords[2];	
		*/		
		wglMapCamera.position.x = this.position.x;	
		wglMapCamera.position.z = this.position.z;			
		wglMapCamera.rotation.z = XF_Math.RADIANS_270 + this.rotationY;		
		
	}//end function
	
	setFrameVelocity(currentPosition,nextPosition){
		let distance = 	XF_Math3dUtil.getDistance3d(currentPosition,nextPosition);			
		this.frameVelocity = CarUtil.getFrameVelocity(distance);			
	}//end function
			
			
	//.......................................................................................................
	//gamepads actions
	//.......................................................................................................
	girarZero(){
		if(!this.turnToZero){			
			this.turnToZero = true;			
		}
	}//end function	
		
	girarDerecha(){
		if(this.turnState!='right'){
			this.turnState = 'right';			
		}		
		this.turnToZero = false;
		this.turnValue = this.turnValueMax;				
	}//end function	
		
	girarIzquierda(){
		if(this.turnState!='left'){
			this.turnState = 'left';	
		}			
		this.turnToZero = false;
		this.turnValue = this.turnValueMax;
	}//end function
				
	moveBack(){
		this.moveForward = false; 	
		this.moveBackward = true; 		
		this.velocity = this.velocityBack;
	}//end function		
		
	speedCero(){
		this.acelerationState = 'speedCero';	
	}//end function	
		
	speedUp(){
		if(!this.moveForward){
			this.moveForward = true; 
			this.moveBackward = false; 
		}		
		this.acelerationState = 'speedUp';		
	}//end function
	
	speedDown(){
		if(this.moveForward){
			this.acelerationState = 'speedDown';
		}				
	}//end function	
				
	incrementVelocity(){
		if(this.velocity>=this.config.velocityMax){
			return;
		}				
		this.aceleration = this.calculeAceleration();
		let potVelocity = this.velocity + this.aceleration; //this.config.acelerationMax;
		if(potVelocity<this.config.velocityMax){			
			this.velocity = potVelocity;			
		}		
		else {
			this.velocity = this.config.velocityMax;
		}
	}//end function
		
	calculeAceleration(){
		let acelerationBase 	= XF_Math.getValuePercent(this.config.acelerationMax,50);
		let acelerationResto	= XF_Math.getValuePercent(this.config.acelerationMax,50);
		let percentVelocity 	= 100 - XF_Math.getPercent(this.config.velocityMax,this.velocity);
		let acelerationAdd 		= XF_Math.getValuePercent(acelerationResto,percentVelocity);	
		let acelerationValue 	= acelerationBase + acelerationAdd;		
		return acelerationValue;		
	}//end function
						
	reduceVelocity(){
		if(this.velocity >0 ){
			let percentVelocity = 100 - XF_Math.getPercent(this.config.velocityMax,this.velocity);
			let velocityRedHalf = XF_Math.getValuePercent(this.config.velocityReduce,65)
			let velocityResto	= XF_Math.getValuePercent(this.config.velocityReduce,35)
			let velocityDec =  XF_Math.getValuePercent(velocityResto,percentVelocity);
			let velocityReduce = velocityRedHalf + velocityDec;			
			let potVelocity = this.velocity - velocityReduce;
			if(potVelocity>=0){
				this.velocity = potVelocity;				
			}
			else {
				this.velocity = 0;
			}	
		}
	}//end function
	
	useBrakes(){
		if(this.velocity >0 ){
			if(!this.brakesOn){
				this.brakesOn = true;
			}	
			let potVelocity = 0;
			let halfBrakes = this.config.velocityBrakesInit / 2;
			let percentVelocity = 100-XF_Math.getPercent(this.config.velocityMax,this.velocity);			
			this.velocityBrakes = halfBrakes + XF_Math.getValuePercent(halfBrakes,percentVelocity);
			
			potVelocity = this.velocity - this.velocityBrakes;
			if(potVelocity>=0){
				this.velocity = potVelocity;				
			}		
			else {
				this.velocity = 0;
			}	
		}
	}//end function
	
	desactivateBrakes(){
		//console.log('desactivateBrakes');
		this.brakesOn = false;
		this.acelerationState = 'speedCero';
	}//end function
		
	decrementVelocityCollision(){
		let velocityDec = XF_Math.getValuePercent(this.velocity,10);
		let potVelocity = this.velocity - velocityDec;
		if(potVelocity>=0){
			this.velocity = potVelocity;				
		}
		else {
			this.velocity = 0;
		}			
	}//end function
	

	
	//.......................................................................................................
	// process Cars Collisions
	//.......................................................................................................		
	//this.boundRadius
	processCarsCollisions(THREE){
		let existCollision = false;
		let carIndexNearest = this.app.controlRace.getCarIndexLessDistance(this.getPosition());				
		let carDistance = this.app.controlRace.getCarDistanceByIndex(this.getPosition(),carIndexNearest)
		let distMin = this.boundRadius + this.app.controlRace.machineCars[carIndexNearest].boundRadius;
	
		if(carDistance<distMin){

			//moveForward
			//.....................................................................................
			if(this.moveForward){
				let checkFront = this.existCarCollisionsPoint(THREE,1);
				if(checkFront.result){	 					
					existCollision = true;
					let carIndex = this.app.controlRace.getCarIndexByWglId(checkFront.wglId);
					let carVelocity= this.app.controlRace.machineCars[carIndex].velocity;	
					let valueCalc =  XF_Math.getValuePercent(carVelocity,90);	
					if(this.velocity>=valueCalc) {
						this.velocity = valueCalc;	
					}			
					else {
						this.velocity =  XF_Math.getValuePercent(this.velocity,90);
					}				
				}
				else {
					let checkCenterLeft = this.existCarCollisionsPoint(THREE,3);
					if(checkCenterLeft.result){
						existCollision = true;	
						this.rotationY = XF_Math.getAngleDec(this.rotationY,(XF_Math.RADIAN * 5));
						console.log('existCollision Center Left');
					}
					else{
						let checkCenterRight = this.existCarCollisionsPoint(THREE,4);
						if(checkCenterRight.result){
							existCollision = true;	
							this.rotationY = XF_Math.getAngleInc(this.rotationY,(XF_Math.RADIAN * 5));
							console.log('existCollision Center Right');
						}
					}
				}//end if
				
				if(!existCollision){
					let checkFrontLeft = this.existCarCollisionsPoint(THREE,0);
					if(checkFrontLeft.result){
						let carIndex = this.app.controlRace.getCarIndexByWglId(checkFrontLeft.wglId);
						existCollision = true;							
						let distRightToCar = this.getCarCollisionsDistance(THREE,2);						
						let rightPointPivotDist = this.bodypoints[2].pivotDistance;
						let distCalc = rightPointPivotDist + 1.5;
						if(distRightToCar<=distCalc){
							this.velocity = 0;
						}
						else {
							this.rotationY = XF_Math.getAngleDec(this.rotationY,(XF_Math.RADIAN * 5));
							
							let carVelocity= this.app.controlRace.machineCars[carIndex].velocity;	
							let valueCalc =  XF_Math.getValuePercent(carVelocity,90);								
							if(this.velocity>=valueCalc) {
								this.velocity = valueCalc;	
							}			
							else {
								this.velocity =  XF_Math.getValuePercent(this.velocity,90);
							}	
						}
						console.log('existCollision Front Left');
					}
					else {
						let checkFrontRight= this.existCarCollisionsPoint(THREE,2);
						if(checkFrontRight.result){
							let carIndex = this.app.controlRace.getCarIndexByWglId(checkFrontRight.wglId);
							existCollision = true;
							let distLeftToCar = this.getCarCollisionsDistance(THREE,0);
							let leftPointPivotDist = this.bodypoints[0].pivotDistance;
							let distCalc = leftPointPivotDist + 1.5;
							if(distLeftToCar<=distCalc){
								this.velocity = 0;
							}
							else {
								this.rotationY = XF_Math.getAngleInc(this.rotationY,(XF_Math.RADIAN * 5));
								let carVelocity= this.app.controlRace.machineCars[carIndex].velocity;	
								let valueCalc =  XF_Math.getValuePercent(carVelocity,90);									
								if(this.velocity>=valueCalc) {
									this.velocity = valueCalc;	
								}			
								else {
									this.velocity =  XF_Math.getValuePercent(this.velocity,90);
								}	
							}							
							console.log('existCollision Front Right');
						}	
					}	
				}//end if
				
				if(!existCollision){
					let checkBackLeft = this.existCarCollisionsPoint(THREE,5);
					if(checkBackLeft.result){
						existCollision = true;
						this.rotationY = XF_Math.getAngleInc(this.rotationY,(XF_Math.RADIAN * 10));
						console.log('existCollision back left');
					}
					else {
						let checkBackRight = this.existCarCollisionsPoint(THREE,7);
						if(checkBackRight.result){
							existCollision = true;
							this.rotationY = XF_Math.getAngleDec(this.rotationY,(XF_Math.RADIAN * 10));
							console.log('existCollision back Right');
						}
					}	
				}//end if
				
			}//end if moveForward
			
			//moveback
			//.....................................................................................			
			else {
				/*
				let checkObjBackLeft = this.existCarCollisionsPoint(THREE,3);
				let checkObjBackCenter = this.existCarCollisionsPoint(THREE,4);
				let checkObjBackRight = this.existCarCollisionsPoint(THREE,5);
				if(checkObjBackCenter.result || checkObjBackLeft.result || checkObjBackRight.result){
					existCollision = true;
					this.velocity = 0;
				}				
				*/
			}//end if
		}		
	
		return existCollision;	
	}//end function

				
	existCarCollisionsPoint(THREE,pointIndex){
		let origin	= new THREE.Vector3(this.position.x,this.bodyCenterY,this.position.z);		 
		
		let camera	= new THREE.PerspectiveCamera(35, this.appmonitorWidth / this.app.monitorHeight, 0.001, 10000);			
		camera.position.x = this.position.x;
		camera.position.y = this.bodyCenterY;
		camera.position.z = this.position.z;
		let view =  new THREE.Vector3(this.bodypoints[pointIndex].position[0],
									  this.bodyCenterY,  
									  this.bodypoints[pointIndex].position[2]);	
		camera.lookAt(view);
		let cameraVector = new THREE.Vector3(); 
		camera.getWorldDirection(cameraVector);	

		let result = new WebGL_collision(false,null,null,null);	
		let raycaster = new THREE.Raycaster();	
		raycaster.set(origin,cameraVector);			
		raycaster.far = 10; 								
		let intersects = raycaster.intersectObjects(this.app.controlRace.targets);	
		if(intersects.length>0){
			if(intersects[0].distance<this.bodypoints[pointIndex].pivotDistance){				
				let intersObject = intersects[0];		
				result = new WebGL_collision(true,
									intersObject.object.parent.id,
									intersObject.distance,
									intersObject.point,
									null);			
			}
		}			
		return result;																	 				
	}//end function
		
	getCarCollisionsDistance(THREE,pointIndex){
		let origin	= new THREE.Vector3(this.position.x,this.bodyCenterY,this.position.z);		 
		
		let camera	= new THREE.PerspectiveCamera(35, this.appmonitorWidth / this.app.monitorHeight, 0.001, 10000);			
		camera.position.x = this.position.x;
		camera.position.y = this.bodyCenterY;
		camera.position.z = this.position.z;
		let view =  new THREE.Vector3(this.bodypoints[pointIndex].position[0],
									  this.bodyCenterY,  
									  this.bodypoints[pointIndex].position[2]);	
		camera.lookAt(view);
		let cameraVector = new THREE.Vector3(); 
		camera.getWorldDirection(cameraVector);			
		
		let distanceReturn = 1000;
		let raycaster = new THREE.Raycaster();	
		raycaster.set(origin,cameraVector);			
		raycaster.far = 1000; 
		let intersects = raycaster.intersectObjects(this.app.controlRace.targets);	
		if(intersects.length>0){
			distanceReturn = intersects[0].distance;
		}			
		return distanceReturn;					
	}//end function	
				
	
	//......................................................................................................
	// process Road Collisions
	//.......................................................................................................		
	processRoadCollisions(THREE){
		if(this.moveForward){						
			let existCollFront = this.existRoadCollisionsPoint(THREE,1);
			if(existCollFront){
				console.log('existCollFront');
			}
			
			if(existCollFront){
				this.velocity = 0;					
			}
			else {													
				let existCollFrontLeft = this.existRoadCollisionsPoint(THREE,0)
				if(existCollFrontLeft){
					let distRightToRoad = this.getRoadCollisionsDistance(THREE,2);
					if(distRightToRoad>4.0){
						this.rotationY = XF_Math.getAngleDec(this.rotationY,(XF_Math.RADIAN * 5));
						this.decrementVelocityCollision();
					}	
					else {
						this.velocity = 0;
					}					
				}
				else {
					let existCollFrontRight = this.existRoadCollisionsPoint(THREE,2);
					if(existCollFrontRight){
						let distLeftToRoad = this.getRoadCollisionsDistance(THREE,0);
						if(distLeftToRoad>4.0){
							this.rotationY = XF_Math.getAngleInc(this.rotationY,(XF_Math.RADIAN * 5));
							this.decrementVelocityCollision();
						}	
						else {
							this.velocity = 0;
						}						
					}
				}					
			}		
		}
		else {
			let existCollBack = this.existRoadCollisionsPoint(THREE,6);
			if(existCollBack){				
				this.velocity = 0;
			}
			else {
				this.velocity = this.velocityBack;
			}
		}					
	}//end function
	
	existRoadCollisionsPoint(THREE,pointIndex){
		let origin	= new THREE.Vector3(this.position.x,this.bodyCenterY,this.position.z);		 
		
		let camera	= new THREE.PerspectiveCamera(35, this.appmonitorWidth / this.app.monitorHeight, 0.001, 10000);			
		camera.position.x = this.position.x;
		camera.position.y = this.bodyCenterY;
		camera.position.z = this.position.z;
		let view =  new THREE.Vector3(this.bodypoints[pointIndex].position[0],
									  this.bodyCenterY,  
									  this.bodypoints[pointIndex].position[2]);	
		camera.lookAt(view);
		let cameraVector = new THREE.Vector3(); 
		camera.getWorldDirection(cameraVector);	

		let existCollision = false;
		let raycaster = new THREE.Raycaster();	
		raycaster.set(origin,cameraVector);			
		raycaster.far = 10; 								
		let intersects = raycaster.intersectObjects(this.app.gameRoad.walls.dtos);	
		if(intersects.length>0){
			if(intersects[0].distance<this.bodypoints[pointIndex].pivotDistance){
				existCollision = true;
			}
		}			
		return existCollision;																	 				
	}//end function
		
	getRoadCollisionsDistance(THREE,pointIndex){
		let origin	= new THREE.Vector3(this.position.x,this.bodyCenterY,this.position.z);		 
		
		let camera	= new THREE.PerspectiveCamera(35, this.appmonitorWidth / this.app.monitorHeight, 0.001, 10000);			
		camera.position.x = this.position.x;
		camera.position.y = this.bodyCenterY;
		camera.position.z = this.position.z;
		let view =  new THREE.Vector3(this.bodypoints[pointIndex].position[0],
									  this.bodyCenterY,  
									  this.bodypoints[pointIndex].position[2]);	
		camera.lookAt(view);
		let cameraVector = new THREE.Vector3(); 
		camera.getWorldDirection(cameraVector);	

		let distanceReturn = 0;
		let raycaster = new THREE.Raycaster();	
		raycaster.set(origin,cameraVector);			
		raycaster.far = 1000; 								
		let intersects = raycaster.intersectObjects(this.app.gameRoad.walls.dtos);	
		if(intersects.length>0){
			distanceReturn = intersects[0].distance;
		}			
		return distanceReturn;																		 				
	}//end function
			
		
	//.....................................................................................................		
	//for race control	
	//.....................................................................................................
	getPosition(){
		return WebGL_threeUtil.getVector3Coords(this.position);
	}//end function	
		
		
	//.......................................................................................................
	// records trucks cars and road
	//.......................................................................................................		
	recordStep(){
		let currentPosition = WebGL_threeUtil.getVector3Coords(this.position);		
		let storePosition = [
			currentPosition[0].toFixed(3),
			currentPosition[1].toFixed(3),
			currentPosition[2].toFixed(3)
		];	
		let storeVelocity = this.velocity.toFixed(5);
		let storeRotationY = this.wglCarRotationY.toFixed(5);	
		let storeRotationZ = this.rotationZ.toFixed(5);
		let step = new GameCarStep(storePosition,storeVelocity,storeRotationY,storeRotationZ);
		this.carTrack.addStep(step);		
	}//end function

	outputCarTrack(){		
		console.log(JSON.stringify(this.carTrack));		
	}//end function
		
	recordRoadStep(){
		let positionCoord3d = WebGL_threeUtil.getVector3Coords(this.position);		
		let roadPolyIndex = this.app.gameRoad.getPathStepIndexInPosition3d(positionCoord3d);
		let step = new GameRoadStep(roadPolyIndex);
		this.roadTrack.addStep(step);
	}//end function

	outputRoadTrack(){		
		console.log(JSON.stringify(this.roadTrack));		
	}//end function
	
	/*	
			let pivotPosition = WebGL_threeUtil.getVector3Coords(this.position);					
			this.volante.position =  XF_Math3dCf
					.getCf3dOneVertex(1,pivotPosition,this.volante.pivotDistance,this.rotationY);
					
			this.volante.position[1] = this.volante.coordY;	
	if(this.moveForward){				
		this.ruteAngleY = this.app.gameRoad.getPathRotationAtPosition3d(WebGL_threeUtil.getVector3Coords(this.position));
	}
	let rotationDiffY = 0;			
	if(this.rotationY>=this.ruteAngleY){
		rotationDiffY =XF_Math.getAngleDec(this.rotationY,this.ruteAngleY);
	}
	else {
		rotationDiffY = XF_Math.getAngleDec(this.ruteAngleY,this.rotationY) * (-1);
	}	
	calculateVelocityMs(distanciaMm,tiempoMs){
		let distanceMeters = distanciaMm /1000;
		let timeSeconds    = tiempoMs /1000;
		let metersPerSecond = distanceMeters / timeSeconds;		
		//let kmH = CarUtil.toKmH(metersPerSecond);		
		console.log(tiempoMs);
	}//end function
	*/
	
}//end class

