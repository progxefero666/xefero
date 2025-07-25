/**
 *  class  GameCarScene 
 */
 class  GameCarScene {        
	
	//constructor	
	constructor(app) {
		this.app 	= app;
		this.terrain = null;
		this.init(this.app.app_THREE);
	}//end constructor
	
	init(THREE){
		this.createlistExcludeObjects();
		
		let path = 	'data/gamecar/startpositions/startpositions.json';
		let jsonObj =  WebGL_util.readJSonObject(path);	
		this.starPositions= jsonObj.objects;
		
		this.skybox = WebGL_sceneUtil.createSkyBox(THREE,'data/gamecar/skyboxA/','skybox',120000);	
		this.skybox.name = 'skybox';
		this.app.scene.add(this.skybox);
		//this.buildingsDtos  = new WebGL_groupdtos(this,'data/doom/buildings/','buildings','buildings');
		//this.buildingsDtos.loadWglObjects(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);
				
		let speedometerMap = this.app.txtLoader.load( 'data/gamecar/racepanels/speedometerbase.png' );				
		let speedometerMaterial = new THREE.SpriteMaterial( { map: speedometerMap} );
		speedometerMaterial.needsUpdate = true
		speedometerMaterial.transparent =true;				
		this.speedometerback = new THREE.Sprite( speedometerMaterial );		
		this.app.scene.add( this.speedometerback );					
		//let arrowMap = this.app.txtLoader.load( 'data/gamecar/racepanels/speedometerarrow.png' );	
		
		let velocityInKmh = CarUtil.getVelocityInKmh(13); //this.app.player.velocity
		let numberMap =CarUtil.getSpeedometerTextureVelocity(THREE,velocityInKmh);				
					
		let arrowMaterial = new THREE.SpriteMaterial( { map: numberMap} );
		arrowMaterial.needsUpdate = true
		arrowMaterial.transparent =true;
		this.speedometerarrow = new THREE.Sprite( arrowMaterial );		
		this.app.scene.add( this.speedometerarrow );		
		
		let positionValueMap =CarUtil.getRacePositionTexture(THREE,5);	
		let positionValueMaterial = new THREE.SpriteMaterial( { map: positionValueMap} );
		positionValueMaterial.needsUpdate = true
		positionValueMaterial.transparent =true;
		this.positionValue = new THREE.Sprite( positionValueMaterial );	
		this.app.scene.add( this.positionValue );
		
		this.chargeCars();
										
	}//end function			
	
	chargeCars(){
		this.machineCars = [];		
		
		this.machineCars[0]= new CarMachine(this.app,'car2','rayo',0,'data/gamecar/cars/car1/track1.json',null);	
		this.machineCars[1]= new CarMachine(this.app,'car3','destroyer',1,null,this.starPositions[1].position);

		/*
		let aleatCoord = this.app.gameRoad.getRoadAleatoryCoord();
		this.machineCars[0]= new CarMachine(this.app,'muscleA',null,0,aleatCoord);

		aleatCoord = this.app.gameRoad.getRoadAleatoryCoord();
		this.machineCars[1]= new CarMachine(this.app,'muscleB',null,1,aleatCoord);

		aleatCoord = this.app.gameRoad.getRoadAleatoryCoord();
		this.machineCars[2]= new CarMachine(this.app,'muscleC',null,2,aleatCoord);

		aleatCoord = this.app.gameRoad.getRoadAleatoryCoord();
		this.machineCars[3]= new CarMachine(this.app,'porsche',null,3,aleatCoord);
		*/
	}//end funcion
	
	getPositionByIndex(positionIndex){
		return this.starPositions[positionIndex].position;
	}//end function	
	
	alertAllDtosCharged(id){
		switch (id) {	    	 
			case 'buildings':
					//this.buildingsDtos.setLayer(1);
				break;			
		 	default:
	    }//end switch
	}//end function	


	dinamic(THREE,wglCamera){
				
		//skybox
		//...............................................................................
		if(this.app.player.position!=null){
			this.skybox.position.x = this.app.player.position.x;
			this.skybox.position.y = this.app.player.position.y;
			this.skybox.position.z = this.app.player.position.z;
		}
		
		/*
		if(this.machineCars[0].machine.grdto!=null){
			this.machineCars[0].dinamic();
		}
		*/
			
		//set speedometerback position
		//..................................................................................		
		let cameraCalc = wglCamera.clone();
		let cameraVector = new THREE.Vector3(); 
		cameraCalc.getWorldDirection(cameraVector);		
		cameraVector.multiplyScalar(4);	
		cameraCalc.translateX(3.2*(-1));	
		cameraCalc.translateY(0.6*(-1));	
		this.speedometerback.position.x = cameraCalc.position.x+ cameraVector.x;
		this.speedometerback.position.y = cameraCalc.position.y+ cameraVector.y;
		this.speedometerback.position.z = cameraCalc.position.z+ cameraVector.z;		
		cameraCalc.translateY(0.6);			
		cameraCalc.translateX(3.2);			
		
		if(this.app.player.velocity!=null){
			let velocityInKmh = CarUtil.getVelocityInKmh(this.app.player.velocity);
			let numberMap =CarUtil.getSpeedometerTextureVelocity(THREE,velocityInKmh);	
			this.speedometerarrow.material.map = numberMap;	
		}
													
		cameraCalc = wglCamera.clone();
		cameraVector = new THREE.Vector3(); 
		cameraCalc.getWorldDirection(cameraVector);		
		cameraVector.multiplyScalar(3.99);	
		cameraCalc.translateX(3.2*(-1));	
		cameraCalc.translateY(0.6*(-1));	
		this.speedometerarrow.position.x = cameraCalc.position.x+ cameraVector.x;
		this.speedometerarrow.position.y = cameraCalc.position.y+ cameraVector.y;
		this.speedometerarrow.position.z = cameraCalc.position.z+ cameraVector.z;		
		cameraCalc.translateY(0.6);			
		cameraCalc.translateX(3.2);		

		if(this.app.gameRoad!=null && this.app.controlRace!=null){
			let playerPosition = this.app.controlRace.getPlayerRacePosition();
			//console.log(playerPosition);
			let positionValueMap =CarUtil.getRacePositionTexture(THREE,playerPosition);
			this.positionValue.material.map = positionValueMap;	
		}
		

		//this.positionValue
		cameraCalc = wglCamera.clone();
		cameraVector = new THREE.Vector3(); 
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
				
	executeTest(){
		console.log('execute test');
		let textureB = this.app.txtLoader.load( 'data/sprites/snowflake2.png' );
		this.speedometerback.material.map = textureB;	
	}//end function		
		
	getPositionTerrainHeight(THREE,coordX,coordZ){
		let terrainHeight = 1;
		
		/*
		let vectorUp = new THREE.Vector3(coordX,50000,coordZ); 
		let vectorDown = new THREE.Vector3(coordX,-50000,coordZ);
		//let terrainObj = this.app.scene.getObjectByName('terrain');
		let raycaster = new THREE.Raycaster(vectorUp,vectorDown,0,100000);
		let intersects = raycaster.intersectObjects(this.app.scene.children);
		console.log(intersects.length);
		if(intersects.length>0){				
			for (let i=0;i< intersects.length;i++) {
				if(intersects[i].object.name == 'terrain'){
					terrainHeight = intersects[i].point.y;
					break;
				}
			}
		}
		*/
		let coordCalc = [coordX,10000,coordZ];
		let polycenter = this.terrain.getFaceCenterInPosition3d(coordCalc);
		if(polycenter!=null){
			//console.log('not null');		
			terrainHeight = polycenter[1];
		}			
		else {
			//console.log(' null');	
		}
	
		//console.log(terrainHeight);			
		return terrainHeight;
	}//end function
				
	checkCoord3dIntoTerrain(pointCoord3d){		
		return this.terrain.isPointIntoTerrain(pointCoord3d);
	}//end functio
			
	getCoord3dIntoTerrain(pointCoord3d){		
		return this.terrain.getFaceCenterInPosition3d(pointCoord3d);
	}//end functio
				
	isExcludeObjectByName(objectName){		
		let inArray = this.listExcludeObjects.includes(objectName);
		return inArray;
	}//end function
				
	createlistExcludeObjects(){	
		this.listExcludeObjects = [];
		this.listExcludeObjects.push('skybox');
		this.listExcludeObjects.push('terrain');
		this.listExcludeObjects.push('buildings');
		this.listExcludeObjects.push('target');
	}//end function
		


}//end class