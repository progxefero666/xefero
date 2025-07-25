/**
 *  class EnemyShips 
 */
 class  EnemyShips {        
	
	static ES_TIEFIGTER_ID = 'tie';
	static ES_IMPDESTROYERONE_ID = 'impdestroyer';
	
	static ES_TIEFIGTER_PATH = 'data/game/ship/tie/';
	static ES_IMPDESTROYERONE_PATH = 'data/game/ship/impdestroyer/';
		
	//constructor	
	constructor() {};//end constructor
	
} //end class


/**
 *  class EnemyShips 
 */
 class  EnemyShip {        

	static ES_TIEFIGTER = 'tie';
	static ES_IMPDESTROYERONE = 'impdestroyer';
	
	//constructor	
	constructor(modelReference,name,position) {
		this.modelReference = modelReference;
		this.name 			= name;
		this.position 		= position;
	};//end constructor

	generate(THREE,scene,fbxLoader,txtLoader){
		this.charged = false;
		
		let modelFilePath = null;
		switch(this.modelReference){
			case EnemyShips.ES_TIEFIGTER_ID:
				modelFilePath = EnemyShips.ES_TIEFIGTER_PATH;
				break;
			case EnemyShips.ES_IMPDESTROYERONE_ID:
				modelFilePath = EnemyShips.ES_IMPDESTROYERONE_PATH;
				break;				
		}//end switch		
		this.model = new WebGL_groupdtos(this,modelFilePath,this.modelReference,this.name);
		this.model.loadWglObjects(THREE,scene,fbxLoader,txtLoader,this.position);
							
		this.boundRadius = this.model.boundRadius;	
		
		this.generateRing(THREE,scene);
		
	}//end function

	generateRing(THREE,scene){
		/*
		if(this.boundRadius!=null){													
			let ringRadioInt = this.boundRadius + 1;
			let ringRadioExt = ringRadioInt + 1; // 0.05;
			let ringGeometry = new THREE.RingGeometry(ringRadioInt,ringRadioExt,4); 
			ringGeometry.rotateZ(Math.PI/4);
			let ringMaterial = new THREE.MeshBasicMaterial({color:0xffff00,side: THREE.DoubleSide});
			this.ring = new THREE.Mesh( ringGeometry, ringMaterial );	
			scene.add(this.ring);				
		}
		*/
		//else{console.log('modelboundRadius null');}		
	}//end function
	
	alertAllDtosCharged(id){
		this.grdto 	 = this.model.grdto;
		this.charged = true;
	}//end function		
	
	dinamic(wglCamera){
		/*	
		if(this.ring!=null){
			this.ring.position.x = this.grdto.position.x;	
			this.ring.position.y = this.grdto.position.y;	
			this.ring.position.z = this.grdto.position.z;				
			this.ring.lookAt(wglCamera.position);	
			this.ring.rotation.z = wglCamera.rotation.z;			
		}
		*/
	}//end function

} //end class

