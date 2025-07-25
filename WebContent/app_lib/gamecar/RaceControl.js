/**
 * RaceControl
 */
class RaceControl{        
     
    static CHAMPION_PATH = 'gamecar/championship/circuit/';
       
	//constructor	
	constructor(app,circuitId) {
		this.app 	= app;
		this.circuitId = circuitId;
		
		this.dataPath = RaceRoadControl.CIRCUITS_PATH.concat(this.circuitId).concat('/road/');
		
		let roadPath = 	this.dataPath.concat('startpositions.json');
		let jsonObjPositions =  WebGL_util.readJSonObject(roadPath);	
		this.starPositions= jsonObjPositions.objects;				

			
	

	}//end constructor
	
	init(THREE){
		this.countLaps = 2;
		this.targets = [];
		this.countLoadedCars = 0;
		
		this.chargeCars();		
		
		this.countMachineCars = this.machineCars.length;
		this.countPositions = this.machineCars.length + 1;
		this.playerCarIndex= this.countMachineCars;
				
		this.racePosition = [];		
		for(let posIndex=0;posIndex<this.countPositions;posIndex++){
			if(this.app.player.raceInitPosition == posIndex ){
				this.racePosition[posIndex] = this.playerCarIndex;
			}
			else {
				let carIndex = -1;
				for(let idx =0;idx<this.countMachineCars;idx++){	
					if(this.machineCars[idx].raceInitPosition == posIndex ){
						carIndex = idx;					
						break;
					}
				}//end for		
				this.racePosition[posIndex] = carIndex;		
			}
		}//end for		
		
		let positionValueMap =CarUtil.getRacePositionTexture(THREE,5);	
		let positionValueMaterial = new THREE.SpriteMaterial( { map: positionValueMap} );
		positionValueMaterial.needsUpdate = true
		positionValueMaterial.transparent =true;
		this.positionValue = new THREE.Sprite( positionValueMaterial );	
		this.app.scene.add( this.positionValue );
				
	}//end function
			
	chargeCars(){				
		let qualifyPath = RaceControl.CHAMPION_PATH.concat(this.circuitId).concat('.json');			
		let objQualify =  WebGL_util.readJSonObject(qualifyPath);	
		
		//this.machineCars[0]= new CarMachine(this.app,'mercedes','rayo',		
		//									0,'gamecar/tracks/trackA.json',null);
							
		//racers	
		this.machineCars = [];
		let carIndex = 0;
		for(let idx=0;idx<objQualify.racers.length;idx++){
			let add = false;
			if(objQualify.racers[idx].team!=this.app.player.team) {
				add = true;
			}
			else {
				if(objQualify.racers[idx].member!=this.app.player.member) {
					add = true;
				}
			}
			if(add){
				this.machineCars[carIndex]= new CarMachine(this.app,
												objQualify.racers[idx].team,
												objQualify.racers[idx].member,
												idx,
												null,this.starPositions[idx].position);
				carIndex++;				
			}										
		}		
		console.log(this.machineCars.length);																															
	}//end funcion
	
	getQualifyPosition(team,member){
		let qualifyPath = RaceControl.CHAMPION_PATH.concat(this.circuitId).concat('.json');			
		let objQualify =  WebGL_util.readJSonObject(qualifyPath);	
		let position = 0;
		for(let idx=0;idx<objQualify.racers.length;idx++){
			if( (objQualify.racers[idx].team==team) && 
			    (objQualify.racers[idx].member==member) )  {
				position= idx;
				break;					
			}											
		}		
		return position;
	}//end funcion
	
	addCarMachine(car){
		this.targets.push(car);	
	}//end function
		
