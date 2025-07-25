
/**
 * class DoomPlayer(app,wglPlayer)
 */
class DoomPlayer {        
       
          
	//constructor	
	constructor(app,morphDtos) {	
		this.app = app;
		this.morphDtos = morphDtos; //this.morphDtos[this.walkActiveIndex]
		
		//this.wglPlayer = wglPlayer;
		this.postconstructor(this.app.app_THREE);		
		this.init();
	}//end constructor
	
	postconstructor(THREE){
		this.boundRadius = 0.5;
		this.boundsCenterY = 0.1;		
		this.velocity = DoomPlayerConfig.WALK_VELOCITY;
		this.targetDistance  = 10;
		this.viewDistY = 1.5;
		this.cameraDistanceNormal = 2.5; //1.5
		this.frontSphere = WebGL_threeGenObjects
			.createObjectSphereColor(THREE,0.1,16,new THREE.Color("rgb(0,255,0)"),[0,0,0]);
			
		this.targetSphere = WebGL_threeGenObjects
			.createObjectSphereColor(THREE,0.1,16,new THREE.Color("rgb(255,0,0)"),[this.targetDistance,this.viewDistY,0]);
					
		this.app.scene.add(this.frontSphere);			
		this.app.scene.add(this.targetSphere);
							
		this.boundsSpheres = [];	
			
		for(let idx=0;idx<8;idx++){
			this.boundsSpheres[idx] = WebGL_threeGenObjects
				.createObjectSphereColor(THREE,0.1,16,new THREE.Color("rgb(255,0,255)"),[0,0,0]);
				this.app.scene.add(this.boundsSpheres[idx]);	
		}				
		/*
			this.boundsSpheres[0] = WebGL_threeGenObjects
				.createObjectSphereColor(THREE,0.1,16,new THREE.Color("rgb(0,0,255)"),[0,0,0]);
				this.app.scene.add(this.boundsSpheres[0]);		
			this.boundsSpheres[1] = WebGL_threeGenObjects
				.createObjectSphereColor(THREE,0.1,16,new THREE.Color("rgb(255,255,0)"),[0,0,0]);
				this.app.scene.add(this.boundsSpheres[1]);	
			this.boundsSpheres[2] = WebGL_threeGenObjects
				.createObjectSphereColor(THREE,0.1,16,new THREE.Color("rgb(0,255,0)"),[0,0,0]);
				this.app.scene.add(this.boundsSpheres[2]);	
			this.boundsSpheres[3] = WebGL_threeGenObjects
				.createObjectSphereColor(THREE,0.1,16,new THREE.Color("rgb(0,255,0)"),[0,0,0]);
				this.app.scene.add(this.boundsSpheres[3]);		
		*/														
		/*
		this.mirillaMap =this.app.txtLoader.load('doom/player/icongameplay.png');
		let mirillaMaterial = new THREE.SpriteMaterial( { map: this.mirillaMap} );
		mirillaMaterial.depthWrite=false;
		mirillaMaterial.needsUpdate = true
		//mirillaMaterial.transparent =true;
		this.mirilla = new THREE.Sprite( mirillaMaterial );			
		this.mirilla.scale.x = 0.6;
		this.mirilla.scale.y = 0.6;
		this.mirilla.scale.z = 0.6;		
		this.app.scene.add( this.mirilla );
		*/	
	}//end function
	
	init(){		
		this.turnValue = XF_Math.toRadians(1);		
		this.pitchValue = XF_Math.toRadians(0.2);
		
		this.moveForward  = false;	
		this.moveBackward = false;	
		this.moveLeft 	= false;
		this.moveRight 	= false;					
		this.turnLeft	= false;
		this.turnRight 	= false;
		this.pitchUp 	= false;
		this.pitchDown  = false;
		
		this.position = [0.0,0.0,0.0];
		this.rotationY = 0;		
		this.rotationZ = 0;	
		this.frontDistance = 4;
		this.frontPosition = [this.frontDistance,0.0,0.0];		
		this.targetCoords = [this.targetDistance,this.viewDistY,0.0];
		
		this.state = "static";
		this.walkActiveIndex = 0;
		this.walkFrameIndex = 0;
		
		this.updateBounds();
		this.updateViewObjects();
		this.updateCamera();
	}//end function
	
