41/**
 * class CarPlayer.TURN_INC_DEFAULT
 */

var thisDoomPlayer = null;

class CarPlayer {        
    
    static TURN_DEC_DEFAULT = XF_Math.RADIAN * 0.001;
    static TURN_DEC_REDUCE = XF_Math.RADIAN *  0.000001;
    
	//constructor	
	constructor(app,raceInitPosition) {
		this.app 	  	= app;		
		this.raceInitPosition = raceInitPosition;
		this.startPosition = this.app.gameScene.getPositionByIndex(this.raceInitPosition);
		this.wglCar		= null;
		thisDoomPlayer 	= this;		
		this.carTrack = new GameCarTrack();
		this.machine = new WebGL_groupdtos(this,'data/gamecar/cars/car1/','car1','car1');
		this.machine.loadWglObjects(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);			
		//this.machine.boundRadius	
		this.raceLap = 0;				
		this.inNextLap = false;
		this.roadTrack = new GameRoadTrack();		
	}//end constructor	
	
	alertAllDtosCharged(id){
		
		switch (id) {
			case 'car1':
				this.wglCar	= this.machine.grdto;				
				this.configure(this.app.app_THREE,this.startPosition);//[300,0,0]
				this.app.gameReady = true;
				break;
	 		case 'hview':break;	  			
		 	default:
	    }//end switch		    		
	}//end function		
		
	configure(THREE,initPosition){
		/*
		audiA8: distance pivot to front 150mm
			550 + 150 = 700
		*/
		//configure camera and horizont view parameters
		this.distPivotToCarFront = 150;
		this.distCarToCameraZ   = 550;				
		this.distCarToCameraY 	= 140.0;
		this.hviewDistZ 		= 500;
		this.hviewPoint			= [0,0,0];
		
		this.hview = new WebGL_dto(this,'data/gamecar/car/','target');
		this.hview.loadWglObject(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null); 	
				
		//configure dinamic parameters			
		this.velocity 		= 0.01;
		this.velocityMin 	= 0.01;
		this.velocityMax 	= 15;
		this.velocityInc 	= 0.02;
		this.velocityD 		= 0.01;
		this.velocityOut	= 0.5;
		this.velocityBack	= 1.0;
		this.turnValueMin 	= XF_Math.RADIAN * 0.2;
		this.turnValueMax 	= XF_Math.RADIAN * 1.2;	
		this.rotationY 		= 0;
		//init state parameters
		this.moveForward 		= true; 		
		this.moveBackward 		= false; 
		this.acelerationState 	= 'speedCero';
		this.turnState 			= 'cero';
		this.turnValue 			= 0;		
		this.wglCarRotationY 	= 0;
		this.wglCarRotationMax 	= XF_Math.RADIAN * 45;
		
	
		this.nextPosition = [0,0,0];
		this.app.camera.position.x = initPosition[0];
		this.app.camera.position.y = this.distCarToCameraY;
		this.app.camera.position.z = initPosition[2]+this.distCarToCameraZ;
		
		this.position = new THREE.Vector3(); 
		this.position.x = initPosition[0];
		this.position.y = initPosition[1];
		this.position.z = initPosition[2];	
		this.roadCooordH = 0;
		//this.setPosition(THREE,this.app.camera);		
		this.rotation = new THREE.Vector3(0,0,0);
		
		this.hviewPoint =  [this.app.camera.position.x,0,this.app.camera.position.z - this.hviewDistZ];
		
		//configure collisions
		this.checkC = true;
				
		this.lastPercent = 0;
		this.currentPercent = 0;
		this.rotationX = 0;
		this.maxDiff = 1870;
		this.updateWglState();
	}//end function

	alertFinishLap(){
		this.raceLap++;
	}//end function	
		