	dinamic(THREE,wglCamera){
		
		for(let carIdx=0;carIdx<this.machineCars.length;carIdx++){
			if(this.machineCars[carIdx].track!=null){					
				if(!this.machineCars[carIdx].raceFinished){
					this.machineCars[carIdx].dinamic();
				}				
			}				
		}		
				
		this.updateRaceValues();				
	
		let playerPosition = this.getPlayerRacePosition();		
		let positionValueMap =CarUtil.getRacePositionTexture(THREE,playerPosition);
		this.positionValue.material.map = positionValueMap;			

		//this.positionValue
		let cameraCalc = wglCamera.clone();
		let cameraVector = new THREE.Vector3(); 
		cameraCalc.getWorldDirection(cameraVector);		
		cameraVector.multiplyScalar(3.99);	
		cameraCalc.translateX(2.9*(-1));	
		cameraCalc.translateY(0.6);	
		this.positionValue.position.x = cameraCalc.position.x+ cameraVector.x;
		this.positionValue.position.y = cameraCalc.position.y+ cameraVector.y;
		this.positionValue.position.z = cameraCalc.position.z+ cameraVector.z;		
		cameraCalc.translateY(-0.6);			
		cameraCalc.translateX(2.9);	
		
	}//end function	
	
	getPlayerMachineRacePosition(carIndex){
		let racePosition = -1;
		for(let posIndex =0;posIndex<this.racePosition.length;posIndex++){
			if(this.racePosition[posIndex]==carIndex){
				racePosition = posIndex + 1;
				break;
			}
		}
		return racePosition;		
	}//end function		
	
	getPlayerRacePosition(){
		let racePosition = -1;
		for(let posIndex =0;posIndex<this.racePosition.length;posIndex++){
			if(this.racePosition[posIndex]==this.playerCarIndex){
				racePosition = posIndex + 1;
				break;
			}
		}
		return racePosition;
	}//end function
	
	getPositionByIndex(positionIndex){
		return this.starPositions[positionIndex].position;
	}//end function	
	
	updateRaceValues(){
			
		
		//read values
		//.........................................................................
		let carsLapIndex = [];
		let carsCoords = [];
		for(let idx =0;idx<this.countMachineCars;idx++){	
			carsLapIndex[idx] = this.machineCars[idx].raceLap;
			carsCoords[idx] = this.machineCars[idx].getPosition();
		}//end for
		carsLapIndex[this.playerCarIndex] = this.app.player.raceLap;
		if(this.app.player.position!=null){
			carsCoords[this.playerCarIndex] = this.app.player.getPosition();
		}
		else {		
			carsCoords[this.playerCarIndex] = this.getPositionByIndex(this.app.player.raceInitPosition);
		}
				
		let carStates = [];
		let carsPathStepIndex = [];
		let carsPathStepDistance = [];
		for(let idx =0;idx<=this.countMachineCars;idx++){
			carsPathStepIndex[idx] = this.app.gameRoad.getPathStepIndexInPosition3d(carsCoords[idx]);

			
			if(carsPathStepIndex[idx]==0){
				if(idx==this.playerCarIndex){
					if(!this.app.player.inNextLap){
						this.app.player.inNextLap = true;					
						this.app.player.alertFinishLap();
						carsLapIndex[idx]++;					
					}
				}
				else {
					if(!this.machineCars[idx].inNextLap){
						this.machineCars[idx].inNextLap = true;
						this.machineCars[idx].alertFinishLap();
						carsLapIndex[idx]++;						
					}
				}
			}
			else{
				if(idx==this.playerCarIndex){
					if(this.app.player.inNextLap){
						this.app.player.inNextLap = false;
					}					
				}
				else {
					if(this.machineCars[idx].inNextLap){
						this.machineCars[idx].inNextLap = false;
					}					
				}				
			}
			
			carsPathStepDistance[idx] = this.app.gameRoad.getPathStepIndexDistanceToPosition3d(carsPathStepIndex[idx],carsCoords[idx]);			
			carStates[idx] = new CarState(idx,carsLapIndex[idx],carsPathStepIndex[idx],carsPathStepDistance[idx]);
						
		}//end for
		
		
		// order carStates by raceLap
		//.........................................................................		
		let order = false;
		while(!order){
			order = true;
			for(let idx =0;idx<carStates.length-1;idx++){
				if(carStates[idx].lapIndex<carStates[idx+1].lapIndex){
					order = false;
					let tempCarState = carStates[idx].clone();
					carStates[idx] = carStates[idx+1].clone();
					carStates[idx+1] = tempCarState;
					break;
				}
			}//end for			
		}//end while

		// order carStates by step index 
		//.........................................................................	
		order = false;
		while(!order){
			order = true;
			for(let idx =0;idx<carStates.length-1;idx++){
				if(carStates[idx].lapIndex==carStates[idx+1].lapIndex){				
					if(carStates[idx].stepIndex<carStates[idx+1].stepIndex){												
						order = false;
						let tempCarState = carStates[idx].clone();
						carStates[idx] = carStates[idx+1].clone();
						carStates[idx+1] = tempCarState;
						break;						
					}
					else {
						if(carStates[idx].stepIndex==carStates[idx+1].stepIndex){
							if(carStates[idx].stepDistance>carStates[idx+1].stepDistance){
								order = false;
								let tempCarState = carStates[idx].clone();
								carStates[idx] = carStates[idx+1].clone();
								carStates[idx+1] = tempCarState;
								break;								
							}
						}						
					}
				}
			}//end for	
		}//end while
		
		// set new race position
		//.........................................................................			
		for(let posIndex =0;posIndex<carStates.length;posIndex++){
			this.racePosition[posIndex] = carStates[posIndex].carIndex;			
		}//end for		
		
		let maxRaceLap = 0;
		for(let stateIndex =0;stateIndex<carStates.length;stateIndex++){
			if(maxRaceLap<carStates[stateIndex].lapIndex){
				maxRaceLap = carStates[stateIndex].lapIndex;
			}
		}
		this.raceLap = maxRaceLap;
		
		// debug
		//.........................................................................		
		/*
		for(let posIndex =0;posIndex<this.racePosition.length;posIndex++){
			console.log(this.racePosition[posIndex]);
		}
		*/		
	}//end function					
			
