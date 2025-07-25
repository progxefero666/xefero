/**
 * RaceRoadControl
 */
class  RaceRoadControl{        
    
    static CIRCUITS_PATH = 'gamecar/circuit/';
    
	constructor(app,circuitId){
		this.app = app;
		this.circuitId = circuitId;
		this.elementsCharged = false;
		
		this.dataPath = RaceRoadControl.CIRCUITS_PATH.concat(this.circuitId).concat('/road/');
		this.roadDtos = new WebGL_groupdtos(this,this.dataPath,'road');
		this.roadDtos.loadWglObjects(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);						

		this.elements = new WebGL_listdtos(this,this.dataPath,'elements',null);
		this.elements.loadWglObjects(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);	
				
		this.walls = new WebGL_listdtos(this,this.dataPath,'walls',null);
		this.walls.loadWglObjects(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);
		
		//this.ramps = new WebGL_listdtos(this,'data/gamecar/road/','ramps',null);
		//this.ramps.loadWglObjects(this.app.app_THREE,this.app.scene,new FBXLoader(),this.app.txtLoader,null);
				
		//this.collisionObjects  = new WebGL_listdtos(this,'data/gamecar/collisionobjects/','collisionobjects','collisionobjects');
		//this.collisionObjects.loadWglObjects(this.app.app_THREE,this.app.scene,new FBXLoader(),this.app.txtLoader,null);
				
		this.generateRoadPath();
		//this.outputPathSpheres(this.app.app_THREE);
	}//end constructor

	alertAllDtosCharged(id){
		switch (id) {
			case 'road':
				break;		
			case 'walls':				
				break;		
			case 'elements':				
				this.elementsCharged = true;				
				break;	
			case 'collisionobjects':
				break;						    				
		 	default:
	    }//end switch		
	}//end function		
			
	//road path functions
	//...................................................................................................
	generateRoadPath(){
		//debugger;
		//let path = 	'./gamecar/circuit/madrid/road/roadpolysvertex.json';
		
		let path = this.dataPath.concat('roadpolysvertex.json');
		
		let jsonObj =  WebGL_util.readJSonObject(path);
		let arrayPolysVertex = jsonObj.vertex;
		let notorderPolys = XfPolyUtil.getPolys3d(arrayPolysVertex);
		
		//for record
		
		this.roadPath = [];
		for(let idx=0;idx<notorderPolys.length;idx++){
			this.roadPath.push(notorderPolys[idx].center);
		}//end for		
		
		/*
		//for read	
		path = 	'./gamecar/circuit/madrid/road/roadtrack.json';
		jsonObj =  WebGL_util.readJSonObject(path);
		let steps = jsonObj.steps;
		
		let polysOrder = [];
		polysOrder.push(steps[0].polyIndex);
		let orderIndex = 0;
		//debugger;
		for(let stepindex=1;stepindex<steps.length;stepindex++){
			if(steps[stepindex].polyIndex!=polysOrder[orderIndex]){
				polysOrder.push(steps[stepindex].polyIndex);
				orderIndex++;
			}
		}//end for
			
			
		this.roadPath = [];
		for(let idx=0;idx<polysOrder.length;idx++){
			if(notorderPolys[polysOrder[idx]]!=null){
				this.roadPath.push(notorderPolys[polysOrder[idx]].center);
			}
		}//end for				
			
		this.roadLen = 0;
		for(let idx=0;idx<this.roadPath.length;idx++){
			let indexStart = idx;
			let indexEnd = idx + 1;
			if(indexEnd==this.roadPath.length){
				indexEnd = 0;
			}
			this.roadLen +=XF_Math3dUtil.getDistance3d(this.roadPath[indexStart],this.roadPath[indexEnd]);
		}	
		
		console.log(this.roadLen);	
		*/	
	}//end function		


	outputPathSpheres(THREE){
		for(let idx=0;idx<this.roadPath.length;idx++){
			let sphere =  WebGL_threeGenObjects.createObjectSphereColor(THREE,20,16,new THREE.Color('rgb(0,250,0)'),
																		this.roadPath[idx]);
			this.app.scene.add(sphere);
		}
	}//end function	
	