	dinamic(THREE,wglCamera){

		// if state turning reduce turn value progressively		
		//..................................................................................
		if(this.turnState!='cero'){			
			if(this.moveForward){
				this.turnValue -= CarPlayer.TURN_DEC_REDUCE;
				if(this.turnState=='right'){
					wglCamera.rotateY(this.turnValue * (-1));
				}
				else {
					wglCamera.rotateY(this.turnValue);
				}				
			}
			else {
				if(this.turnState=='right'){
					wglCamera.rotateY(this.turnValue);
				}
				else {
					wglCamera.rotateY(this.turnValue* (-1));
				}					
			}			
		}//end if

		//speed control 
		//...............................................................................																						


		let validPosition = this.checkNextPosition(THREE,wglCamera);		

		//move
		//..................................................................................			
		//if(this.moveForward || this.moveBackward){			
		if(!validPosition){			
			this.velocity = this.velocityOut;	
		}	
		else {				
			
			let existCollision = false;
			if(this.checkC){
				//existCollision = this.app.controlRace.checkCollisions(THREE,wglCamera,this.position,this.distPivotToCarFront);
				//this.app.gameRoad.checkCollisions(THREE,wglCamera,this.position,150);
			}
			if(!existCollision){				
				if(this.moveForward){	
					switch (this.acelerationState) {
				 		case 'speedCero':
							if(this.velocity >0 ){								
								this.decrementVelocity();
							} 
							break;	
						case 'speedUp':	 this.useAccelerator(); break;							
						case 'speedDown':this.useBrakes(); break;													
					 	default:
				    }//end switch	
				}//end if
						
				this.setCameraPosition(wglCamera);
				
				//...................................................................................................................
				this.currentPercent = XF_Math.getPercent(this.maxDiff,this.roadCooordH);								 																				
				if(this.currentPercent!=this.lastPercent){
					let percentDiff = 0;
					if(this.currentPercent>this.lastPercent){
						percentDiff = this.currentPercent-this.lastPercent;																				
						let percent8 = XF_Math.getPercent(8,percentDiff);
						let rotAngleDegrees =  XF_Math.getValuePercent(35,percent8);
						this.rotationX = XF_Math.RADIAN * rotAngleDegrees;
					}
					else {				
						percentDiff = this.lastPercent-this.currentPercent;
						let percent8 = XF_Math.getPercent(8,percentDiff);
						let rotAngleDegrees =  XF_Math.getValuePercent(25,percent8);									
						this.rotationX =  XF_Math.RADIAN * rotAngleDegrees* (-1);
					}							
				}
				this.lastPercent = this.currentPercent;
				//...................................................................................................................
					
				this.position.x = this.nextPosition.x;
				this.position.z = this.nextPosition.z;	
				this.position.y = this.roadCooordH;					
			}				
			else {
				//console.log('existe collision');
				if(this.moveForward){
					this.velocity = 0;
				}		
				else {
					this.setCameraPosition(wglCamera);
					this.position.x = this.nextPosition.x;
					this.position.z = this.nextPosition.z;	
					this.position.y = this.roadCooordH;						
				}							
			}
		}				
		//}end if
		
		this.rotation = wglCamera.rotation.clone();	
		
		//set HView position , camera y and update wgl player state
		//..................................................................................		
		wglCamera.position.y = this.position.y + this.distCarToCameraY;			
			
		this.setNextHViewPosition();	
		if(this.hview.dto!=null){
			WebGL_threeUtil.setObjectStateToCameraView(THREE,wglCamera,this.hview.dto,this.hviewDistZ);	
		}																
		
		//for record tracks
		let angleWgl  = XF_Math3dUtil.getTwoVertexAngle_Y
			(WebGL_threeUtil.getVector3Coords(wglCamera.position),this.hviewPoint);
		this.rotationY  = XF_Math.getAngleDec(angleWgl,(Math.PI/2));
										
		this.updateWglState();								
		//add to rotation Y the inerce rotation
		//..................................................................................				
		let rotAdd = CarUtil.calculateWglCarRotationAddY(this.turnState,this.wglCarRotationMax,this.turnValueMax,this.turnValue);
		this.wglCar.rotateY(rotAdd);

	}//end function
	
