/**
 * class GameCarRaceControl
 */
class GameCarRaceControl{        
       
	//constructor	
	constructor(app) {
		this.app 	= app;
		this.targets = [];
		this.init();
		this.updateRaceValues();
	}//end constructor
	
	init(){
		this.countLaps = 2;
		
		this.countMachineCars = this.app.gameScene.machineCars.length;
		this.countPositions = this.app.gameScene.machineCars.length + 1;
		this.playerCarIndex= this.countMachineCars;
				
		this.racePosition = [];		
		for(let posIndex=0;posIndex<this.countPositions;posIndex++){
			if(this.app.player.raceInitPosition == posIndex ){
				this.racePosition[posIndex] = this.playerCarIndex;
			}
			else {
				let carIndex = -1;
				for(let idx =0;idx<this.countMachineCars;idx++){	
					if(this.app.gameScene.machineCars[idx].raceInitPosition == posIndex ){
						carIndex = idx;					
						break;
					}
				}//end for		
				this.racePosition[posIndex] = carIndex;		
			}
		}//end for

	}//end function	
	
	dinamic(){
		this.updateRaceValues();				
		
	}//end function		
	
	addCarMachine(car){
		this.targets.push(car);
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
		
	updateRaceValues(){
		
		//update cars raceLap
		//.........................................................................
		
		
		//read values
		//.........................................................................
		let carsLapIndex = [];
		let carsCoords = [];
		for(let idx =0;idx<this.countMachineCars;idx++){	
			carsLapIndex[idx] = this.app.gameScene.machineCars[idx].raceLap;
			carsCoords[idx] = this.app.gameScene.machineCars[idx].getPosition();
		}//end for
		carsLapIndex[this.playerCarIndex] = this.app.player.raceLap;
		if(this.app.player.position!=null){
			carsCoords[this.playerCarIndex] = this.app.player.getPosition();
		}
		else {
			carsCoords[this.playerCarIndex] = this.app.player.startPosition;
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
						//console.log('alertFinishLap');
						this.app.player.alertFinishLap();
						carsLapIndex[idx]++;
					}
				}
				else {
					if(!this.app.gameScene.machineCars[idx].inNextLap){
						this.app.gameScene.machineCars[idx].inNextLap = true;
						this.app.gameScene.machineCars[idx].alertFinishLap();
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
					if(this.app.gameScene.machineCars[idx].inNextLap){
						this.app.gameScene.machineCars[idx].inNextLap = false;
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
	
	checkCollisions(THREE,wglCamera,checkPosition,checkDistance){ //this.distPivotToCarFront
		let result = false;				
		let origin	= new THREE.Vector3(checkPosition.x,25,checkPosition.z);							
		let cameraWork	= wglCamera.clone();	
		cameraWork.position.y = 25;
		let cameraVector = new THREE.Vector3(); 
		cameraWork.getWorldDirection(cameraVector);
		let raycaster = new THREE.Raycaster();	
		raycaster.set(origin,cameraVector);				
		raycaster.far = 2000; 								
		let intersects = raycaster.intersectObjects(this.targets);		
		if(intersects.length>0){
			for (let i=0;i< intersects.length;i++) {
				if(intersects[i].distance<checkDistance){
					result = true;
					console.log('collision');	
					break;				
				}				
			}
		}
		return result;		
	}//end function
							
}//end class	

/**
 * class GameCarRaceControl
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