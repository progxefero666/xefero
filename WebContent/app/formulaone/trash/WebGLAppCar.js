/**
 *  WebGL Application Acuario
 */

 var thisObj = null;
var controls = null;

class  WebGLAppCar {        
	
	//constructor	
	//..........................................................................
	constructor(objCanvas,monitorWidth,monitorHeight,THREE,FBXLoader,OBJLoader,MTLLoader,OrbitControls,gamePad) {

		this.objCanvas = objCanvas;
		this.monitorWidth = monitorWidth;
		this.monitorHeight = monitorHeight;
	
		this.gamePadControl = new GamepadControl(this,gamePad);
		this.listenButtonsUnpressed = true;
		//charge Three WebGlMonitor
		//.....................................................................		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.antialias  = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( monitorWidth, monitorHeight);				
		this.objCanvas.appendChild( this.renderer.domElement );
		
		
		this.boundingClientRect = this.renderer.domElement.getBoundingClientRect();

		thisObj = this;
		this.active = false;
		this.gameReady = false;			
		this.initPlayerCoordY = 1;
		
		//create scene
		//.....................................................................
		this.scene = new THREE.Scene();
		//this.scene.background = new THREE.Color("rgb(110, 172,255)");
		//this.scene.background = new THREE.Color("rgb(10, 10,10)");
		//this.scene.background = new THREE.Color("rgb(0,0,0)");					
		this.init(THREE,FBXLoader,OBJLoader,MTLLoader,OrbitControls);
		
	}//end constructor


	init(THREE,FBXLoader,OBJLoader,MTLLoader,OrbitControls) {
		this.app_THREE = THREE;
		this.txtLoader = new THREE.TextureLoader()
		this.fbxLoader = new FBXLoader();
		this.objLoader = new OBJLoader();
		this.mtlLoader = new MTLLoader();
		
		//prepare lights
		//.....................................................................
		this.chargeLights(THREE);
				
		//debugger;
		//this.cameraB = new THREE.PerspectiveCamera(35, this.monitorWidth / this.monitorHeight, 0.001, 150000);		
			
						
		//this.cityDtos = new WebGL_groupdtos(this,'data/game//city/','city');
		//this.cityDtos.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);	
	
		//prepare camera controls
		//.....................................................................						
		this.camera = new THREE.PerspectiveCamera(35, this.monitorWidth / this.monitorHeight, 0.001, 150000);
		//this.camera.layers.enableAll();
				
		this.gameRoad = new GameCarRoad(this);
		this.gameScene = new GameCarScene(this);		
		this.player  = new CarPlayer(this,2);
		this.controlRace = new GameCarRaceControl(this);
		this.active = true;		
		this.recordTrack = false;
		
		this.controls = new OrbitControls( this.camera, this.renderer.domElement );	
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
					thisObj.player.dinamic(THREE,thisObj.camera);
					thisObj.gameScene.dinamic(THREE,thisObj.camera);	
					thisObj.controlRace.dinamic();
					if(thisObj.recordTrack){
						//thisObj.player.recordStep();
						thisObj.player.recordRoadStep();						
					}
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
			case 'city':
				console.log('city loaded');
				break;			
			case 'audi':
				//this.player  = new CarPlayer(this,this.car.grdto);
				//this.player.configure(this.app_THREE,[300,0,0]);
				//this.gameReady = true;										
				break;	
	 		case 'xwing':
				console.log('xwing loaded');
				this.xwing.grdto.scale.set(30,30,30);
				this.xwing.grdto.rotation.y = Math.PI;		
	    		break;				    				
		 	default:
	    }//end switch		
	}//end function	

	//....................................................................................			
	// gamepad functions
	//....................................................................................
	executeGamePadActionButtonUnpressed(buttonIndex) {	
		switch(buttonIndex){
			/*
			case 4:	break;		
			case 5:	break;			
			case 6:	break;	
			*/				
			case 7:
				this.player.speedCero();
				break;
		}//end switch		
	}//end function	
	
	executeGamePadActionButton(buttonIndex) {	
		
		switch(buttonIndex){		
			case 3:	
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

	
	chargeLights(THREE) {
	    this.scene.add( new THREE.AmbientLight( new THREE.Color("rgb(150,150,150)"))); 	   
	    
	   	const directionalLight = new THREE.DirectionalLight( new THREE.Color("rgb(150,150,150)"));
	   	directionalLight.position.set( 1000,80,-5000 );
	    directionalLight.castShadow = true;
	   	this.scene.add( directionalLight );	    
	   		     
	    //const lightF = new THREE.PointLight( 0xffffff, 1, 200 );
		//lightF.position.set(0, 100, 50  );
		//this.scene.add( lightF );
	}//end function
		
	//setTimeout(function () {animate();},100);		
			
	/*
	//var start = new Date().getTime();
	//var frameIndex = 0;			
		frameIndex++;
		if(frameIndex==60){
			frameIndex = 0;
			let elapsed = new Date().getTime() - start;
			console.log(elapsed);
			start = new Date().getTime();
		}
	*/
			
}//end class