	dinamic(){
		
		//...........................................................................................
		if(this.turnRight){
			this.rotationY = XF_Math.getAngleDec(this.rotationY,this.turnValue);	
			if(this.rotationY<0){
				this.rotationY = (Math.PI * 2) + this.rotationY;
			}	
		}
		if(this.turnLeft){
			this.rotationY = XF_Math.getAngleInc(this.rotationY,this.turnValue);
		}
		//...........................................................................................
		
		
		//...........................................................................................				
		let potencialPosition = null;
		if(this.moveForward || this.moveBackward){
			potencialPosition = this.calculateNextPositionFB
				(this.position,this.rotationY,this.velocity,this.moveForward);				
			this.position = potencialPosition;	
		}	
		/*
		if(this.moveRight || this.moveLeft){
			potencialPosition = this.calculateNextPositionLR(this.position,this.rotationY,this.velocity,this.moveRight);
			this.position = potencialPosition;	
		}
		*/
		if(this.app.controlScene!=null){
			this.app.controlScene.processElementsCollisions(this.app.app_THREE,this);
		}
		
		//...........................................................................................
		
		//...........................................................................................;
		if(this.state == "walking"){
			if(this.walkFrameIndex ==0){
								
				if(this.moveForward){
					this.walkActiveIndex++;
					if(this.walkActiveIndex==DoomPlayerConfig.WALK_COUNTFRAMES){
						this.walkActiveIndex=1;
					}
				}
				else {
					this.walkActiveIndex--;
					if(this.walkActiveIndex==0){
						this.walkActiveIndex= DoomPlayerConfig.WALK_COUNTFRAMES;
					}	
				}
			}
			this.walkFrameIndex++;
			if(this.walkFrameIndex==10){
				this.walkFrameIndex = 0;
			}
		}//end if 
		//...........................................................................................
			
		//...........................................................................................
		if(this.pitchUp || this.pitchDown){
			let angleCalc = null;
			if(this.pitchUp){
				angleCalc = null;
				angleCalc = XF_Math.getAngleInc(this.rotationZ,this.pitchValue);
			}
			else {
				angleCalc = XF_Math.getAngleDec(this.rotationZ,this.pitchValue);	
				if(angleCalc<0){
					angleCalc = (Math.PI * 2) + angleCalc;
				}	
			}
			this.rotationZ = angleCalc;
		}
		//...........................................................................................		
		
		//...........................................................................................		
		this.updateBounds();		
		this.updateWglPlayer();
		this.updateViewObjects();
		this.updateCamera();
		this.updateSceneCamera();
		this.updateTarget(this.app.app_THREE);
		//...........................................................................................																
	}//end function
		
	calculateNextPositionLR(position,rotPlaneY,velocity,moveRight){
		let distance = velocity;
		let nextPosition = null;
		let rotAngleCalc = null;
		if(moveRight){
			rotAngleCalc = XF_Math.getAngleDec(rotPlaneY,(Math.PI/2));			
			if(rotAngleCalc<0){
				rotAngleCalc = (Math.PI * 2) + rotAngleCalc;
			}						
		}
		else{
			rotAngleCalc = XF_Math.getAngleInc(rotPlaneY,(Math.PI/2));
		}
		nextPosition = XF_Math3dCf.getCf3dOneVertex(1,position,distance,rotAngleCalc);	
		
		return nextPosition;
	}//end function
	
	calculateNextPositionFB(position,rotPlaneY,velocity,moveForward){
		let distance = velocity;
		let nextPosition = null;
		if(moveForward){
			nextPosition = XF_Math3dCf.getCf3dOneVertex(1,position,distance,rotPlaneY);		
		}
		else{
			let rotAngleCalc = XF_Math.getAngleInc(rotPlaneY,Math.PI);
			nextPosition = XF_Math3dCf.getCf3dOneVertex(1,position,distance,rotAngleCalc);		
		}	
		let coordY = this.app.controlScene.getFloorHeightAtPosition3d(this.app.app_THREE,nextPosition);
		nextPosition[1] = coordY;		
		return nextPosition;
	}//end function
			
	updateWglPlayer(){
		
		for(let idx=0;idx<this.morphDtos.length;idx++){
			if(this.morphDtos[idx].visible){
				if(idx!=this.walkActiveIndex){
					this.morphDtos[idx].visible = false;
				}
			}
			else {
				if(idx==this.walkActiveIndex){
					this.morphDtos[idx].visible = true;
				}
			}
		}
		this.morphDtos[this.walkActiveIndex].position.x = this.position[0];
		this.morphDtos[this.walkActiveIndex].position.y = this.position[1]//;this.viewDistY
		this.morphDtos[this.walkActiveIndex].position.z = this.position[2];

		this.morphDtos[this.walkActiveIndex].rotation.x = 0;
		this.morphDtos[this.walkActiveIndex].rotation.z = 0;				
		this.morphDtos[this.walkActiveIndex].rotation.y = 0;	
			
		this.morphDtos[this.walkActiveIndex].rotateY(this.rotationY);			
		this.morphDtos[this.walkActiveIndex].rotateZ(this.rotationZ);	
	}//end function
		
	updateViewObjects(){		
		this.frontPosition = XF_Math3dCf.getCf3dOneVertex(1,this.position,this.frontDistance,this.rotationY);		
		this.frontSphere.position.x = this.frontPosition[0];
		this.frontSphere.position.y = this.frontPosition[1];
		this.frontSphere.position.z = this.frontPosition[2];								
	}//end function
	
