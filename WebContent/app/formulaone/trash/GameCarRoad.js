/**
 * class GameCarRoad
 */
class  GameCarRoad{        
    
	constructor(app){
		this.app = app;
		this.roadDtos = new WebGL_groupdtos(this,'data/gamecar/road/','road');
		this.roadDtos.loadWglObjects(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);			
		
		//this.collisionObjects  = new WebGL_listdtos(this,'data/gamecar/collisionobjects/','collisionobjects','collisionobjects');
		//this.collisionObjects.loadWglObjects(this.app.app_THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);
				
		//this.postConstructor();
		
	}//end constructor
	
	postConstructor(){
		let path = 	'./data/gamecar/road/roadvertex.json';
		let jsonObj =  WebGL_util.readJSonObject(path);	
		let arrayVertex = jsonObj.vertices;
		this.faces = XfMeshUtil.getMeshPolys3d(arrayVertex);		
		
		this.generateRoadPath();

	}//end function

	alertAllDtosCharged(id){
		switch (id) {
			case 'road':
				break;			
			case 'collisionobjects':
				console.log('collisionobjects loaded');
				break;						    				
		 	default:
	    }//end switch		
	}//end function	
	
	generateRoadPath(){
		let path = 	'./data/gamecar/road/roadpolysvertex.json';
		let jsonObj =  WebGL_util.readJSonObject(path);
		let arrayPolysVertex = jsonObj.vertex;
		let notorderPolys = XfPolyUtil.getPolys3d(arrayPolysVertex);
		
		//for record
		/*	
		this.roadPath = [];
		for(let idx=0;idx<notorderPolys.length;idx++){
			this.roadPath.push(notorderPolys[idx].center);
		}//end for		
		*/			
			
		//for read	
		path = 	'./data/gamecar/road/roadtrack.json';
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
			this.roadPath.push(notorderPolys[polysOrder[idx]].center);
		}//end for				
			
		//console.log('end generate road path');	
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
			console.log('not instersect');
		}	
		return heightResult;					
	}//end function
	
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
		
	getRoadAleatoryCoord(){
		let stepIndex = XF_Math.getAleatoryValueMin(1,this.roadPath.length - 50);
		return this.roadPath[stepIndex];
	}//end function
		
	/*

	let polyCenter = this.app.gameRoad.getFaceCenterInPosition3d(coordCalc);			
	this.roadCooordH = 0;
	if(polyCenter!=null){
		check = true;
		this.roadCooordH = polyCenter[1];
		if(this.roadCooordH<0){
			this.roadCooordH = 0;				
		}
	}
				
	getRoadHeightInPosition3d(THREE,point3d){
		//this.roadDtos.grdto
		let vectorStart = new THREE.Vector3(point3d[0],500,point3d[2]);
		let vectorEnd = new THREE.Vector3(point3d[0],-500,point3d[2]); 
		
		let raycaster = new THREE.Raycaster(vectorStart,vectorEnd,0,2000);//
		let intersects = raycaster.intersectObjects(this.app.scene.children); 
		
		let coordH = 0;
		if( intersects.length>0){
			console.log('true');
			let intersectPoint = intersects[0].point;			
			coordH = intersectPoint.y;	
		}	
		else {
			console.log('false');
		}	
		return coordH;
		
	}//end function
		
	isPointIntoRoad(pointCoord3d){
		let terrainPolyIndex = this.getFaceIndexInPosition3d(pointCoord3d);	
		if(terrainPolyIndex>=0){
			return true;
		}
		return false;
	}//end function
		
	getFaceCenterInPosition3d(point3d){
		let polyIndex = this.getFaceIndexInPosition3d(point3d);
		if(polyIndex<0){
			return null;
		}
		return this.faces[polyIndex].center;		
	}//end function	
			
	getFaceIndexInPosition3d(point3d){
		let indexReturn = -1;
		let testPoint 	=  [point3d[0],point3d[2]];
				
		for(let polyIndex=0;polyIndex<this.faces.length;polyIndex++){
			let insideBoxPoly2d = this.faces[polyIndex].poly2d.isPointIntoBoundingBox(testPoint);
			if(insideBoxPoly2d){
				let insideTriangle = this.faces[polyIndex].poly2d.isPointIntoTriangle(testPoint);
				if(insideTriangle){
					indexReturn = polyIndex;
					//console.log('insideTriangle');
					break;
				}
				else{
					//console.log('outsideTriangle');
				}
			}
			else {
				//console.log('outside Box Poly2d');
			}
		}		
		return indexReturn;
	}//end function
	*/
	
}//end class