	getPathStepIndexInPosition3d(point3d){
		let index= -1;
		let dist = 1000000;
		for(let stepIndex=0;stepIndex<this.roadPath.length;stepIndex++){
			let distCalc = XF_Math3dUtil.getDistance3d(point3d,this.roadPath[stepIndex]);
			if(distCalc<dist){
				dist = distCalc;
				index = stepIndex;
			}						
		}
		return index;
	}//end function	
	
	getPathStepIndexDistanceToPosition3d(stepIndex,point3d){
		return XF_Math3dUtil.getDistance3d(point3d,this.roadPath[stepIndex]);
	}//end function	
	
	getPathRotationAtPosition3d(point3d){		
		let pathStepIndex = this.getPathStepIndexInPosition3d(point3d);
		let pathStepIndexNext = -1;
		if(pathStepIndex<(this.roadPath.length-1)){
			pathStepIndexNext = pathStepIndex+1;
		}
		else {
			pathStepIndexNext = 0;
		}
		let rutePointStart = this.app.gameRoad.roadPath[pathStepIndex];
		
		let rutePointEnd = null;	
		if(pathStepIndexNext>=0){
			rutePointEnd = this.app.gameRoad.roadPath[pathStepIndexNext];
		}
		else {
			rutePointEnd = this.app.gameRoad.roadPath[pathStepIndex];
		}					
		let ruteAngleY = XF_Math3dUtil.getTwoVertexAngle_Y(rutePointStart,rutePointEnd);			
		return ruteAngleY;			
	}//end function	
	
		
	getRoadHeightAtPosition3d(THREE,point3d){
		let coordCalcY = point3d[1]+100;
		let origin	= new THREE.Vector3(point3d[0],coordCalcY,point3d[2]);		
		let direction = new THREE.Vector3(0,-1,0);	
		let raycaster = new THREE.Raycaster();
		raycaster.set(origin,direction);				
		let intersects = raycaster.intersectObjects(this.roadDtos.grdto.children); // this.roadDtos.grdto.children
		let heightResult = -100000;
		if(intersects.length>0){
			heightResult= intersects[0].point.y;				
		}	
		else {
			//console.log('not instersect');
		}	
		return heightResult;					
	}//end function
		
	getRampHeightAtPosition3d(THREE,point3d){
		let coordCalcY = point3d[1]+2;
		let origin	= new THREE.Vector3(point3d[0],coordCalcY,point3d[2]);		
		let direction = new THREE.Vector3(0,-1,0);	
		let raycaster = new THREE.Raycaster();
		raycaster.set(origin,direction);				
		raycaster.far = 5; 
		let intersects = raycaster.intersectObjects(this.ramps.dtos); // this.roadDtos.grdto.children
		let heightResult = -100000;
		if(intersects.length>0){
			heightResult= intersects[0].point.y;	
			//console.log('instersect ramp');			
		}	
		else {
			//console.log('not instersect');
		}	
		return heightResult;					
	}//end function
		
	//check collisions to collisionObjects		
	checkCollisions(THREE,wglCamera,checkPosition,checkDistance){ 
		let result = false;				
		let origin	= new THREE.Vector3(checkPosition.x,50,checkPosition.z);							
		let cameraWork	= wglCamera.clone();	
		cameraWork.position.y = 25;
		let cameraVector = new THREE.Vector3(); 
		cameraWork.getWorldDirection(cameraVector);
		let raycaster = new THREE.Raycaster();	
		raycaster.set(origin,cameraVector);				
		raycaster.far = 2000; 								
		let intersects = raycaster.intersectObjects(this.collisionObjects.dtos );		
		if(intersects.length>0){
			for (let i=0;i< intersects.length;i++) {
				if(intersects[i].distance<checkDistance){
					result = true;
					console.log('object collision');	
					break;				
				}				
			}
		}
		return result;		
	}//end function
			
							
}//end class