/**
 *  class  GameFlyScene 
 */
 class  GameFlyScene {        
	
	//constructor	
	constructor(app,canvasId,center,radiusMax,planeHcoordY) {
		this.app 		= app;
		this.center		= center;
		this.radiusMax	= radiusMax;		
		if(planeHcoordY!=null){
			this.planeHcoordY = planeHcoordY;
		}
		else {this.planeHcoordY = 0;}
		
		if(canvasId!=null){
			this.canvas =document.getElementById(canvasId);
		}
		else {
			this.canvas = document.createElement('canvas');	
		}
		this.enemyShips = [];
		this.targets = [];
		this.configure();
	}//end constructor
	
	configure(){
		this.createlistExcludeObjects();
		this.boundsX = [this.radiusMax*(-1),this.radiusMax];
		this.boundsY = [this.radiusMax*(-1),this.radiusMax];		
		this.mapRadius 		  = 0.9;
		this.mapDistToCameraH = 3.5;
		this.mapDistToCameraV = 2.0;
		this.mapDistToCameraZ = 8.0;
	}//end function
		
	init(THREE,scene,fbxLoader,txtLoader){				
		//this.terrain = new GameTerrain();
		
		this.skybox = WebGL_sceneUtil.createSkyBox(THREE,'./data/game/skyboxA/','skybox',100000);	
		this.skybox.name = 'skybox';
		scene.add(this.skybox);
		
		//this.terrainDtos = new WebGL_listdtos(this,'data/doom/terrain/','terrain');
		//this.terrainDtos.loadWglObjects(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);

		//this.terrain = new WebGL_dto(this,'data/game/universoA/','terrain');
		//this.terrain.loadWglObject(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);	
				
		//this.buildingsDtos  = new WebGL_listdtos(this,'data/doom/buildings/','buildings');
		//this.buildingsDtos.loadWglObjects(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);	
						
		//............................................................................
		let ctx = this.canvas.getContext('2d');
		this.canvas.width = 256;
		this.canvas.height = 256;
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.fillStyle = '#ff00ff';
		ctx.fillRect(0,0, this.canvas.width/2, this.canvas.height/2);
		
		let cfTexture = new THREE.CanvasTexture(this.canvas);
		cfTexture.needsUpdate = true;

		let cfMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } );
		cfMaterial.map = cfTexture;		 
		
		let cfGeometry = new THREE.CircleGeometry(this.mapRadius,64);
		this.wglControl = new THREE.Mesh(cfGeometry,cfMaterial);
		
		scene.add(this.wglControl);
		//............................................................................
				
		//............................................................................
		for(let idx=0;idx<this.enemyShips.length;idx++){
			this.enemyShips[idx].generate(THREE,scene,fbxLoader,txtLoader);			
		}
		//............................................................................
	}//end function
	
	dinamic(THREE,wglCamera){
		
		//...............................................................................
		this.skybox.position.x = this.app.playerShip.position.x;
		this.skybox.position.y = this.app.playerShip.position.y;
		this.skybox.position.z = this.app.playerShip.position.z;
		//...............................................................................			
					
		//...............................................................................
		for(let idx=0;idx<this.enemyShips.length;idx++){
			if(this.enemyShips[idx].charged){
				this.enemyShips[idx].dinamic(wglCamera);
			}				
		}
		//...............................................................................
		
		//...............................................................................
		let cameraVector = new THREE.Vector3(); 
		wglCamera.getWorldDirection(cameraVector);	  		
		cameraVector.multiplyScalar(this.mapDistToCameraZ);
		
		this.wglControl.rotation.x = wglCamera.rotation.x;
		this.wglControl.rotation.y = wglCamera.rotation.y;		
		this.wglControl.rotation.z = wglCamera.rotation.z;		
		this.wglControl.position.x = wglCamera.position.x+ cameraVector.x;
		this.wglControl.position.y = wglCamera.position.y+ cameraVector.y;
		this.wglControl.position.z = wglCamera.position.z+ cameraVector.z;			
		this.wglControl.translateX(this.mapDistToCameraH * (-1));
		this.wglControl.translateY(this.mapDistToCameraV);	
		//...............................................................................
				
	}//end function
		
	alertAllDtosCharged(id){
		switch (id) {	    	
			case 'terrain':
				break;	 
			case 'buildings':
				break;			
		 	default:
	    }//end switch
	}//end function	
			
	addTarget(wglTarget){
		this.targets.push(wglTarget);
	}//end function
		
				
	isExcludeObjectByName(objectName){		
		let inArray = this.listExcludeObjects.includes(objectName);
		return inArray;
	}//end function
	
	chargeEnemyShip(enemyShip){
		this.enemyShips.push(enemyShip);		
	}//end function
				
	isIntoScene(point){
		let intoScene = true;
		if( (point[0]< this.boundsX[0]) || (point[0]> this.boundsX[1]) 
			|| (point[1]< this.boundsY[0]) || (point[1]> this.boundsY[1]) ){
			intoScene = false;
		}
		return intoScene;
	}//end function
	
	createlistExcludeObjects(){	
		this.listExcludeObjects = [];
		//'AmbientLight'
		//'DirectionalLight'
		//'PointLight'
		this.listExcludeObjects.push('sight');
		this.listExcludeObjects.push('skybox');
		this.listExcludeObjects.push('xwing1');
		this.listExcludeObjects.push('xwingv1');
		this.listExcludeObjects.push('xwingv2');
		this.listExcludeObjects.push('bullet');
		this.listExcludeObjects.push('boundsSpheres_F');
		this.listExcludeObjects.push('boundsSpheres_R');
		this.listExcludeObjects.push('boundsSpheres_L');		
	}//end function
		
}//end class


