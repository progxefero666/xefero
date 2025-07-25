// @ts-nocheck
/**
 * class WebGLAppUniverse
 * 
 */
var thisObj = null;
var controls = null;

class  WebGLAppUniverse {        
	
	//constructor	
	//..........................................................................
	constructor(objCanvas,monitorWidth,monitorHeight,THREE,FBXLoader,FlyControls,OrbitControls,gamePad) {
		this.monitorWidth = monitorWidth;
		this.monitorHeight = monitorHeight;
	
		this.gamePadControl = new GamepadControl(this,gamePad);	
		this.listenButtonsUnpressed = false;
	
		this.restartInterval = 2000;
		this.restartTimer = null;
		//.....................................................................
		this.mapCanvas = document.getElementById("mapCanvas");
		//let mapCanvasWidth = this.mapCanvas.getBoundingClientRect().width;
		//let mapCanvasHeight = this.mapCanvas.getBoundingClientRect().height;		
		let mapCanvasWidth = 280;
		let mapCanvasHeight = 280;
		let mapCanvasWorldSize = [1000,1000];
		this.mapPaint 	= new XF_ScenePaint(
			new XF_SceneDriver([mapCanvasWidth,mapCanvasHeight],mapCanvasWorldSize),
			this.mapCanvas.getContext("2d")
		);
		//.....................................................................
	
		//.....................................................................
		//charge Three WebGlMonitor
		//.....................................................................		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.antialias  = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.monitorWidth, this.monitorHeight);	
		this.renderer.gammaOutput = true;				
		this.renderer.shadowMap.enabled = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		//this.renderer.physicallyCorrectLights = true;
		objCanvas.appendChild( this.renderer.domElement );
		
		this.boundingClientRect = this.renderer.domElement.getBoundingClientRect();
		this.scene = new THREE.Scene();					
		//.....................................................................
		
		this.init(THREE,FBXLoader,FlyControls,OrbitControls);
		
	}//end constructor

	init(THREE,FBXLoader,FlyControls,OrbitControls) {
		this.app_THREE  = THREE;
		this.app_FlyControls = FlyControls;
		this.txtLoader 	= new THREE.TextureLoader();
		this.fbxLoader 	= new FBXLoader()		
		this.active 	= false;
		this.chargeLights(THREE);
	
		//terrain
		//.......................................................................................
		this.terrain = new WebGL_dto(this,'data/game/universoA/','terrain');
		this.terrain.loadWglObject(THREE,this.scene,this.fbxLoader,this.txtLoader,null);	
			
		//.......................................................................................
		//load player ship
		//.......................................................................................		
		//this.playerWglShip = new WebGL_groupdtos(this,'data/cabina/','cabina','xwing');			
		//this.playerWglShip.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);
		this.playerWglShip = new WebGL_groupdtos(this,'data/game/player/ship/','xwing','xwing1');
		this.playerWglShip.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);												
		this.cabinaCharged = false;
		this.fireContacts = [];
		this.collisionContacts = [];
		
