/**
 *  class WebGLAppRace
 */

var thisObj = null;
var controls = null;

class  WebGLAppRace {        
	
	//constructor	
	//..........................................................................
	constructor(objCanvas,monitorWidth,monitorHeight,
				mapCanvas,mapMonitorWidth,mapMonitorHeight,
				THREE,FBXLoader,OrbitControls,gamePad) {

		this.mapCanvas = mapCanvas;
		this.mapMonitorWidth = mapMonitorWidth;
		this.mapMonitorHeight = mapMonitorHeight;
		
		this.objCanvas = objCanvas;
		this.monitorWidth = monitorWidth;
		this.monitorHeight = monitorHeight;
	
		// @ts-ignore
		this.gamePadControl = new GamepadControl(this,gamePad);
		this.listenButtonsUnpressed = true;
		
		//charge Three Map WebGLRenderer
		//.....................................................................				
		this.rendererMap = new THREE.WebGLRenderer();
		this.rendererMap.antialias  = true;
		this.rendererMap.setPixelRatio( window.devicePixelRatio );
		this.rendererMap.setSize( mapMonitorWidth, mapMonitorHeight);	
		this.rendererMap.gammaOutput = true;				
		this.rendererMap.shadowMap.enabled = true;
		this.rendererMap.outputEncoding = THREE.sRGBEncoding;
		this.mapCanvas.appendChild( this.rendererMap.domElement );
				
		//charge Three WebGLRenderer
		//.....................................................................				
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.antialias  = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( monitorWidth, monitorHeight);	
		this.renderer.gammaOutput = true;				
		this.renderer.shadowMap.enabled = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.objCanvas.appendChild( this.renderer.domElement );

		thisObj = this;
		this.active = false;
		this.gameReady = false;			
	
		this.scene = new THREE.Scene();	
		this.chargeLights(THREE);			
		this.init(THREE,FBXLoader,OrbitControls);
		
	}//end constructor

	init(THREE,FBXLoader,OrbitControls) {
		this.app_THREE = THREE;
		this.txtLoader = new THREE.TextureLoader()
		this.fbxLoader = new FBXLoader();					
		this.camera	= new THREE.PerspectiveCamera(60, this.monitorWidth / this.monitorHeight, 0.5, 5000);		
		
		this.camera.layers.enable(0);
		this.camera.layers.enable(1);
				
		//camera.layers.toggle( 0 );		
		//this.orthocamera = new THREE.PerspectiveCamera( 50, this.monitorWidth / this.monitorHeight, 0.1, 150);
		
		this.orthocamera = new THREE.OrthographicCamera(-160,160,160,-160,0.01,510);
		this.orthocamera.layers.enable(0);
		//this.orthocamera.layers.enable(1);
		
		this.orthocamera.position.x = 0;	
		this.orthocamera.position.y = 500;
		this.orthocamera.position.z = 0;		
		// @ts-ignore
		this.orthocamera.rotation.x = RADIAN * 270;		
			
		// @ts-ignore
		this.controlTeams = new TeamsControl();		
				
		// @ts-ignore
		this.gameScene 	= new RaceEscenaryControl(this,'abudabi');
		// @ts-ignore
		this.gameRoad  	= new RaceRoadControl(this,'abudabi');				
		// @ts-ignore
		this.controlRace= new RaceControl(this,'abudabi');				
		// @ts-ignore
		this.player  	= new CarPlayer(this,'RedBull','A');
		this.controlRace.init(THREE);
		// @ts-ignore
		this.playerControls = new CarPlayerControls(this);
		this.controls 	= new OrbitControls( this.camera, this.renderer.domElement );	
		this.active 	= true;
		this.recordTrack = false;
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
					thisObj.player.dinamic(THREE,thisObj.camera,thisObj.orthocamera);			
					
					if(thisObj.recordTrack){
						//thisObj.player.recordStep();
						thisObj.player.recordRoadStep();						
					}					
					//thisObj.playerControls.dinamic(THREE,thisObj.camera);	
					thisObj.controlRace.dinamic(THREE,thisObj.camera);					
					//thisObj.gameScene.dinamic();
									
				}					
				thisObj.renderer.render( thisObj.scene,thisObj.camera );	
				//thisObj.rendererMap.render( thisObj.scene,thisObj.orthocamera );						
			}
			else {
				thisObj.renderer.setAnimationLoop(null);	
			}
		}
		animate();
	}//end function			

	chargeLights(THREE) {
	    this.scene.add( new THREE.AmbientLight( new THREE.Color("rgb(150,150,150)"))); 	   
		this.scene.add(new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );    
	    
	    
	    const directionalLight = new THREE.DirectionalLight( new THREE.Color("rgb(150,150,150)"), 0.5);
	   	directionalLight.position.set(100,1,-50 );
	    directionalLight.castShadow = true;
	   	this.scene.add( directionalLight );	    
	    
	    //const lightF = new THREE.PointLight( 0xffffff, 1, 200 );
		//lightF.position.set(0, 100, 50  );
		//this.scene.add( lightF );
	}//end function
	
	//....................................................................................			
	// gamepad functions
	//....................................................................................
	executeGamePadActionButtonUnpressed(buttonIndex) {	
		//console.log(buttonIndex);
		switch(buttonIndex){			
			/*
			case 4:	break;		
			case 5:	break;
			*/		
			case 6:	
				this.player.desactivateBrakes();
				break;	
						
			case 7:
				this.player.speedCero();
				break;
		}//end switch		
	}//end function	
	
	executeGamePadActionButton(buttonIndex) {	
		
		switch(buttonIndex){		
			case 3:	
				console.log('start');
				this.gameReady = true;
				break;					
			case 5:				
				//this.gameScene.executeTest();
				if(!this.recordTrack){
					console.log('begin record');
					this.recordTrack = true;
				}
				else {
					this.recordTrack = false;
					console.log('stop record');
					//this.player.outputCarTrack();
					this.player.outputRoadTrack();
				}
				break;			
			case 4:				
				this.player.moveBack();
				break;		
			case 6:
				this.player.speedDown();
				break;					
			case 7:
				this.player.speedUp();
				break;
		}//end switch	
	}//end function
		
	executeGamePadActionAxis(axisIndex,axisValue) {			
		
		if(axisIndex==0){
			if(axisValue==0){
				this.player.girarZero();
			}
			else {
				if(axisValue>0){
					this.player.girarDerecha();
				}
				else {
					this.player.girarIzquierda();
				}
			}
		}	
		
	}//end function			
		
	/*		
	executeGamePadActionAxis(axisIndex,axisValue) {			
		switch(axisIndex){			
			//axis 0						
			case 0:				
				switch(axisValue){
					case 0:	this.player.girarZero();	break;
					case 1:	this.player.girarDerecha();break;
					case -1:this.player.girarIzquierda();break;				
				}//end switch					
				break;								
		}//end switch		
		
	}//end function			
	*/
			
}//end class