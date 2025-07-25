/**
 *  WebGL Application Acuario
 */

 var thisObj = null;
var controls = null;

class  WebGLAppDoom {        
	
	//constructor	
	//..........................................................................
	constructor(objCanvas,monitorWidth,monitorHeight,THREE,FBXLoader,FirstPersonControls,PointerLockControls,gamePad) {

		this.objCanvas = objCanvas;
		this.monitorWidth = monitorWidth;
		this.monitorHeight = monitorHeight;
	
		// @ts-ignore
		this.gamePadControl = new GamepadControl(this,gamePad);
		this.listenButtonsUnpressed = false;
	
		//charge Three WebGlMonitor
		//.....................................................................		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.antialias  = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize(this.monitorWidth,this.monitorHeight);	
		this.renderer.gammaOutput = true;
		this.renderer.autoClear = false;				
		this.renderer.alpha= true;
		this.renderer.shadowMapEnabled = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		
		this.renderer.setSize( monitorWidth, monitorHeight);				
		this.objCanvas.appendChild( this.renderer.domElement );
		this.boundingClientRect = this.renderer.domElement.getBoundingClientRect();

		thisObj = this;
		this.active = false;
		this.executeRender = false;
					
		this.initPlayerCoordY = 1;
		
		//create scene
		//.....................................................................
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color("rgb(110, 172,255)");
		//this.scene.background = new THREE.Color("rgb(10, 10,10)");
		//this.scene.background = new THREE.Color("rgb(0,0,0)");					
		this.init(THREE,FBXLoader,FirstPersonControls,PointerLockControls);
		
	}//end constructor


	// @ts-ignore
	init(THREE,FBXLoader,FirstPersonControls,PointerLockControls) {
		this.app_THREE = THREE;
		this.txtLoader = new THREE.TextureLoader()
		this.fbxLoader = new FBXLoader();
		
		//prepare lights
		//.....................................................................
		this.chargeLights(THREE);
				
		// @ts-ignore
		this.blaster = new WebGL_groupdtos(this,'data/doom/player/blaster/','blaster','blaster');			
		this.blaster.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);
	