/**
 *  class EnemyShipDinamic
 */
 class  EnemyShipDinamic {
	 
	//constructor	
	constructor(app,gameScene,dto,velocity,positionInit) {
		this.app = app;
		this.gameScene		= gameScene;
		this.dto			= dto;		
		this.velocity		= velocity;	
		this.positionInit 	= positionInit;
		this.configure();
	
	}//end constructor
	
	configure(){
		this.targetAlcanzeMax 	= 1000;
		this.firesDistToPivot = 3.0;
		this.firesAngleToPivot = XF_Math.RADIAN * 10;		
		this.rollValueMax = 45;
		this.distLinealMin = 400;
		this.distLinealMax =1000; //this.gameScene.radiusMax;
		this.distCurveMin = 100;
		this.distCurveMax = 800;
		this.minCurvePercCountPoints = 60;
		this.maxCurvePercCountPoints = 90;
		
		this.listBulletsR = [];
		this.listBulletsL = [];
		this.firesVelocity 	= 20;		
		this.nextWeaponActive = 'right';
		this.currentStepIndex = 0;

		this.bulletModelA = new WebGL_object(
			null,
			"bullet.fbx",
			[1.0,0,0,1],
			[0, 0, 0],1,1,
			"data/bullets/",
			null,null,null
		);			
	}//end function
	
	/*
	init(THREE,scene){
		let material_R = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		let geometry_R = new THREE.SphereGeometry(2,16,16);
		this.sphereR = new THREE.Mesh( geometry_R, material_R );
		scene.add(this.sphereR);		
	
		let material_L = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
		let geometry_L = new THREE.SphereGeometry(2,16,16);		
		this.sphereL = new THREE.Mesh( geometry_L, material_L ); 
		scene.add(this.sphereL);

		let material_T = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		let geometry_T = new THREE.SphereGeometry(2,16,16);
		this.sphereT = new THREE.Mesh( geometry_T, material_T ); 	
		scene.add(this.sphereT);
	}//end function		
	*/
	
	restart(){	
		let positionCalc = [0,0,0];
		if(this.positionInit!=null){
			positionCalc = this.positionInit;
		}
		else {
			positionCalc =  WebGL_sceneUtil.getAleatoryCoord3dInSceneY(this.gameScene);
		}
		
		let targetCoord 	= WebGL_sceneUtil.getAleatoryCoord3dInSceneY(this.gameScene);
		
		let targetDistance 	= 0;
		let targetCorrect = false;
		while(!targetCorrect){
			 targetCoord = WebGL_sceneUtil.getAleatoryCoord3dInSceneY(this.gameScene);
			 targetDistance = Math.floor(XF_Math3dUtil.getDistance3d(positionCalc,targetCoord));
			 if(targetDistance<500){
				 targetCorrect = true;
			 }
		}
		let rutePoints		= XF_Math3dUtil.getLineVertex(positionCalc,targetCoord,targetDistance);
		
		//console.log(rutePoints.length);
		this.currentRute 	= new XfRutePlaneY(rutePoints);
		this.currentStepIndex = 0;
		this.currentRuteType = 'line';
		this.currentRotationState = 'turnCero';
		this.currentRotationRadius = 0;
		
		this.position = this.currentRute.points[this.currentStepIndex];
		this.rotationY  = this.currentRute.rotationsY[this.currentStepIndex];
		this.updateWglState();
	
	}//end function
	
	dinamic(){				
		
		this.currentStepIndex+=this.velocity;
		
		//console.log(this.currentStepIndex);
		
		if(this.currentStepIndex >= (this.currentRute.points.length-1) ){	
			this.currentStepIndex = 0;
			this.onRouteEnd();			
		}
		else {
			if(this.currentRute.points.length > 0){
				let isCurrenPositionIntoScene = this.gameScene.isIntoScene(this.currentRute.points[this.currentStepIndex]);
				if(isCurrenPositionIntoScene){
					this.position = this.currentRute.points[this.currentStepIndex];
					this.rotationY  = this.currentRute.rotationsY[this.currentStepIndex];	
					
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
					this.updateWglState();			
				}
				else {
					this.restart();
				}				
			}

		}
		
	}//end function
		
	updateWglState(){
		
		
		//..........................................................................
		// wglobject state
		//..........................................................................
		this.dto.position.x = this.position[0];
		this.dto.position.y = this.position[1];
		this.dto.position.z = this.position[2];
		this.dto.rotation.x = 0;	
		this.dto.rotation.y = 0;		
		this.dto.rotation.z = 0;	
		this.dto.rotateY(this.rotationY);
		//..........................................................................
		
		//..........................................................................
		// target Coord3d
		//..........................................................................
		this.targetCoord3d= XF_Math3dCf.getCf3dOneVertex(1,this.position,this.targetAlcanzeMax,this.rotationY);		
		//let directionLine = new XfLineDirection(this.position,directionCoord);			
		//..........................................................................		
		//this.sphereT.position.y = 0;	
		//this.sphereT.position.x = this.targetCoord3d[0];
		//this.sphereT.position.z = this.targetCoord3d[2];	
		//..........................................................................
			
		//..........................................................................
		// guns coord3d
		//..........................................................................
		let angleDec = XF_Math.getAngleDec(this.rotationY,this.firesAngleToPivot);
		let angleInc = XF_Math.getAngleInc(this.rotationY,this.firesAngleToPivot);
		this.firePositionR = XF_Math3dCf.getCf3dOneVertex(1,this.position,this.firesDistToPivot,angleDec);
		this.firePositionL = XF_Math3dCf.getCf3dOneVertex(1,this.position,this.firesDistToPivot,angleInc);
		//..........................................................................
		//let sphereR_coord = XF_Math3dCf.getCf3dOneVertex(1,this.position,this.firesDistToPivot,angleDec);
		//let sphereL_coord = XF_Math3dCf.getCf3dOneVertex(1,this.position,this.firesDistToPivot,angleInc);						
		//this.sphereR.position.x = sphereR_coord[0];
		//this.sphereR.position.z = sphereR_coord[2];
		//this.sphereL.position.x = sphereL_coord[0];
		//this.sphereL.position.z = sphereL_coord[2];
		//..........................................................................
								
		// rotateX
		//..........................................................................
		/*
		if(this.currentRuteType!='line'){			
			let rollDegrees = this.getRollValue();		
			if(this.currentRotationState=='turnRight'){
				this.dto.rotateX(XF_Math.RADIAN * rollDegrees );
			}
			else {
				this.dto.rotateX(XF_Math.RADIAN * rollDegrees * (-1));
			}				
		}
		*/
		//..........................................................................
		
	}//end function	

	executeFire(){
		
		let distToCC = XF_Math3dUtil.getDistance3d(this.position,this.firePositionR);
		
		let angleDec = XF_Math.getAngleDec(this.rotationY,Math.PI/2);
		let bulletRotation = [0,angleDec,0];
		
		if(this.nextWeaponActive =='right'){
			let bullet = new ArmBullet(this,'right',this.firePositionR,this.targetCoord3d,bulletRotation,this.bulletModelA,this.firesVelocity);			
			//let bullet = new ArmLineBullet(this,'right',this.firePositionR,this.targetCoord3d,this.firesVelocity);
			this.listBulletsR.push(bullet);
			this.nextWeaponActive = 'left';
		}
		else {			
			//let bullet = new ArmLineBullet(this,'left',this.firePositionL,this.targetCoord3d,this.firesVelocity);
			let bullet = new ArmBullet(this,'left',this.firePositionL,this.targetCoord3d,bulletRotation,this.bulletModelA,this.firesVelocity);
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
		      
	onLiveBullet(THREE,bullet){
		//console.log(bullet.gunId);
	}//end function
	
				
	getRollValue(){
		let valueCalcA = this.distCurveMax - this.distCurveMin;
		let valueCalcB = this.currentRotationRadius - this.distCurveMin;
		let percentTemp= XF_Math.getPercent(valueCalcA,valueCalcB);						
		let percentCalc= 100.0 -  percentTemp;		
		return XF_Math.getValuePercent(this.rollValueMax,percentCalc);		
	}//end function			
	
	
	generateNewRoute(){
		
		let playerPosition = WebGL_threeUtil.getVector3Coords(this.gameScene.app.playerShip.wglCabina.position);
		let isNextRuteAttack = false;
		if(this.currentRuteType!='attack'){
			let targetDistance = Math.floor(XF_Math3dUtil.getDistance3d(this.position,playerPosition));
				
			if(targetDistance>800){
				console.log('attack');
				let valorCalc = Math.floor(XF_Math.getAleatoryValue(100));
				if(valorCalc<20){
					isNextRuteAttack = true;
				}
				console.log(isNextRuteAttack);				
			}
			else {
				isNextRuteAttack = false;
			}
		}		
	
		if(isNextRuteAttack){
			console.log('attack');
			this.currentRuteType=='attack';
			let targetCoord = playerPosition;
			let targetDistance = Math.floor(XF_Math3dUtil.getDistance3d(this.position,targetCoord));
			targetDistance+=XF_Math.getAleatoryValueMin(200,1000);
			let rutePoints = XF_Math3dUtil.getLineVertex(this.position,targetCoord,targetDistance);
			this.currentRute 	= new XfRutePlaneY(rutePoints);			
			this.currentRuteType = 'attack';
			this.currentRotationState = 'turnCero';
			this.currentRotationRadius = 0;			
		}
		else {
			let isNextRuteLineal = null;
			if(this.currentRuteType=='line'){
				isNextRuteLineal = false;
			}
			else{
				isNextRuteLineal = XF_Math.getAleatoryBoolean();
			}//end else
			
			if(isNextRuteLineal){
				let targetCoord = [0,0,0];
				let checkCoord = XF_Math3dCf.getCf3dOneVertex(1,this.position,this.distLinealMin,this.rotationY);	
				let isCheckCoordIntoScene = this.gameScene.isIntoScene(checkCoord);
				if(isCheckCoordIntoScene){
					let enc = false;
					while(!enc){
						let radioCalc = XF_Math.getAleatoryValueMin(this.distLinealMin,this.distLinealMax);
						targetCoord = XF_Math3dCf.getCf3dOneVertex(1,this.position,radioCalc,this.rotationY);
							
						if(this.gameScene.isIntoScene(targetCoord)){
							enc = true;
						}
					}		
				}
				else {
					if(this.positionInit!=null){
						this.position = this.positionInit;				
					}
					targetCoord = WebGL_sceneUtil.getAleatoryCoord3dInSceneY(this.gameScene);				
				}			
				let targetDistance = Math.floor(XF_Math3dUtil.getDistance3d(this.position,targetCoord));	
				let rutePoints = XF_Math3dUtil.getLineVertex(this.position,targetCoord,targetDistance);
				this.currentRute 	= new XfRutePlaneY(rutePoints);			
				this.currentRuteType = 'line';
				this.currentRotationState = 'turnCero';
				this.currentRotationRadius = 0;
			}
			else {
				let isDirRight = XF_Math.getAleatoryBoolean();
				if(isDirRight){
					let angleCalc = XF_Math.getAngleDec(this.rotationY,(Math.PI/2));
					let distCalc  = XF_Math.getAleatoryValueMin(this.distCurveMin,this.distCurveMax);
					let cfCenter  = XF_Math3dCf.getCf3dOneVertex(1,this.position,distCalc,angleCalc);
					
					let rotationInPlane = XF_Math3dUtil.getTwoVertexAngle_Y(cfCenter,this.position);				
					let countSubdiv = Math.floor(XF_Math.getCfPerimeter(distCalc));
					
					let cfPoints = XF_Math3dCf.getCf3dAllVertex(1,cfCenter,distCalc,countSubdiv,XF_Math3dCf.ROTATION_NEGATIVE,rotationInPlane);
					
					let countUsedPoints = XF_Math.getAleatoryValueMin(this.minCurvePercCountPoints,this.maxCurvePercCountPoints);
					let rutePoints = [];
					for(let idx=0;idx<=countUsedPoints;idx++){
						rutePoints[idx] = cfPoints[idx];
					}
					this.currentRotationRadius = distCalc;
					this.currentRotationState = 'turnRight';
					this.currentRute = new XfRutePlaneY(rutePoints);				
				}
				else {
					let angleCalc = XF_Math.getAngleInc(this.rotationY,(Math.PI/2));
					let distCalc  = XF_Math.getAleatoryValueMin(this.distCurveMin,this.distCurveMax);
					let cfCenter  = XF_Math3dCf.getCf3dOneVertex(1,this.position,distCalc,angleCalc);
					
					let rotationInPlane = XF_Math3dUtil.getTwoVertexAngle_Y(cfCenter,this.position);
					let countSubdiv = Math.floor(XF_Math.getCfPerimeter(distCalc));				
					let cfPoints = XF_Math3dCf.getCf3dAllVertex(1,cfCenter,distCalc,countSubdiv,XF_Math3dCf.ROTATION_POSITIVE,rotationInPlane);
					let countUsedPoints = XF_Math.getAleatoryValueMin(this.minCurvePercCountPoints,this.maxCurvePercCountPoints);
					let rutePoints = [];
					for(let idx=0;idx<=countUsedPoints;idx++){
						rutePoints[idx] = cfPoints[idx];
					}
					this.currentRotationRadius = distCalc;
					this.currentRotationState = 'turnLeft';
					this.currentRute = new XfRutePlaneY(rutePoints);									
				}
				this.currentRuteType = 'curve';
			}
			
		}//end else
		
		//console.log(this.currentRotationState);
		this.currentStepIndex = 0;
		this.position = this.currentRute.points[this.currentStepIndex];
		this.rotationY = this.currentRute.rotationsY[this.currentStepIndex];			
			
					
	}//end function
		
	onRouteEnd(){
		//let isCurrenPositionIntoScene = this.gameScene.isIntoScene(this.position);
		//if(isCurrenPositionIntoScene){
			this.generateNewRoute();
			this.updateWglState();
		//}
	
	}//end function
	       

}//end class