		//prepare camera 
		//.....................................................................		 
		this.chargeCameras(THREE);
		//.............................................................................................	
		//load imperial ships 
		//.............................................................................................			
		//this.impdestroyer = new WebGL_groupdtos(this,'data/game/ship/impdestroyer/','impdestroyer','impdestroyerA');
		//this.impdestroyer.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,[0,0,500]);
		this.tie = new WebGL_groupdtos(this,'data/game/ship/tie/','tie');
		this.tie.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,[0,0,500]);

		//this.enemyShipTie1 = new EnemyShip(EnemyShips.ES_TIEFIGTER_ID,'enemyShipTie1',[0,50,-400]);
		this.gameScene = new GameFlyScene(this,null,[0,0,0],10000,0);
		//this.gameScene.chargeEnemyShip(this.enemyShipTie1);
		this.gameScene.init(THREE,this.scene,this.fbxLoader,this.txtLoader);
		
		
		//this.loadTestObjects(THREE);
		this.chargeControls(FlyControls);						
		this.start(THREE);
		//this.createScene();
		//this.appTimer= null;
		//this.startApp2d();
	}//end function

	updateControlGamePad(gamePad){
		this.gamePadControl.gamePad = gamePad;
		this.gamePadControl.process();
	}//end function
		
	alertAllDtosCharged(id){
		switch (id) {
			case 'cabina':
				console.log('xwing cabina loaded');						
				this.playerShip = new PlayerShip(this,this.gameScene,this.playerWglShip.grdto,this.flyControl.movementSpeed,true);				
				this.playerArm = new PlayerArm(this);
				this.playerArm.init(this.app_THREE,this.scene,this.fbxLoader,this.txtLoader);
				this.cabinaCharged = true;	
				break;
			case 'xwing': 												
				this.playerShip = new PlayerShip(this,this.gameScene,this.playerWglShip.grdto,this.flyControl.movementSpeed,false);
				this.playerArm = new PlayerArm(this);
				this.playerArm.init(this.app_THREE,this.scene,this.fbxLoader,this.txtLoader);					
				this.cabinaCharged = true;	
				break;
			case 'tie':
				console.log('tie loaded');
				this.tie.grdto.scale.set(20,20,20);
				this.din_ship = new EnemyShipDinamic(this,this.gameScene,this.tie.grdto,4,null);		
				this.din_ship.restart();	
				console.log('punto 1');			
				break;					
			case 'impdestroyer':
				console.log('impdestroyer loaded');				
				this.impdestroyer.grdto.rotation.y = XF_Math.RADIAN * 235;		
				break;
			case 'deathstar':
				console.log('deathstar loaded');				
				this.deathstar.grdto.position.z = -5000;	
				this.deathstar.grdto.position.x = -10000;
				break;						
		}
		//console.log(id);
	}//end function

	start(THREE) {
		this.exeIndex = 0;
		this.active = true;
		
		//start move to front
		this.flyControl.moveFront();
		
		thisObj = this;				
		function animate() {
			
			if(thisObj.active){
				requestAnimationFrame( animate );
		  		thisObj.flyControl.update(1.0); 
				
				if(thisObj.cabinaCharged){
			  		
					//.......................................................................................
					/*
					let cameraVector = new THREE.Vector3(); 
					thisObj.camera.getWorldDirection(cameraVector);
					cameraVector.multiplyScalar(tal);
					thisObj.tal[0] = thisObj.camera.position.x + cameraVector.x;
					thisObj.tal[1] = thisObj.camera.position.y + cameraVector.y;
					thisObj.tal[2] = thisObj.camera.position.z + cameraVector.z;
					*/
					//.......................................................................................					
					
					
					
					//.......................................................................................
			  		if(thisObj.collisionContacts.length){
						for(let idx=0;idx<thisObj.collisionContacts.length;idx++){							
							if(thisObj.collisionContacts[idx].active){
								thisObj.collisionContacts[idx].dinamic(THREE);
							}														
						}
					}			
					//.......................................................................................					
					//.......................................................................................
			  		if(thisObj.fireContacts.length){
						for(let idx=0;idx<thisObj.fireContacts.length;idx++){							
							if(thisObj.fireContacts[idx].active){
								thisObj.fireContacts[idx].dinamic(THREE);
							}														
						}
					}			
					//.......................................................................................
								
					if(thisObj.din_ship!=null){
						thisObj.din_ship.dinamic();					
						//thisObj.camera.position.x = thisObj.din_ship.dto.position.x;
						//thisObj.camera.position.y = 500;
						//thisObj.camera.position.z = thisObj.din_ship.dto.position.z;
					}	
									  
					//.......................................................................................							  	
					thisObj.playerShip.dinamic(THREE,thisObj.scene,thisObj.camera);
					thisObj.gameScene.dinamic(THREE,thisObj.camera);
					thisObj.playerArm.dinamic(THREE,thisObj.camera,thisObj.flyControl.movementSpeed);					
					
				}//end if cabinaCharged
					
				thisObj.renderer.render( thisObj.scene,thisObj.camera );				
			}
			else {
				thisObj.renderer.setAnimationLoop(null);	
			}
		}				
		animate();
		
	}//end function

	chargeCameras(THREE) {
		this.camera = new THREE.PerspectiveCamera(45, this.monitorWidth / this.monitorHeight, 0.1, 105000);
		this.camera.position.y = 100;
		
		//ortho camera
		//this.cameraOR = new THREE.PerspectiveCamera( 55, this.monitorWidth / this.monitorHeight,1, 30000);
		//this.cameraOR.position.x = 0;	
		//this.cameraOR.position.y = 5000;
		//this.cameraOR.position.z = 0;		
		//this.cameraOR.rotation.x = RADIAN * 270;						
	}//end function
	
	chargeLights(THREE) {
	    this.scene.add( new THREE.AmbientLight( 0xffffff));    
	    
	    
	   	const directionalLight = new THREE.DirectionalLight( 0xbbbbbb );
	   	directionalLight.position.set( 5000,150,-5000 );
	   	directionalLight.castShadow = true;
	   	
	   	this.scene.add( directionalLight );
		
		//const lightF = new THREE.PointLight( 0xffeeee, 1, 300 );
		//lightF.position.set(10, 0,30  );
		//this.scene.add( lightF );
	}//end function

	chargeControls(FlyControls) {
	 	this.flyControl = new FlyControls( this.camera, this.renderer.domElement );  	
	  	this.flyControl.movementSpeed = 0.001;
	  	this.flyControl.rollSpeed = Math.PI / 720;
	  	this.flyControl.autoForward = false;
	  	this.flyControl.dragToLook = true;			  			
	}//end function
	
	//this.collisionContacts
	
	onCollisionContact(contactName,contactCoord){
		let collisionContact = new WebGLObject_fireContact(this,this.scene,contactCoord,1);
		this.collisionContacts.push(collisionContact);			
		if(contactName=='terrain'){
			this.restartTimer = new XfTimer(this,this.restartInterval,"restart");	
			this.restartTimer.run();	
		}	
		else{
			console.log(contactName);
			this.active = false;
			this.chargeControls(this.app_FlyControls);	
			this.playerShip.speedCero();
			this.playerShip.elevationCero();
			this.playerShip.warpCero();			
			this.playerShip.velocity = 0;
			this.playerShip.turnState = 'turnCero';
			this.active = true;		
			this.start(this.app_THREE);				
		}	
	}//end function
		
	reset(){
		this.active = false;	
		this.chargeCameras(this.app_THREE);
		this.chargeControls(this.app_FlyControls);	
		this.collisionContacts = [];
		this.fireContacts = [];
		this.active = true;		
		this.start(this.app_THREE);	
	}//end function
		
	onAlert(exeIndex,id ) {		
		this.restartTimer.abort();	   	
		this.restartTimer = null;		
		this.reset();
	}//end function
			
	onCollisionContactFinish(){
		console.log('onCollisionContactFinish');
		this.collisionContacts.shift();		
	}//end function
			
				
	onFireContact(contactId,contactCoord){
		//console.log('onFireContact');
		//console.log(contactId);
		let fireContact = new WebGLObject_fireContact(this,this.scene,contactCoord,1);
		this.fireContacts.push(fireContact);	
	}//end function
		
	onFireContactFinish(){
		//console.log('onFireContactFinish');
		this.fireContacts.shift();		
	}//end function
			
	onRouteEnd(id){
		console.log('onRouteEnd:');console.log(id);
		switch (id) {
	 		case 'pruebas':
				 //WebGL_threeUtil.removeObject3D(THREE,this.destroyerModel.wglObjects[0].sceneObj);
	    		break;	    		
		 	default:
	    }//end switch
	    				 
	}//end function
				
	loadTestObjects(THREE){
		
		//.....................................................................
		/*
		this.spheresF_cfTransXY = XF_Math3dCf.getCfTransXYinPlaneZ(25,16);
		this.balls = [];
		for(let ballIndex=0;ballIndex<16;ballIndex++){
			this.balls[ballIndex] 
				= WebGL_threeGenObjects.createObjectSphere(THREE,5,16,[1,0,1],[0,0,0]);
			this.scene.add(this.balls[ballIndex]);
		}	
		*/	
		//.....................................................................	 
				
		let cntTestObj = 100;
		for(let idx=0;idx<cntTestObj;idx++) {
			let boxTest = WebGL_threeGenObjects.createObjectBoxInAleatoryPosition(THREE,[0,0,0],10000,1000,25,[1,1,0])	
			boxTest.name = 'boxtest_'.concat(idx.toString());	
 			this.scene.add(boxTest); 									
		}	
		
		/*
		let cubeGeometry = new THREE.BoxGeometry(50,50,50 );
		let cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		
		let cubeA = new THREE.Mesh( cubeGeometry, cubeMaterial );
		cubeA.name = 'cuboA';
		cubeA.position.x = 100;
		cubeA.position.y = 0;	
		cubeA.position.z = 500;	
			
			
		let cubeB = new THREE.Mesh( cubeGeometry, cubeMaterial );
		cubeB.name = 'cubeB';
		cubeB.position.x = -100;
		cubeB.position.y = 0;	
		cubeB.position.z = -500;	
					
		this.scene.add(cubeA);
		this.scene.add(cubeB);
		*/
	}//end function
	
	executeFire(){
		this.playerArm.executeFire();
	}//end function	
	

	
	//....................................................................................			
	// gamepad functions
	//....................................................................................
	executeGamePadActionButton(buttonIndex) {	
		//console.log('buttonIndex');console.log(buttonIndex);
		switch(buttonIndex){
			case 7:
				this.playerArm.executeFire();
				break;
		}//end switch	
	}//end function
	
	executeGamePadActionAxis(axisIndex,axisValue) {	
		switch(axisIndex){
			
			//axis 0
			
			case 0:
				switch(axisValue){
					case 0:	this.playerShip.warpCero();break;
					case 1:	this.playerShip.warpRight();break;
					case -1:this.playerShip.warpLeft();break;			
				}//end switch					
				break;
			
			//axis 1	
			case 1:
				switch(axisValue){
					case 0:	this.playerShip.speedCero();break;
					case 1:	this.playerShip.speedDown();break;
					case -1:this.playerShip.speedUp();break;			
				}//end switch					
				break;
				
			//axis 2	
			case 2:
				switch(axisValue){
					case 0:	this.playerShip.turnCero();break;
					case 1:	this.playerShip.turnRight();break;
					case -1:this.playerShip.turnLeft();break;			
				}//end switch			
				break;
			
			//axis 3
			case 3:
				switch(axisValue){
					case 0:	this.playerShip.elevationCero();break;
					case 1:	this.playerShip.elevationDown();break;
					case -1:this.playerShip.elevationUp();break;			
				}//end switch					
				break;												
		}//end switch
	
	}//end function
		
	//....................................................................................

		//.........................................................
	// App2d functions
	//.........................................................
	startApp2d() {
		//this.render(0);
		this.onAlert(exeIndex);
		this.appTimer= new XfTimer(this,100,'generic');
		this.appTimer.run();				 
	}//end function

	/*
	onAlert(exeIndex,id) { //console.log(exeIndex);	
		this.render(exeIndex);
		//this.animal.dinamic();
	}//end function
	*/
	render(exeIndex) {
		//console.log(exeIndex);
		this.mapPaint.clearCanvas();
		this.mapPaint.renderAxis();		
		this.renderScene();						
	};//end function

	createScene() {
				
		let animalPosition = [0,0];
		this.animal = new XfEsceneLiveItem("item 1",20,new XF_Color(255,255,0,0),5,animalPosition,0);
		let ruta = XfRute2dUtil.getRuteFromCf([0,0],80,360);
		this.animal.setRute(ruta);
	}//end 		
	
	//.........................................................
	// render scene
	//.........................................................
	renderScene() {
		this.animal.dinamicInRute();
		this.mapPaint.paintObjectPivot(this.animal.pivot);		
	}//end
	//.........................................................
	
} //end class