		// @ts-ignore
		this.atat = new WebGL_groupdtos(this,'data/doom/enemy/atat/','atat','atat');			
		this.atat.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,[0,0,-2000]);
		
		//this.torretaA = new GameEnemyTorret(this,GameEnemyTorrets.TORRET_A,[0,130,-500]);
		//this.torretaA.generate(THREE,this.scene,this.fbxLoader,this.txtLoader);
					
		// @ts-ignore
		this.enemy_1 = new GameEnemySoldier(this,GameEnemySoldiers.BATTLEDROID,GameEnemySoldiers.TYPE_SINGLE,1,[0,0,-160]);
		this.enemy_1.generate(THREE,this.scene,this.fbxLoader,this.txtLoader);

	
		//prepare camera controls
		//.....................................................................						
		this.camera = new THREE.PerspectiveCamera(45, this.monitorWidth / this.monitorHeight, 0.001, 105000);
		this.camera.position.y = 67.0;	
		this.camera.position.z = 20.0;	
		this.chargeControls(FirstPersonControls);
	
		this.camera.layers.enableAll();
		
		this.sceneChildrensEnemy = [];
		this.fireContacts = [];
		// @ts-ignore
		this.gameScene = new GameScene(this);
		this.gameScene.init(THREE);
		this.active = true;
		this.gameReady = false;
		this.start(THREE);		
	}//end function
		
	updateControlGamePad(gamePad){
		this.gamePadControl.gamePad = gamePad;
		this.gamePadControl.process();
	}//end function
			
	start(THREE) {		
		thisObj = this;				
		function animate() {
			if(thisObj.active){
				requestAnimationFrame( animate );												
				if(thisObj.gameReady){					
				 	thisObj.firstPersonControls.update(1.0);		
					//thisObj.camera.rotation.z = 0;
					//......................................................................................
			  		if(thisObj.fireContacts.length){
						for(let idx=0;idx<thisObj.fireContacts.length;idx++){							
							if(thisObj.fireContacts[idx].active){
								thisObj.fireContacts[idx].dinamic(THREE);
							}														
						}
					}			
					//.......................................................................................
					//thisObj.enemy_1.dinamic(THREE);	
					thisObj.gameScene.dinamic(THREE);	
					thisObj.playerGun.dinamic(THREE,thisObj.camera);
					thisObj.player.dinamic(THREE,thisObj.camera,thisObj.playerGun.targetCoord3d);
				}
				
				thisObj.renderer.render( thisObj.scene,thisObj.camera );		
			}
			else {
				thisObj.renderer.setAnimationLoop(null);	
			}
		}
		animate();
	}//end function		
	
	alertAllDtosCharged(id){

		switch (id) {
			case 'blaster':
				//this.blaster.setLayer(1);
				// @ts-ignore
				this.player  = new DoomPlayer(this,this.blaster.grdto);
				// @ts-ignore
				this.playerGun  = new GamePlayerGun(this);
				this.playerGun.init(this.app_THREE);
				this.gameReady = true;
				break;			
	 		case 'battledroid':				 
				// @ts-ignore
				this.gameScene.addTargetSimple(this.battledroid.dtos[0]);				 
				 break;	    				
		 	default:
	    }//end switch		
	}//end function	

	//....................................................................................			
	// gamepad functions
	//....................................................................................
	executeGamePadActionButton(buttonIndex) {	
		switch(buttonIndex){
			case 5:
				this.enemy_1.executeFire();
				break;			
			case 7:
				this.playerGun.executeFire();
				break;
		}//end switch	
	}//end function
			
	executeGamePadActionAxis(axisIndex,axisValue) {	
		
		switch(axisIndex){			
			//axis 0			
			case 0:
				switch(axisValue){
					case 0:	this.player.moveZeroLR();break;
					case 1:	this.player.moveDerecha();break;
					case -1:this.player.moveIzquierda();break;			
				}//end switch					
				break;
			
			//axis 1	
			case 1:
				switch(axisValue){
					case 0:	this.player.moveZeroFB();break;
					case 1:	this.player.moveBack();break;
					case -1:this.player.moveFront();break;			
				}//end switch					
				break;
				
			//axis 2
			case 2:
				switch(axisValue){
					case 0:	this.player.girarZero();	break;
					case 1:	this.player.girarDerecha();break;
					case -1:this.player.girarIzquierda();break;			
				}//end switch			
				break;			
			
			//axis 3
			case 3:
				switch(axisValue){
					case 0:	this.player.viewZero();	break;
					case 1:	this.player.viewDown();break;
					case -1:this.player.viewUp();break;			
				}//end switch					
				break;											
		}//end switch		
		
	}//end function			

	
	chargeControls(FirstPersonControls){
		this.firstPersonControls = new FirstPersonControls( this.camera,this.renderer.domElement );  
	  	this.firstPersonControls.movementSpeed = 1;
	  	this.firstPersonControls.rollSpeed = Math.PI / 3600;
	  	this.firstPersonControls.autoForward = false;
	  	this.firstPersonControls.dragToLook = true;	
	}//end function	
	
	chargeLights(THREE) {
	    this.scene.add( new THREE.AmbientLight( new THREE.Color("rgb(250,250,250)"))); 
	    
	    /*
	    const lightF = new THREE.PointLight( 0xffffff, 1, 00 );
		lightF.position.set(0, 100, 50  );
		this.scene.add( lightF );

	    const lightB = new THREE.PointLight( 0xffffff, 1, 300 );
		lightB.position.set(25, 100, -50  );
		this.scene.add( lightB );
		*/
	}//end function
			
	// @ts-ignore
	onFireContact(contactId,contactCoord){
		//console.log('onFireContact');
		//console.log(contactId);
		// @ts-ignore
		let fireContact = new WebGLObject_fireContact(this,this.scene,contactCoord,1);
		// @ts-ignore
		this.fireContacts.push(fireContact);	
	}//end function
		
	onFireContactFinish(){
		//console.log('onFireContactFinish');
		// @ts-ignore
		this.fireContacts.shift();		
	}//end function
	
	/*
	chargeControls(PointerLockControls){
		this.pointerLockControls = new PointerLockControls( this.camera,this.renderer.domElement );  
	  	//this.pointerLockControls.movementSpeed = 1;
	  	//this.pointerLockControls.rollSpeed = Math.PI / 3600;
	}//end function
	*/		
}//end class