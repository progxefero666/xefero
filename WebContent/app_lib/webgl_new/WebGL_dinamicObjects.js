


/**
 *  class  WebGLObjectRuteLine3d
 */
 class  WebGLObjectRuteLine3d {        
	
	//constructor	
	//..........................................................................
	constructor(parent,id,dto,velocity,pointStart,pointEnd) {
		this.parent   = parent;	
		this.id   = id;	
		this.dto = dto;
		this.velocity = velocity;
		this.pointStart = pointStart;
		this.pointEnd = pointEnd;
		this.init();
	};//end constructor

	init(){				
		let distance3d  =  Math.floor(XF_Math3dUtil.getDistance3d(this.pointStart,this.pointEnd));
		let countItems  = distance3d * (10) ;
		this.points		= XF_Math3dUtil.getLineVertex(this.pointStart,this.pointEnd,countItems);
		this.angleY 	= XF_Math3dUtil.getTwoVertexAngle_Y(this.pointStart,this.pointEnd);		
		this.stepIndex 	= 0;		
		this.stepPoint 	= [0,0,0];		
		this.dto.rotation.y = this.angleY;
	}//end function
	
	dinamic(){		
		this.stepIndex += this.velocity;
		if(this.stepIndex >= this.points.length){
			this.stepIndex 	= 0; //this.stepIndex-this.rutePlaneY.points.length;	
			if(this.parent!=null){
				this.parent.onRouteEnd(this.id);
			}				
		}
		this.stepPoint 		= this.points[this.stepIndex];
		this.dto.position.x = this.stepPoint[0];
		this.dto.position.y = this.stepPoint[1];
		this.dto.position.z = this.stepPoint[2];		
	}//end function
				

}//end class

/**
 *  class  WebGLObjectRutePlaneY 
 */
 class  WebGLObjectRutePlaneY {        
	
	//constructor	
	//..........................................................................
	constructor(parent,id,dto,velocity,rutePoints) {
		this.parent   = parent;	
		this.id   = id;	
		this.dto = dto;
		this.velocity = velocity;
		this.points = rutePoints;
		this.stepIndex = 0;		
		this.stepPoint = this.points[0];
		this.stepRotationY = 0;	
	}//end constructor
	
	dinamic(){		
		this.stepIndex+=this.velocity;
		if(this.stepIndex >= this.points.length){	
			this.stepIndex 	= 0; //this.stepIndex-this.points.length;	
			if(this.parent!=null){
				this.parent.onRouteEnd(this.id);
			}	
		}
		if(this.stepIndex<(this.points.length-1)){
			this.stepRotationY = XF_Math3dUtil.getTwoVertexAngle_Y(this.points[this.stepIndex],this.points[this.stepIndex+1]);
		}		
		this.stepPoint = this.points[this.stepIndex];		
	}//end function
				
				
}//end class

/**
 *  class WebGL_sceneDinamicFreeObject(gameScene,dto,velocity,positionInit);
 */
 class  WebGL_sceneDinamicFreeObject {        
	
	//constructor	
	constructor(gameScene,dto,velocity,positionInit) {
		this.gameScene		= gameScene;
		this.dto			= dto;		
		this.velocity		= velocity;	
		this.positionInit 	= positionInit;
		this.configure();
		this.init();
	}//end constructor
	
	configure(){
		this.rollValueMax = 45;
		this.distLinealMin = 50;
		this.distLinealMax =200; //this.gameScene.radiusMax;
		this.distCurveMin = 50;
		this.distCurveMax = 200;
		this.minCurvePercCountPoints = 60;
		this.maxCurvePercCountPoints = 90;
	}//end function
		
	init(){
		let positionCalc = [0,0,0];
		if(this.positionInit!=null){
			positionCalc = this.positionInit;
		}
		else {
			positionCalc =  WebGL_sceneUtil.getAleatoryCoord3dInSceneY(this.gameScene);
		}
		
		let targetCoord 	= WebGL_sceneUtil.getAleatoryCoord3dInSceneY(this.gameScene);
		let targetDistance 	= Math.floor(XF_Math3dUtil.getDistance3d(positionCalc,targetCoord));
		let rutePoints		= XF_Math3dUtil.getLineVertex(positionCalc,targetCoord,targetDistance);
		
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
		if(this.currentStepIndex == (this.currentRute.points.length-1) ){	
			this.currentStepIndex = 0;
			this.onRouteEnd();			
		}
		else {
			let isCurrenPositionIntoScene = this.gameScene.isIntoScene(this.currentRute.points[this.currentStepIndex]);
			if(isCurrenPositionIntoScene){
				this.position = this.currentRute.points[this.currentStepIndex];
				this.rotationY  = this.currentRute.rotationsY[this.currentStepIndex];			
				this.updateWglState();				
			}
			else {
				this.init();
			}
		}
		
	}//end function
		
	updateWglState(){
		//let distToCC = XF_Math3dUtil.getDistance3d([0,0,0],this.position);		
		//console.log(distToCC);
		this.dto.position.x = this.position[0];
		this.dto.position.y = this.position[1];
		this.dto.position.z = this.position[2];
		this.dto.rotation.x = 0;	
		this.dto.rotation.y = 0;		
		this.dto.rotation.z = 0;	
		this.dto.rotateY(this.rotationY);
		
		// rotateX
		//..........................................................................
		if(this.currentRuteType!='line'){			
			let rollDegrees = this.getRollValue();		
			if(this.currentRotationState=='turnRight'){
				this.dto.rotateX(XF_Math.RADIAN * rollDegrees );
			}
			else {
				this.dto.rotateX(XF_Math.RADIAN * rollDegrees * (-1));
			}				
		}
		//..........................................................................
		
	}//end function	
		
	getRollValue(){
		let valueCalcA = this.distCurveMax - this.distCurveMin;
		let valueCalcB = this.currentRotationRadius - this.distCurveMin;
		let percentTemp= XF_Math.getPercent(valueCalcA,valueCalcB);						
		let percentCalc= 100.0 -  percentTemp;		
		return XF_Math.getValuePercent(this.rollValueMax,percentCalc);		
	}//end function			
	
	generateNewRoute(){
		
		let isNextRuteLineal = null;
		if(this.currentRuteType=='line'){
			isNextRuteLineal = false;
		}
		else{
			isNextRuteLineal = XF_Math.getAleatoryBoolean();
		}
		
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
		//console.log(this.currentRotationState);
		this.currentStepIndex = 0;
		this.position = this.currentRute.points[this.currentStepIndex];
		this.rotationY = this.currentRute.rotationsY[this.currentStepIndex];			
					
	}//end function
		
	onRouteEnd(){
		let isCurrenPositionIntoScene = this.gameScene.isIntoScene(this.position);
		if(isCurrenPositionIntoScene){
			this.generateNewRoute();
			this.updateWglState();
		}
		else {
			this.init();
		}		
	}//end function
			

	

}//end class

