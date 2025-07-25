/**
 *  WebGLAppTest
 */

 var thisObj = null;
var controls = null;


class  WebGLAppTie {        
	
	//constructor	
	//..........................................................................
	constructor(objCanvas,monitorWidth,monitorHeight,THREE,FBXLoader,FlyControls,OrbitControls) {

		this.monitorWidth = monitorWidth;
		this.monitorHeight = monitorHeight;
		this.app_THREE = THREE;
		
		//charge Three WebGlMonitor
		//.....................................................................		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( monitorWidth, monitorHeight);				
		objCanvas.appendChild( this.renderer.domElement );	
		
		this.active = false;
			
		//create scene
		//.....................................................................
		this.scene = new THREE.Scene();
		
		this.initShipCoordY = 1;
		
		//const loader = new THREE.TextureLoader();
		//this.scene.background = loader.load( './data/tie/fondo.jpg' );	
		//this.scene.background = new THREE.Color("rgb(0,0,0)");					
		this.init(THREE,FBXLoader,FlyControls,OrbitControls);
		
	}//end constructor

	init(THREE,FBXLoader,FlyControls,OrbitControls) {
				//prepare lights
		//.....................................................................
		this.chargeLights(THREE);
		
		//load floor
		//.....................................................................
		/*
		var groundTexture = new THREE.TextureLoader().load('data/tie/terrain.png');
		var groundNormalTexture = new THREE.TextureLoader().load('data/tie/terrain_normal.png');
		
		var groundMaterial = new THREE.MeshPhongMaterial();
		groundMaterial.map= groundTexture;
		groundMaterial.bumpMap= groundNormalTexture;
		mesh.receiveShadow = true;
		*/
	
		let material = new THREE.MeshBasicMaterial( { color: 0x05f3902 } );
		let floor = new THREE.Mesh( new THREE.PlaneGeometry(150000,150000 ), material );
		floor.position.y = -55.0;
		floor.rotation.x = - Math.PI / 2;
		this.scene.add( floor );

		let skyboxImage = 'cieloestrellas';
		let skyboxMaterials = this.createMaterialArray(THREE,skyboxImage);
  		let skyboxGeo = new THREE.BoxGeometry(50000, 50000, 50000);
  		let skybox = new THREE.Mesh(skyboxGeo, skyboxMaterials);
  		this.scene.add(skybox);
  		
  		
		//prepare camera 
		//.....................................................................
		
		this.camera = new THREE.PerspectiveCamera( 55, this.monitorWidth / this.monitorHeight,1, 30000);
		this.camera.position.x = -300;	
		this.camera.position.y = this.initShipCoordY + 50;
		this.camera.position.z = 0;		
		this.camera.rotation.y = RADIAN * 270;
		
		/*
		//ortho camera
		this.camera = new THREE.PerspectiveCamera( 55, this.monitorWidth / this.monitorHeight,1, 30000);
		this.camera.position.x = 0;	
		this.camera.position.y = this.initShipCoordY+1000;
		this.camera.position.z = 0;		
		this.camera.rotation.x = RADIAN * 270;
		*/
		
		this.txtLoader = new THREE.TextureLoader();
		this.fbxLoader = new FBXLoader();
		
		this.grpTerrain = readModel3D(this,'terrain');
		this.grpTerrain.position[1] = 0; //center to camera v axis				
		this.grpTerrain.loadWglObjects(THREE,this.scene,this.fbxLoader,new THREE.TextureLoader());		
		
		//this.espacio = readModel3D(this,'espacio');
		//this.espacio.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader);				
		
		//this.grpTarget = readGroupDataModel3D(this,'target');
		this.grpTarget = readModel3DfromPath(this,'data/gametr/target','target')				
		this.grpTarget.position[1] = this.initShipCoordY;
		this.grpTarget.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader);
						
