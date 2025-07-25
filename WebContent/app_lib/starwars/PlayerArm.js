/**
 * class GamePlayerArm
 */
 class PlayerArm {        
    
	constructor(app) {
		this.app = app;
		this.configure();
	}//end constructor
	
	configure(){
		this.gunsDistX 			= 6;
		this.gunsDistZ 			= 4;
		this.targetAlcanzeMax 	= 500;
		this.targetCoord3d= [0,0,0];
		this.firePositionR  = [0,0,0];
		this.firePositionL  = [0,0,0];		
		this.fireRotationR  = [0,0,0];
		this.fireRotationL  = [0,0,0];				
		this.listBulletsR = [];
		this.listBulletsL = [];
		this.firesVelocity 	= 16;
		this.nextWeaponActive = 'right';
		
		this.bulletModelA = new WebGL_object(
			null,
			"bullet.fbx",
			[1.0,0,0,1],
			[0, 0, 0],1,1,
			"data/bullets/",
			null,null,null
		);
		
	}//end function
	
	init(THREE,scene,fbxLoader,txtLoader){
		//this.target = new WebGL_dto(this,'data/game/player/arm/','target');
		//this.target.loadWglObject(THREE,scene,fbxLoader,txtLoader,null);	
		this.sight = new WebGL_dto(this,'data/game/player/arm/','sight');
		this.sight.loadWglObject(THREE,scene,fbxLoader,txtLoader);				
	}//end function
	
		
	alertAllDtosCharged(id){
		switch (id) {
			case 'target':				
				this.target.dto.name = 'target';
				this.target.dto.position.x = 500;
				this.target.dto.position.z = -500;
				break;
			
			case 'sight':			
				this.sight.dto.name = 'sight';
				this.sight.dto.scale.set(0.3,0.3,0.3);
				break;					
		}
	}//end function
		
	dinamic(THREE,wglCamera,shipVelocity){		
		
		// targetCoord3d, sight, target
		//.......................................................................................
		this.targetCoord3d = WebGL_threeUtil.getCameraView3dCoords(THREE,wglCamera,this.targetAlcanzeMax);	
		if(this.sight.dto!=null){
			WebGL_threeUtil.setObjectStateToCameraView(THREE,wglCamera,this.sight.dto,2);
		}
		/*
		if(this.target.dto!=null){					
			WebGL_threeUtil.setObjectStateToCameraView(THREE,wglCamera,this.target.dto,this.targetAlcanzeMax);		
		}*/
		
		//fire Positions					
		//.......................................................................................	
		let cameraCalc = wglCamera.clone();							
		cameraCalc.translateX(this.gunsDistX);
		cameraCalc.translateZ(this.gunsDistZ *(-1));											
		this.firePositionR = WebGL_threeUtil.getCameraView3dCoords(THREE,cameraCalc,null);						
		this.fireRotationR = WebGL_threeUtil.getVector3Coords(cameraCalc.rotation);
		cameraCalc.translateZ(this.gunsDistZ );	
		cameraCalc.translateX(this.gunsDistX*(-1));
		
		cameraCalc.translateX(this.gunsDistX*(-1));
		cameraCalc.translateZ(this.gunsDistZ *(-1));	
		this.firePositionL = WebGL_threeUtil.getCameraView3dCoords(THREE,cameraCalc,null);
		this.fireRotationL = WebGL_threeUtil.getVector3Coords(cameraCalc.rotation);			
		cameraCalc.translateZ(this.gunsDistZ );																				
		cameraCalc.translateX(this.gunsDistX);				
		

		//bullets											
		//...........................................................................................
		//this.firesVelocity = 10 + (shipVelocity-5);
		if(this.listBulletsR.length>0){
			for(let bulletIndex=0;bulletIndex<this.listBulletsR.length;bulletIndex++){
				this.listBulletsR[bulletIndex].dinamic();	
			}		
		}
		if(this.listBulletsL.length>0){
			for(let bulletIndex=0;bulletIndex<this.listBulletsL.length;bulletIndex++){
				this.listBulletsL[bulletIndex].dinamic();							
			}		
		}

	}//end function
	
	onLiveBullet(THREE,bullet){
			
		let raycasterVector = bullet.direction; 			
		let raycaster = new THREE.Raycaster(bullet.wglObject.sceneObj.position,raycasterVector,0,this.targetAlcanzeMax);										
		let intersects = raycaster.intersectObjects(this.app.gameScene.targets);
						
		let existIntersect = false;
		let intersectObjectId = null;
		let intersectPoint = null;
		for (let i=0;i< intersects.length;i++) {			
			existIntersect = true;	
			intersectObjectId = intersects[i].object.id; 
			intersectPoint = intersects[i].point;
			break;			
		}
		
		let continueLive = true;
		if(existIntersect){
			//console.log(intersectObjectId);
			continueLive = false;
			let contactCoords = [intersectPoint.x,intersectPoint.y,intersectPoint.z];
			this.app.onFireContact(intersectObjectId,contactCoords);
		}			
		return continueLive;
	}//end function
	
	executeFire(){
		if(this.nextWeaponActive =='right'){
			let bullet = new ArmBullet(this,'right',this.firePositionR,this.targetCoord3d,this.fireRotationR,this.bulletModelA,this.firesVelocity);
			this.listBulletsR.push(bullet);
			this.nextWeaponActive = 'left';
		}
		else {			
			let bullet = new ArmBullet(this,'left',this.firePositionL,this.targetCoord3d,this.fireRotationL,this.bulletModelA,this.firesVelocity);
			this.listBulletsL.push(bullet);		
			this.nextWeaponActive = 'right';	
		}
	}//end function
	
	removeBullet(gunId){
		if(gunId =='right'){
			this.listBulletsR.shift();
		}
		if(gunId =='left'){
			this.listBulletsL.shift();
		}		
	}//end function
	
}//end class	










