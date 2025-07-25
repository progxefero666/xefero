/**
 * class GamePlayerShip
 */
 class GamePlayerShip {        
    
	constructor(app,webglObject,cameraInitPosition,initCoordY) {
		this.app 			 = app;
		this.webglObject 	 = webglObject;
		this.velocity 	 	 = 1;
		this.cameraPosition	 = cameraInitPosition;
		this.pivot 			 = new XF_Pivot();
		this.initCoordY		 = initCoordY;
		this.listCoordsFrontBalls = null;
	}//end constructor
	
	init(THREE,webglObjectsLeft,webglObjectsRight){
		this.webglObjectsLeft = webglObjectsLeft;
		this.webglObjectsRight = webglObjectsRight;
		
		// parameters: fire target
		//...............................................			
		this.firesDistToCenterZ = 16.263;
		this.targetDistance 	= 2000;
		this.firesAlcanzeMax	= 2000;		
		this.firePositionR 		= this.pivot.getDirecctionVertex(2,this.firesDistToCenterZ);
		this.firePositionL		= this.pivot.getDirecctionVertexInverse(2,this.firesDistToCenterZ);	
				
		// init all objects position
		//...............................................					
		let initPlayerPosition = [0,this.initCoordY	,0];
		this.movePivot(initPlayerPosition);
		WebGL_threeUtil.setWglObjectPosition(this.webglObject,initPlayerPosition);
		for(let idx=0;idx<this.webglObjectsLeft.length;idx++){
			WebGL_threeUtil.setWglObjectPosition(this.webglObjectsLeft[idx],initPlayerPosition);
		}
		for(let idx=0;idx<this.webglObjectsRight.length;idx++){
			WebGL_threeUtil.setWglObjectPosition(this.webglObjectsRight[idx],initPlayerPosition);
		}
				
		// parameters: camera
		//...............................................					
		this.cameraRotationY 	= RADIAN * 270;
		this.cameraDistance 	= 300;
		this.cameraElevationAdd = 30;
		
		// parameters: rotation Y
		//...............................................		
		this.objectChargedId 	= 'rotationZero';	
		this.activeRotationY 	= false;
		this.intensityRotationY = 10;
		this.dirRotationY 		= 'left';
		this.currentRotationY 	= 0;
		this.incRotationY 		= 0.1;
		this.executeStopHR		= false;
		this.percentRotationY 	= 0;
		
		// parameters: elevation
		//...............................................		
		this.incElevationZ = 1.0;
		this.activeElevation = false;
		this.dirElevation 	 = null;
		this.executeStopEV	 = false;

		//target
		//............................................................................................		
		this.targetPosition = [this.targetDistance,this.initCoordY,0];
		this.targetCoord3d = this.pivot.getDirecctionVertex(0,this.firesAlcanzeMax);
		
		this.generateNoiseBalls(THREE);
		
									
	}//end function
	
	generateNoiseBalls(THREE){
		
		let noiseBallsRadiusInt = 50.0;
		let noiseBallsRadiusExt = 75.0;
		let noiseBallsCount = 16;
				
		//listFrontBalls
		//............................................................................................				
		let centerFrontBalls = [
			this.targetCoord3d[0],
			this.targetCoord3d[1],
			this.targetCoord3d[2]
		];

		let listCoordsFrontBalls1 = XF_Math3dCf.getCf3dAllVertex(
			0,
			centerFrontBalls,
			noiseBallsRadiusInt,
			noiseBallsCount,
			XF_Math3dCf.ROTATION_POSITIVE,0);
						
		let angleInc = (Math.PI / noiseBallsCount) / 2;
		let listCoordsFrontBalls2 = XF_Math3dCf.getCf3dAllVertex(
			0,
			centerFrontBalls,
			noiseBallsRadiusExt,
			noiseBallsCount,
			XF_Math3dCf.ROTATION_POSITIVE,angleInc);
		
			
		this.listCoordsFrontBalls = [];			
		let coordIndex = 0;
		for(let idx = 0;idx<listCoordsFrontBalls1.length;idx++){
			this.listCoordsFrontBalls[coordIndex]= listCoordsFrontBalls1[idx];
			coordIndex++;
		}
		
		for(let idx = 0;idx<listCoordsFrontBalls2.length;idx++){
			this.listCoordsFrontBalls[coordIndex]= listCoordsFrontBalls2[idx];
			coordIndex++;
		}
		
		this.listFrontBalls = [];
		for(let ballIndex = 0;ballIndex<this.listCoordsFrontBalls.length;ballIndex++){
			let geometry = new THREE.SphereGeometry( 10, 32, 16 ); 
			let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 			
			this.listFrontBalls[ballIndex]= new THREE.Mesh( geometry, material ); 
			this.listFrontBalls[ballIndex].position.x = this.listCoordsFrontBalls[ballIndex][0];
			this.listFrontBalls[ballIndex].position.y = this.listCoordsFrontBalls[ballIndex][1];
			this.listFrontBalls[ballIndex].position.z = this.listCoordsFrontBalls[ballIndex][2];			
			this.app.scene.add(this.listFrontBalls[ballIndex]);
		}
		
		//listBackBalls pivot position
		//............................................................................................
		let centerBackBalls = [
			this.pivot.position[0],
			this.pivot.position[1],
			this.pivot.position[2]
		];
		
		let listCoordsBackBalls1 = XF_Math3dCf.getCf3dAllVertex(
			0,
			centerBackBalls,
			noiseBallsRadiusInt,
			noiseBallsCount,
			XF_Math3dCf.ROTATION_POSITIVE,0);
						
		angleInc = (Math.PI / noiseBallsCount) / 2;
		let listCoordsBackBalls2 = XF_Math3dCf.getCf3dAllVertex(
			0,
			centerBackBalls,
			noiseBallsRadiusExt,
			noiseBallsCount,
			XF_Math3dCf.ROTATION_POSITIVE,angleInc);
		
			
		this.listCoordsBackBalls = [];			
		coordIndex = 0;
		for(let idx = 0;idx<listCoordsFrontBalls1.length;idx++){
			this.listCoordsBackBalls[coordIndex]= listCoordsBackBalls1[idx];
			coordIndex++;
		}
		
		for(let idx = 0;idx<listCoordsFrontBalls2.length;idx++){
			this.listCoordsBackBalls[coordIndex]= listCoordsBackBalls2[idx];
			coordIndex++;
		}
		
		this.listBackBalls = [];
		for(let ballIndex = 0;ballIndex<this.listCoordsBackBalls.length;ballIndex++){
			let geometry = new THREE.SphereGeometry( 10, 32, 16 ); 
			let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 			
			this.listBackBalls[ballIndex]= new THREE.Mesh( geometry, material ); 
			this.listBackBalls[ballIndex].position.x = this.listCoordsBackBalls[ballIndex][0];
			this.listBackBalls[ballIndex].position.y = this.listCoordsBackBalls[ballIndex][1];
			this.listBackBalls[ballIndex].position.z = this.listCoordsBackBalls[ballIndex][2];			
			this.app.scene.add(this.listBackBalls[ballIndex]);
		}		

	}//end function
				
	//intensity: 1 to 10
	executeRotationLeft(){ 
		
		//............................................................................................
		let execRotationY = this.incRotationY * (this.intensityRotationY/20);
		
		this.cameraRotationY += XF_Math.toRadians(execRotationY);
		if(this.cameraRotationY>(Math.PI*2)){
			this.cameraRotationY = Math.PI*2 - this.cameraRotationY;
		}
		
		this.rotate(1,XF_Math.toRadians(execRotationY));
		this.currentRotationY  += execRotationY;
		if(this.currentRotationY >360){
			this.currentRotationY = this.currentRotationY - 360;
		}
		this.webglObject.rotation.y = XF_Math.toRadians(this.currentRotationY);
		for(let idx=0;idx<this.webglObjectsLeft.length;idx++){
			this.webglObjectsLeft[idx].rotation.y = XF_Math.toRadians(this.currentRotationY);
		}
		for(let idx=0;idx<this.webglObjectsRight.length;idx++){
			this.webglObjectsRight[idx].rotation.y = XF_Math.toRadians(this.currentRotationY);
		}				
		//............................................................................................
				
		//............................................................................................
		this.targetPosition= this.pivot.getDirecctionVertex(0,this.targetDistance);
		this.targetCoord3d = this.pivot.getDirecctionVertex(0,this.firesAlcanzeMax);
		//............................................................................................
		
	}//end function		
	
	executeRotationRight(){
		
		//............................................................................................
		let execRotationY = this.incRotationY * (this.intensityRotationY/20);
		this.cameraRotationY -= XF_Math.toRadians(execRotationY);
		if(Math.abs(this.cameraRotationY)> (Math.PI * 2)){
			this.cameraRotationY = this.cameraRotationY  + (Math.PI * 2);
		}	
		
		this.rotate(1,XF_Math.toRadians(execRotationY*(-1) ));
		this.currentRotationY  -= execRotationY;
		if(Math.abs(this.currentRotationY) >360){
			this.currentRotationY = this.currentRotationY + 360;
		}
		this.webglObject.rotation.y = XF_Math.toRadians(this.currentRotationY);
		for(let idx=0;idx<this.webglObjectsLeft.length;idx++){
			this.webglObjectsLeft[idx].rotation.y = XF_Math.toRadians(this.currentRotationY);
		}
		for(let idx=0;idx<this.webglObjectsRight.length;idx++){
			this.webglObjectsRight[idx].rotation.y = XF_Math.toRadians(this.currentRotationY);
		}		
		//...........................................................................................
				
		//............................................................................................
		this.targetPosition= this.pivot.getDirecctionVertex(0,this.targetDistance);
		this.targetCoord3d = this.pivot.getDirecctionVertex(0,this.firesAlcanzeMax);
		//............................................................................................
		
	}//end function
	
	executeRotationZero(){
		this.targetPosition= this.pivot.getDirecctionVertex(0,this.targetDistance);
		this.targetCoord3d = this.pivot.getDirecctionVertex(0,this.firesAlcanzeMax);
		//this.webglObject.rotation.x = 0;
		this.webglObject.rotation.y = XF_Math.getAngleInc(this.cameraRotationY,(Math.PI / 2));			
		for(let idx=0;idx<this.webglObjectsLeft.length;idx++){
			this.webglObjectsLeft[idx].rotation.y = XF_Math.getAngleInc(this.cameraRotationY,(Math.PI / 2));
		}
		for(let idx=0;idx<this.webglObjectsRight.length;idx++){
			this.webglObjectsRight[idx].rotation.y = XF_Math.getAngleInc(this.cameraRotationY,(Math.PI / 2));;
		}
	}//end function	
	
	executeElevationUp(){	
		let incValueY 	= this.incElevationZ * this.velocity;
		let newValueY 	= this.pivot.position[1] + incValueY;
		let newPosition = [this.pivot.position[0],newValueY,this.pivot.position[2]]
		this.movePivot(newPosition);
			
		this.targetPosition= this.pivot.getDirecctionVertex(0,this.targetDistance);
		this.targetCoord3d = this.pivot.getDirecctionVertex(0,this.firesAlcanzeMax);
	}//end function	
	
	executeElevationDown(){
		let incValueY = this.incElevationZ * this.velocity;
		let newValueY = this.pivot.position[1] - incValueY;
		let newPosition = [this.pivot.position[0],newValueY,this.pivot.position[2]]
		this.movePivot(newPosition);
			
		this.targetPosition= this.pivot.getDirecctionVertex(0,this.targetDistance);
		this.targetCoord3d = this.pivot.getDirecctionVertex(0,this.firesAlcanzeMax);
	}//end function	
				
	executeElevationZero(){
		//console.log('executeElevationZero');
	}//end function	
					
	rotate(axisIndex,rotation_angle){	
		this.pivot.rotatePivot(axisIndex,rotation_angle);
		this.cameraPosition = this.pivot.getDirecctionVertexInverse(0,this.cameraDistance);
		
		switch(axisIndex){
			case 0:
				this.pivot.rotateVertex([rotation_angle,0.0,0.0],this.firePositionR);
				this.pivot.rotateVertex([rotation_angle,0.0,0.0],this.firePositionL);	
				break;
			case 1:
				this.pivot.rotateVertex([0.0,rotation_angle,0.0],this.firePositionR);
				this.pivot.rotateVertex([0.0,rotation_angle,0.0],this.firePositionL);
				break;
			case 2:
				this.pivot.rotateVertex([0.0,0.0,rotation_angle],this.firePositionR);
				this.pivot.rotateVertex([0.0,0.0,rotation_angle],this.firePositionL);
				break;								
		}//end switch
		
		
		if(this.listCoordsFrontBalls != null){
			if(axisIndex==0){
				for (let soonIdx=0;soonIdx<this.listCoordsFrontBalls.length;soonIdx++){
					this.pivot.rotateVertex([rotation_angle,0.0,0.0],this.listCoordsFrontBalls[soonIdx]);
				}				
			}
			if(axisIndex==1){
				for (let soonIdx=0;soonIdx<this.listCoordsFrontBalls.length;soonIdx++){
					this.pivot.rotateVertex([0.0,rotation_angle,0.0],this.listCoordsFrontBalls[soonIdx]);
				}				
			}
			if(axisIndex==2){
				for (let soonIdx=0;soonIdx<this.listCoordsFrontBalls.length;soonIdx++){
					this.pivot.rotateVertex([0.0,0.0,rotation_angle],this.listCoordsFrontBalls[soonIdx]);
				}				
			}	
				
			for(let ballIndex = 0;ballIndex<this.listCoordsFrontBalls.length;ballIndex++){
				WebGL_threeUtil.setWglObjectPosition(this.listFrontBalls[ballIndex],this.listCoordsFrontBalls[ballIndex]);			
			}
		}//end if
		
		
		if(this.listCoordsBackBalls != null){
			if(axisIndex==0){
				for (let soonIdx=0;soonIdx<this.listCoordsBackBalls.length;soonIdx++){
					this.pivot.rotateVertex([rotation_angle,0.0,0.0],this.listCoordsBackBalls[soonIdx]);
				}				
			}
			if(axisIndex==1){
				for (let soonIdx=0;soonIdx<this.listCoordsBackBalls.length;soonIdx++){
					this.pivot.rotateVertex([0.0,rotation_angle,0.0],this.listCoordsBackBalls[soonIdx]);
				}				
			}
			if(axisIndex==2){
				for (let soonIdx=0;soonIdx<this.listCoordsBackBalls.length;soonIdx++){
					this.pivot.rotateVertex([0.0,0.0,rotation_angle],this.listCoordsBackBalls[soonIdx]);
				}				
			}		
			for(let ballIndex = 0;ballIndex<this.listCoordsBackBalls.length;ballIndex++){
				WebGL_threeUtil.setWglObjectPosition(this.listBackBalls[ballIndex],this.listCoordsBackBalls[ballIndex]);			
			}					
		}//end if
		
					
	}//end function
			
	movePivot(newPosition) {

		let trans3d = XF_Math3dUtil.getTranslation3d(this.pivot.position,newPosition);
		this.pivot.movePivot(newPosition);	
		XF_Geolocator.translateVertex3d(this.firePositionR,trans3d);
		XF_Geolocator.translateVertex3d(this.firePositionL,trans3d);
			
		
		if(this.listCoordsFrontBalls != null){
			for (var soonIdx=0;soonIdx<this.listCoordsFrontBalls.length;soonIdx++){
				XF_Geolocator.translateVertex3d(this.listCoordsFrontBalls[soonIdx],trans3d )
			}
			for(let ballIndex = 0;ballIndex<this.listFrontBalls.length;ballIndex++){
				WebGL_threeUtil.setWglObjectPosition(this.listFrontBalls[ballIndex],this.listCoordsFrontBalls[ballIndex]);	
			}
		}
		
		
		if(this.listCoordsBackBalls != null){
			for (var soonIdx=0;soonIdx<this.listCoordsBackBalls.length;soonIdx++){
				XF_Geolocator.translateVertex3d(this.listCoordsBackBalls[soonIdx],trans3d )
			}
			for(let ballIndex = 0;ballIndex<this.listBackBalls.length;ballIndex++){
				WebGL_threeUtil.setWglObjectPosition(this.listBackBalls[ballIndex],this.listCoordsBackBalls[ballIndex]);	
			}			
		}	
		
		
	}//end function
	

	dinamic(){

		//action: rotation horizontal plane Y	
		//.................................................................................
		if(this.activeRotationY){			
			if(!this.executeStopHR){
				if(this.dirRotationY== 'left'){this.executeRotationLeft();}
				else 						  {this.executeRotationRight();}				
			}
			else {
				this.activeRotationY = false;
				this.executeStopHR= false;
				this.executeRotationZero();
			}
		}
		else {
			this.targetPosition= this.pivot.getDirecctionVertex(0,this.targetDistance);
			this.targetCoord3d = this.pivot.getDirecctionVertex(0,this.firesAlcanzeMax);
		}
		
		//action: elevation
		//.................................................................................
		if(this.activeElevation){	
			if(!this.executeStopEV){
				if(this.dirElevation== 'up'){this.executeElevationUp();}
				else						{this.executeElevationDown();}	
			}
			else {
				this.dirElevation = null;
				this.activeElevation = false;
				this.executeStopEV = false;
				this.executeElevationZero();
			}	
		}
		
		//update scene object charged
		//..........................................................................................
		let newObjectChargedId = this.getNewChargedObject();				

		if(this.objectChargedId!=newObjectChargedId){
			
			//remove old object from scene
			switch(this.objectChargedId){
				case 'rotationZero':	this.app.scene.remove(this.webglObject);break;
				case 'rotationLeft15':	this.app.scene.remove(this.webglObjectsLeft[0]);break;					
				case 'rotationLeft30':	this.app.scene.remove(this.webglObjectsLeft[1]);break;					
				case 'rotationLeft45':	this.app.scene.remove(this.webglObjectsLeft[2]);break;
				case 'rotationRight15':	this.app.scene.remove(this.webglObjectsRight[0]);break;						
				case 'rotationRight30':	this.app.scene.remove(this.webglObjectsRight[1]);break;						
				case 'rotationRight45':	this.app.scene.remove(this.webglObjectsRight[2]);break;										
			}//end switch
			
			//add new object to scene
			switch(newObjectChargedId){
				case 'rotationZero':	this.app.scene.add(this.webglObject);break;
				case 'rotationLeft15':	this.app.scene.add(this.webglObjectsLeft[0]);break;
				case 'rotationLeft30':	this.app.scene.add(this.webglObjectsLeft[1]);break;
				case 'rotationLeft45':	this.app.scene.add(this.webglObjectsLeft[2]);break;
				case 'rotationRight15':	this.app.scene.add(this.webglObjectsRight[0]);break;	
				case 'rotationRight30':	this.app.scene.add(this.webglObjectsRight[1]);break;
				case 'rotationRight45':	this.app.scene.add(this.webglObjectsRight[2]);break;				
			}//end switch
			
			this.objectChargedId = newObjectChargedId;
				
		}//end if
	
		//action: move pivot, ref vertex and scene objects
		//.................................................................................
		let translationDistance = this.velocity * 1;
		let newPosition = this.pivot.getDirecctionVertex(0, translationDistance);	
		
		this.updateObjectsPositions(newPosition);						
		this.movePivot(newPosition);
		
		//refresh camera position	
		//.................................................................................		
		this.cameraPosition = this.pivot.getDirecctionVertexInverse(0,this.cameraDistance);
	}//end function
	
	
	getNewChargedObject(){
		
		let newObjectChargedId = this.objectChargedId;
				
		if(this.activeRotationY){
			if(this.objectChargedId == 'rotationZero'){
				if(this.dirRotationY== 'left'){
					if(this.percentRotationY<=33.3){
						newObjectChargedId = 'rotationLeft15';
					}
					else {
						if(this.percentRotationY<=66.6){
							newObjectChargedId = 'rotationLeft30';
						}
						else {
							newObjectChargedId = 'rotationLeft45';
						}						
					}							
				}
				else {
					if(this.percentRotationY<=33.3){
						newObjectChargedId = 'rotationRight15';
					}
					else {
						if(this.percentRotationY<=66.6){
							newObjectChargedId = 'rotationRight30';
						}
						else {
							newObjectChargedId = 'rotationRight45';
						}						
					}					
				}
			}
			else {
				if(this.dirRotationY== 'left'){
					if(this.percentRotationY<=33.3){
						newObjectChargedId = 'rotationLeft15';
					}
					else {
						if(this.percentRotationY<=66.6){
							newObjectChargedId = 'rotationLeft30';
						}
						else {
							newObjectChargedId = 'rotationLeft45';
						}						
					}					
				}
				else {
					if(this.percentRotationY<=33.3){
						newObjectChargedId = 'rotationRight15';
					}
					else {
						if(this.percentRotationY<=66.6){
							newObjectChargedId = 'rotationRight30';
						}
						else {
							newObjectChargedId = 'rotationRight45';
						}						
					}						
				}
			}
		}
		else {
			if(this.objectChargedId != 'rotationZero'){
				newObjectChargedId = 'rotationZero';
			}
		}
	
		return newObjectChargedId;
		
	}//end function
	
	updateObjectsPositions(newPosition){
		
		switch(this.objectChargedId){
			case 'rotationZero':
				WebGL_threeUtil.setWglObjectPosition(this.webglObject,newPosition);	
				break;
			case 'rotationLeft15':
				WebGL_threeUtil.setWglObjectPosition(this.webglObjectsLeft[0],newPosition);	
				break;
			case 'rotationLeft30':
				WebGL_threeUtil.setWglObjectPosition(this.webglObjectsLeft[1],newPosition);				
				break;								
			case 'rotationLeft45':
				WebGL_threeUtil.setWglObjectPosition(this.webglObjectsLeft[2],newPosition);
				break;				
			case 'rotationRight15':
				WebGL_threeUtil.setWglObjectPosition(this.webglObjectsRight[0],newPosition);
				break;				
			case 'rotationRight30':
				WebGL_threeUtil.setWglObjectPosition(this.webglObjectsRight[1],newPosition);		
				break;				
			case 'rotationRight45':
				WebGL_threeUtil.setWglObjectPosition(this.webglObjectsRight[2],newPosition);
				break;										
		}//end switch
				
	}//end function
			
}//end class