		//tiee
		this.xwing = readModel3DfromPath(this,'data/xwing','xwing');	
		this.xwing.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader);
	

		this.xwingleft15 = readModel3DfromPath(this,'data/xwing','xwingleft15');		
		this.xwingleft30 = readModel3DfromPath(this,'data/xwing','xwingleft30');		
		this.xwingleft45 = readModel3DfromPath(this,'data/xwing','xwingleft45');				
		this.xwingright15 = readModel3DfromPath(this,'data/xwing','xwingright15');	
		this.xwingright30 = readModel3DfromPath(this,'data/xwing','xwingright30');	
		this.xwingright45 = readModel3DfromPath(this,'data/xwing','xwingright45');	
		
		this.xwingleft15.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader);
		this.xwingleft30.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader);
		this.xwingleft45.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader);
			
		this.xwingright15.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader);
		this.xwingright30.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader);			
		this.xwingright45.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader);			
						
	}//end function
		
	alertAllDtosCharged(id){
		//

		switch (id) { 
			case 'espacio':
				//console.log('espacio Loaded');
				break;			
			case 'terrain':
				//console.log('terrain Loaded');
				//this.terrain = new XfTerrain(this.grpTerrain.wglObjects[0].sceneObj);
				break;		
			case 'target':
				//console.log('target Loaded');
				break;				
	 		case 'xwing':
				let playerCameraPosition = [this.camera.position.x,this.camera.position.y,this.camera.position.z];
				this.playerShip = new GamePlayerShip(this,this.xwing.wglObjects[0].sceneObj,playerCameraPosition,this.initShipCoordY);
	    		break;
	    	case 'xwingleft45':
				break;
				
			case 'xwingright45':	
				let listObjLeft = [
					this.xwingleft15.wglObjects[0].sceneObj,
					this.xwingleft30.wglObjects[0].sceneObj,
					this.xwingleft45.wglObjects[0].sceneObj
				];
				let listObjRight = [
					this.xwingright15.wglObjects[0].sceneObj,
					this.xwingright30.wglObjects[0].sceneObj,
					this.xwingright45.wglObjects[0].sceneObj
				];				
				this.playerShip.init(this.app_THREE,listObjLeft,listObjRight);
				
				this.playerArm = new GamePlayerArm(this);
				this.start()			
				break;
		 	default:
	    }
	    		
	}//end function
	
	alertGroupCharged(scene,webglObject,id){
		
		/*
		switch (id) {
			case 'target':
				break;
		 	default:
	    }
	    */		
	}//end function

	start() {
		this.active = true;
		thisObj = this;				
		function animate() {			
			if(thisObj.active){
				requestAnimationFrame( animate );
				if(thisObj.playerShip.webglObject!=null){
					//ship update
					//......................................................................................
					thisObj.playerShip.dinamic();					
					//camera update
					//......................................................................................
					thisObj.camera.position.x = thisObj.playerShip.cameraPosition[0];
					thisObj.camera.position.y = thisObj.playerShip.cameraPosition[1]+30; //
					thisObj.camera.position.z = thisObj.playerShip.cameraPosition[2];
					thisObj.camera.rotation.x = 0;
					thisObj.camera.rotation.y = thisObj.playerShip.cameraRotationY;
					thisObj.camera.rotation.z = 0;
					thisObj.playerArm.update(thisObj.camera.rotation,
											 thisObj.playerShip.targetCoord3d);					
					//target update
					//......................................................................................
					thisObj.grpTarget.wglObjects[0].sceneObj.position.x = thisObj.playerShip.targetPosition[0];
					thisObj.grpTarget.wglObjects[0].sceneObj.position.y = thisObj.playerShip.targetPosition[1];
					thisObj.grpTarget.wglObjects[0].sceneObj.position.z = thisObj.playerShip.targetPosition[2];
					thisObj.grpTarget.wglObjects[0].sceneObj.lookAt(
						thisObj.playerShip.webglObject.position.x,
						thisObj.playerShip.webglObject.position.y,
						thisObj.playerShip.webglObject.position.z);
				}
				thisObj.renderer.render( thisObj.scene,thisObj.camera );				
			}
			else {
				//console.log('active false');
				thisObj.renderer.setAnimationLoop(null);	
			}
		}
		animate();		
	}//end function		
	
	executeFire(){
		this.playerArm.executeFire(this.playerShip.firePositionR,
								   this.playerShip.firePositionL);
	}//end function	
	
	executeRotationLeft(intensityPercent){
		this.playerShip.percentRotationY = intensityPercent;
		this.playerShip.dirRotationY= 'left';
		this.playerShip.activeRotationY = true;
	}//end function	
	
	executeRotationRight(intensityPercent){
		this.playerShip.percentRotationY = intensityPercent;
		this.playerShip.dirRotationY= 'right';
		this.playerShip.activeRotationY = true;
	}//end function	
		
	stopHorizontalRotation(){
		this.playerShip.executeStopHR = true;
	}//end function	
		
	executeElevationPositive(){
		this.playerShip.dirElevation = 'up';
		this.playerShip.activeElevation = true;
	}//end function
		
	executeElevationNegative(){
		this.playerShip.dirElevation = 'down';
		this.playerShip.activeElevation = true;
	}//end function
			
	executeElevationZero(){
		this.playerShip.executeStopEV = true;
	}//end function
				
	chargeLights(THREE) {
	    this.scene.add( new THREE.AmbientLight( new THREE.Color("rgb(200,200,200)"))); 
	    //const lightF = new THREE.PointLight( 0xffffff, 1, 300 );
		//lightF.position.set(-100, 0, 0  );
		//this.scene.add( lightF );

	}//end function
	
	/*		
	chargeControls(FlyControls) {
	 	this.flyControl = new FlyControls( this.camera, this.renderer.domElement );  	
	  	this.flyControl.movementSpeed = 10;
	  	this.flyControl.rollSpeed = Math.PI / 24;
	  	this.flyControl.autoForward = false;
	  	this.flyControl.dragToLook = true;
	}//end function	
	*/
			
	//functions for sky bounding box
	//....................................................................................
	createPathStrings(filename) {
		const basePath = './data/cielo/';
		const baseFilename = basePath + filename;
		const fileType = '.jpg';
		const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
		const pathStings = sides.map(side => {
		    return baseFilename + "_" + side + fileType;
		});
		
		return pathStings;
	}//end function
	
	createMaterialArray(THREE,filename) {
		const skyboxImagepaths = this.createPathStrings(filename);
		const materialArray = skyboxImagepaths.map(image => {
		    let texture = new THREE.TextureLoader().load(image);
		    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); 
		});
		return materialArray;
	}//end function
	
	/*
	init(THREE){
		//create wglLine
		//.............................................................
		let pointStart = new THREE.Vector3( 
			this.parentPosition[0], 
			this.parentPosition[1],
			this.parentPosition[2]
		);
		let pointEnd = new THREE.Vector3( 
			this.position[0], 
			this.position[1],
			this.position[2]
		);		
		const points = [];
		points.push(pointStart);
		points.push(pointEnd);
		
		const geometry = new THREE.BufferGeometry().setFromPoints( points );
		const material = new THREE.LineBasicMaterial({color: 0xff0000});
		geometry.attributes.position.needsUpdate = true;
		this.wglLine =  new THREE.Line( geometry, material );
	}//end function
	*/	

			
		/*
		
		//darthvader
		//this.grpItems = readModel3D(this,'darthvader');
		//this.grpItems.position[1] = 0; //center to camera v axis				
		//this.grpItems.loadWglObjects(THREE,this.scene,fbxLoader,new THREE.TextureLoader());
				
		var elements=[
			{
				"id":"manmesh.fbx",
				"parent_id":null,
				"position":[0,-60,0],
				"color":[0.0352941,0.0352941,0.0352941,1.0],
				"textures":"completa.jpg"
			}
		];
		this.grpItems =new WebGL_grpobjects(this,'manmesh',[0,0,0],elements,'data/manmesh/');	
		this.grpItems.position[1] = -60;
		this.grpItems.loadWglObjects(THREE,this.scene,fbxLoader,new THREE.TextureLoader());
		*/
		/*
		this.webGL_item = new  WebGL_textobject(
			null,'manmesh.fbx',[0.0352941,0.0352941,0.0352941,1.0],
			[0,-60,0],1.0,'data/manmesh/','completa.jpg',null,null
		);
		
		this.webGL_item.loadWglObject(THREE,this.scene,fbxLoader,new THREE.TextureLoader());
		*/
			
}//end class