	updateWglState(){			
		this.wglCar.rotation.z = this.rotation.z;				
		this.wglCar.rotation.y = this.rotation.y;
		this.wglCar.rotation.x = this.rotation.x;
		
		this.wglCar.rotateX(this.rotationX);
		this.wglCar.position.x = this.position.x;
		this.wglCar.position.y = this.position.y;
		this.wglCar.position.z = this.position.z;		
	}//end function
		

			
	setCameraPosition(wglCamera){		
		let currentPosition = WebGL_threeUtil.getVector3Coords(wglCamera.position);
		let rotPlaneY 		= XF_Math3dUtil.getTwoVertexAngle_Y(currentPosition,this.hviewPoint);
		let pivot 			= new XF_Pivot();
		pivot.movePivot([wglCamera.position.x,wglCamera.position.y,wglCamera.position.z]);	
		pivot.rotatePivot(1,rotPlaneY);	
		
		let nextPosition = [currentPosition[0],currentPosition[1],currentPosition[2]];	
		if(this.moveForward){
			nextPosition = pivot.getDirecctionVertex(0,this.velocity);
		}
		else {
			nextPosition= pivot.getDirecctionVertexInverse(0,this.velocity);
		}
		wglCamera.position.x = nextPosition[0];
		wglCamera.position.y = nextPosition[1];
		wglCamera.position.z = nextPosition[2];					
	}//end function				
		
	setNextHViewPosition(){
		let currentPosition = WebGL_threeUtil.getVector3Coords(this.position);
		let rotPlaneY 		= XF_Math3dUtil.getTwoVertexAngle_Y(currentPosition,this.hviewPoint);
		let pivot 			= new XF_Pivot();
		pivot.movePivot(currentPosition);	
		pivot.rotatePivot(1,rotPlaneY);	
		this.hviewPoint =  pivot.getDirecctionVertex(0,this.hviewDistZ);					
	}//end function
					
	//movementSpeed
	calculateNextPosition(THREE,wglCamera){
		let cameraVector = new THREE.Vector3(); 
		wglCamera.getWorldDirection(cameraVector);			  		
		cameraVector.multiplyScalar(this.distCarToCameraZ);
		this.nextPosition = new THREE.Vector3();
		this.nextPosition.x = wglCamera.position.x+ cameraVector.x;
		this.nextPosition.y = this.roadCooordH;
		this.nextPosition.z = wglCamera.position.z+ cameraVector.z;		
	}//end function

	checkNextPosition(THREE,wglCamera){
		let check = false;	
		if(this.position!=null)	{
			this.calculateNextPosition(THREE,wglCamera);
			let coordCalc = WebGL_threeUtil.getVector3Coords(this.nextPosition);
			check = true;
			let terrainHeight = this.app.gameRoad.getRoadHeightAtPosition3d(THREE,coordCalc);
			if(terrainHeight!=(-100000)){
				this.roadCooordH = terrainHeight;	
			}
			else {
				check = false;
			}
		}	
		else {
			check = true;
		}			
		return check;
	}//end function
			
	//.....................................................................................................		
	//for race control	
	//.....................................................................................................
	getPosition(){
		return WebGL_threeUtil.getVector3Coords(this.position);
	}//end function			
	
	//.......................................................................................................
	//gamepads actions
	//.......................................................................................................
	girarZero(){
		if(this.turnState!='cero'){
			this.turnState = 'cero';
		}				
		this.turnValue = this.turnValueMin;
	}//end function	
		
	girarDerecha(){
		if(this.turnState!='right'){
			this.turnState = 'right';
		}		
		this.turnValue = this.turnValueMin;		
	}//end function	
		
	girarIzquierda(){
		if(this.turnState!='left'){
			this.turnState = 'left';		
		}			
		this.turnValue = this.turnValueMin;
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
			this.velocity = 0.01;
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
				
	useAccelerator(){
		if(this.velocity==this.velocityMax){
			return;
		}
		let potVelocity = this.velocity + this.velocityInc;
		if(potVelocity<=this.velocityMax){			
			this.velocity = potVelocity;			
		}		
		else {
			this.velocity = this.velocityMax;
		}
	}//end function
		
	useBrakes(){
		if(this.velocity >0 ){
			let potVelocity = this.velocity - this.velocityInc;
			if(potVelocity>=0){
				this.velocity = potVelocity;				
			}		
			else {
				this.velocity = 0;
			}
		}
	}//end function
			
	decrementVelocity(){
		if(this.velocity >0 ){
			let potVelocity = this.velocity - this.velocityD;
			if(potVelocity>=0){
				this.velocity = potVelocity;				
			}		
			else {
				this.velocity = 0;
			}	
		}

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
		let storeRotationX = this.rotationX.toFixed(5);	
		let storeRotationY = this.rotationY.toFixed(5);	
		let step = new GameCarStep(storePosition,storeRotationX,storeRotationY);
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
	
}//end class