	updateTarget(THREE){
		
		let wglCamera = this.app.camera.clone();
		let cameraVector = new THREE.Vector3(); 	
		wglCamera.getWorldDirection(cameraVector);
		cameraVector.multiplyScalar(this.targetDistance);
		
		this.targetCoords[0] = wglCamera.position.x+ cameraVector.x;
		this.targetCoords[1] = wglCamera.position.y+ cameraVector.y;
		this.targetCoords[2] = wglCamera.position.z+ cameraVector.z;
		
		this.targetSphere.position.x = this.targetCoords[0];
		this.targetSphere.position.y = this.targetCoords[1];
		this.targetSphere.position.z = this.targetCoords[2];
				
		//this.mirilla.position.x = this.targetCoords[0];
		//this.mirilla.position.y = this.targetCoords[1];
		//this.mirilla.position.z = this.targetCoords[2];
				
	}//end function	

	updateCamera(){						
		let centerCalc = [this.position[0],this.position[1]+this.viewDistY,this.position[2]];
		let angleCalcY 	 = XF_Math.getAngleInc(this.rotationY,Math.PI);						
		let cameraCoords = XF_Math3dCf.getCf3dOneVertex(1,centerCalc,this.cameraDistanceNormal,angleCalcY);	
		let cameraAngleY = XF_Math.getAngleInc(XF_Math.RADIANS_270,this.rotationY);
				
		this.app.camera.position.x = cameraCoords[0];	
		this.app.camera.position.y = cameraCoords[1];
		this.app.camera.position.z = cameraCoords[2];
				
		this.app.camera.rotation.x = 0;
		this.app.camera.rotation.z = 0;
		this.app.camera.rotation.y = cameraAngleY;		
		this.app.camera.rotateX(this.rotationZ);		
	}//end function
	
	updateSceneCamera(){
		let centerCalc = [this.position[0],this.position[1]+this.viewDistY,this.position[2]];
		let angleInc = XF_Math.toRadians(16);
		let angleCalcY 	 = XF_Math.getAngleInc(this.rotationY,Math.PI);			
		angleCalcY = XF_Math.getAngleInc(angleCalcY,angleInc);
		
		let cameraCoords = XF_Math3dCf.getCf3dOneVertex(1,centerCalc,this.cameraDistanceNormal,angleCalcY);	
				
		this.app.sceneCamera.position.x = cameraCoords[0];
		this.app.sceneCamera.position.y = cameraCoords[1];
		this.app.sceneCamera.position.z = cameraCoords[2];
	
		//console.log(this.app.sceneCamera.position.y);
		this.app.sceneCamera.rotation.x = this.app.camera.rotation.x;
		this.app.sceneCamera.rotation.y = this.app.camera.rotation.y;
		this.app.sceneCamera.rotation.z = this.app.camera.rotation.z;	
			
	}//end function
	
	updateBounds(){
		//this.position,this.boundsCenterY ,this.boundRadius,this.rotationY
		
		let pivot = [this.position[0],this.position[1]+this.boundsCenterY,this.position[2]];
		this.boundsCoords =XF_Math3dCf.getCf3dAllVertex(1,pivot,this.boundRadius,8,1,this.rotationY);
		
		for(let idx=0;idx<8;idx++){
			this.boundsSpheres[idx].position.x = this.boundsCoords[idx][0];
			this.boundsSpheres[idx].position.y = this.boundsCoords[idx][1];
			this.boundsSpheres[idx].position.z = this.boundsCoords[idx][2];
		}
				
	}//end function		
	//game pad commands
	//..................................................................................................	
	moveZeroFB(){
		this.moveForward  = false;
		this.moveBackward = false
		this.walkActiveIndex = 0;
		if(this.state == "walking"){
			this.state = "static";
		}
		this.walkFrameIndex = 0;
	}//end function
		
	moveFront(){
		if(this.state == "static"){
			this.state = "walking";
		}		
		this.velocity = DoomPlayerConfig.WALK_VELOCITY;
		this.walkActiveIndex = 0;
		this.walkFrameIndex = 0;
		this.moveForward = true;	
		this.moveBackward = false;				
	}//end function
	
	moveBack(){
		if(this.state == "static"){
			this.state = "walking";
		}		
		this.velocity = DoomPlayerConfig.WALK_VELOCITY;
		this.walkActiveIndex = DoomPlayerConfig.WALK_COUNTFRAMES + 1;//elem 21
		this.walkFrameIndex = 0;
		this.moveBackward = true;	
		this.moveForward = false;			
	}//end function	
	
	moveZeroLR(){
		this.moveLeft  = false;
		this.moveRight = false
	}//end function
		
	moveIzquierda(){
		this.moveLeft = true;
		this.moveRight = false;	
	}//end function
		
	moveDerecha(){
		this.moveRight = true;		
		this.moveLeft = false;		
	}//end function
			
	viewUp(){
		this.pitchUp = true;
		this.pitchDown = false;	
	}//end function
			
	viewDown(){
		this.pitchDown = true;	
		this.pitchUp = false;	
	}//end function
		
	viewZero(){
		this.pitchUp = false;
		this.pitchDown = false;		
	}//end function
					
	girarIzquierda(){
		this.turnLeft = true;
		this.turnRight = false;
	}//end function
	
	girarDerecha(){
		this.turnRight = true;
		this.turnLeft  = false;		
	}//end function	
				
	girarZero(){
		this.turnLeft  = false;
		this.turnRight = false;
	}//end function	
	
}//end class class