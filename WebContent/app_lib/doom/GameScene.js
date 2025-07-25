/**
 *  class  WebGL_sceneUtil 
 */
 class  GameScene {        
	
	//constructor	
	constructor(app) {
		this.app 	= app;
		this.terrain = null;
		this.targets = [];
	}//end constructor
	
	init(THREE){
		this.createlistExcludeObjects();
		
		this.skybox = WebGL_sceneUtil.createSkyBox(THREE,'data/doom/skyboxA/','skybox',100000);	
		this.skybox.name = 'skybox';
		this.skybox.layers.set(1);
		this.app.scene.add(this.skybox);
		
		this.terrainDtos = new WebGL_listdtos(this,'data/doom/terrain/','terrain');
		this.terrainDtos.loadWglObjects(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);	
		
		this.buildingsDtos  = new WebGL_groupdtos(this,'data/doom/buildings/','buildings','buildings');
		this.buildingsDtos.loadWglObjects(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);	
		
		
		
	}//end function		
	
	alertAllDtosCharged(id){
		switch (id) {	    	
			case 'terrain':
					this.terrain = new GameTerrain();
					//this.terrainDtos.setLayer(1);
				break;	 
			case 'buildings':
					//this.buildingsDtos.setLayer(1);
				break;			
		 	default:
	    }//end switch
	}//end function	
	
	dinamic(THREE){
		
		//skybox
		//...............................................................................
		if(this.app.player.position!=null){
			this.skybox.position.x = this.app.player.position.x;
			this.skybox.position.y = this.app.player.position.y;
			this.skybox.position.z = this.app.player.position.z;
		}

		
	}//end function
				
	getPositionTerrainHeight(THREE,coordX,coordZ){
		/*
		let vectorUp = new THREE.Vector3(coordX,5000,coordZ); 
		let vectorDown = new THREE.Vector3(coordX,-5000,coordZ);
		//let terrainObj = this.app.scene.getObjectByName('terrain');
		//console.log(terrainObj.name);
		//debugger;
		let raycaster = new THREE.Raycaster(vectorUp,vectorDown,0,10000);
		let intersects = raycaster.intersectObjects(this.app.scene.children);
		let intersectPoint = new THREE.Vector3(0,0); 
		if(intersects.length>0){	
			intersectPoint = intersects[0].point;
			//console.log(intersectPoint.y);
		}
		return intersectPoint.y;
		*/
		let coordCalc = [coordX,10000,coordZ];
		let polycenter = this.terrain.getFaceCenterInPosition3d(coordCalc);
		return polycenter[1];		
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
		//'AmbientLight'
		//'DirectionalLight'
		//'PointLight'
		this.listExcludeObjects.push('skybox');
		this.listExcludeObjects.push('terrain');
		this.listExcludeObjects.push('buildings');
		this.listExcludeObjects.push('sight');
		this.listExcludeObjects.push('target');
		this.listExcludeObjects.push('blasterdown');	
		this.listExcludeObjects.push('blasterup');
		this.listExcludeObjects.push('bullet');	
			
	}//end function
		
	addTargetSimple(wglTarget){
		this.targets.push(wglTarget);
	}//end function
	
	removeTarget(wglTargetName){
	
	}//end function
	


}//end class