	getCarIndexByWglId(wglId){		
		let indexReturn = -1;
		for(let idx=0;idx<this.machineCars.length;idx++){			
			if(this.machineCars[idx].wglId == wglId){
				 indexReturn = idx;				
				 break;		
			}
		}
		return indexReturn;
	}//end function
	
	getCarDistanceByIndex(coord3d,carIndex){
		let carCoord = this.machineCars[carIndex].getPosition();
		return XF_Math3dUtil.getDistance3d(coord3d,carCoord);					
	}//end function
				
	getCarIndexLessDistance(coord3d){
		let distanceLess = 10000;
		let indexReturn = 0;
		for(let idx=0;idx<this.machineCars.length;idx++){
			let carCoord = this.machineCars[idx].getPosition();
			let distance = XF_Math3dUtil.getDistance3d(coord3d,carCoord);
			if(distance<distanceLess){
				indexReturn = idx;
				distanceLess = distance;
			}
		}
		return indexReturn;
	}//end function
				
	alertCarCollision(intersObject){
		let carIndex = this.getCarIndexByWglId(intersObject.object.parent.id);
		console.log(carIndex);
		//let carIndex = this.getCarIndexByDtoId();
	}//end function
	
	/*
	checkCollisions(THREE,wglCamera,checkPosition,checkDistance){ //this.distPivotToCarFront
		
		let origin	= new THREE.Vector3(checkPosition.x,25,checkPosition.z);							
		let cameraWork	= wglCamera.clone();	
		cameraWork.position.y = 25;
		let cameraVector = new THREE.Vector3(); 
		cameraWork.getWorldDirection(cameraVector);
		let raycaster = new THREE.Raycaster();	
		raycaster.set(origin,cameraVector);	
		
		raycaster.far = 2000; 								
		let intersects = raycaster.intersectObjects(this.targets);	
		let result = new WebGL_collision(false,null,null,null);		
		if(intersects.length>0){
			for (let i=0;i< intersects.length;i++) {
				if(intersects[i].distance<checkDistance){				
					let intersObject = intersects[i];		
					result = new WebGL_collision(true,
										intersObject.object.parent.id,
										intersObject.distance,
										intersObject.point);															
					break;				
				}				
			}
		}			
		return result;		
	}//end function
	*/			
	
}//end class

/**
 * class CarState
 */
class CarState{        
       
	//constructor	
	constructor(carIndex,lapIndex,stepIndex,stepDistance) {
		this.carIndex 	  = carIndex;
		this.lapIndex 	  = lapIndex;
		this.stepIndex 	  = stepIndex;
		this.stepDistance = stepDistance;
	}//end constructor
	
	clone(){
		return new CarState(this.carIndex,this.lapIndex,this.stepIndex,this.stepDistance);
	}
}//end class