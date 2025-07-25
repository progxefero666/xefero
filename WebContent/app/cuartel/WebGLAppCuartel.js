/**
 * class WebGLAppCuartel
 */

var thisObj = null;
var controls = null;

class  WebGLAppCuartel {        
	
	//constructor	
	//..........................................................................
	constructor(objCanvas,monitorWidth,monitorHeight,THREE,FBXLoader,OrbitControls) {
		this.monitorWidth = monitorWidth;
		this.monitorHeight = monitorHeight;
	
		//charge Three WebGlMonitor
		//.....................................................................		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.antialias  = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( monitorWidth, monitorHeight);	
		this.renderer.gammaOutput = true;				
		this.renderer.shadowMap.enabled = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		objCanvas.appendChild( this.renderer.domElement );
		
		this.boundingClientRect = this.renderer.domElement.getBoundingClientRect();		
		this.active = false;
		this.txtLoader = new THREE.TextureLoader();
		this.fbxLoader 	= new FBXLoader();
		
		//create scene
		//.....................................................................
		this.scene = new THREE.Scene();				
		this.scene.background = this.txtLoader.load( 'data/cuartel/skybox_ft.jpg' );				
		this.chargeLights(THREE);
		this.init(THREE,OrbitControls);
		
	}//end constructor

	init(THREE,OrbitControls) {
		this.app_THREE  = THREE;
		this.mousePointer = new THREE.Vector2();
		this.mousePointer.x = -1;
		this.mousePointer.y = -1;
		
		//garage
		// @ts-ignore
		this.garage = new WebGL_listdtos(this,'gamecar/garage/','garage');
		this.garage.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,[0,0,0]);
						
		//this.car = new WebGL_groupdtos(this,'gamecar/cars/Mercedes/','car',null);
		//this.car.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);	
			
		//this.car = new WebGL_groupdtos(this,'gamecar/cars/AstonMartin/','car',null);
		//this.car.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);	
													
		// @ts-ignore
		this.xwing = new WebGL_groupdtos(this,'data/game/player/ship/','xwing','xwing1');
		this.xwing.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,[0,10,0]);	
														
		let ortho = false;		
		if(ortho){
			this.camera = new THREE.PerspectiveCamera( 50, this.monitorWidth / this.monitorHeight, 0.1, 10000);
			this.camera.position.x = 0;	
			this.camera.position.y = 2000;
			this.camera.position.z = 0;		
			// @ts-ignore
			this.camera.rotation.x = RADIAN * 270;			
		}
		else {
			this.camera = new THREE.PerspectiveCamera( 50, this.monitorWidth / this.monitorHeight, 0.1, 160000);
			this.camera.position.x = 0;
			this.camera.position.y = 2;	
			this.camera.position.z = 5;		
			//this.camera.rotation.y = RADIAN * 90;	
		}
											
		this.controls = new OrbitControls( this.camera, this.renderer.domElement );	
		this.start(THREE);

	}//end function
				
	onPointerMove(event){
		let coordX = ( ( event.clientX - this.boundingClientRect.left ) / 
					 ( this.boundingClientRect.right - this.boundingClientRect.left ) ) * 2 - 1;
		let coordY =  - ( ( event.clientY - this.boundingClientRect.top ) /
					 ( this.boundingClientRect.bottom - this.boundingClientRect.top) ) * 2 + 1;
		this.mousePointer.x = coordX;
		this.mousePointer.y = coordY;
	}//end function	

	onRouteEnd(THREE,id){
		console.log('onRouteEnd:');console.log(id);
		switch (id) {
	 		case 'pruebas':
				 // @ts-ignore
				 WebGL_threeUtil.removeObject3D(THREE,this.destroyerModel.wglObjects[0].sceneObj);
	    		break;	    		
		 	default:
	    }//end switch
	    				 
	}//end function
	
	onFireContactFinish(){
		console.log('onFireContactFinish');
		this.fireContact = null;
	}//end function
	
	alertAllDtosCharged(id){
		switch (id) {
			case 'car':
				console.log('car loaded');
				break;    		
		 	default:
	    }//end switch		
	}//end function	
			
	// @ts-ignore
	alertGroupCharged(scene,webglGroup,id){		

		scene.add(webglGroup);
	}//end function

	// @ts-ignore
	start(THREE) {
		this.active = true;
		thisObj = this;				
		function animate() {
			if(thisObj.active){
				requestAnimationFrame( animate );		
				//thisObj.controls.update(0.01)		
				/*
				if(thisObj.tie.ring!=null){										
					thisObj.tie.ring.lookAt (thisObj.camera.position);					
					thisObj.tie.rotation = thisObj.camera.rotation.clone();								
					//thisObj.tie.ring.rotateZ(Math.PI/4);
				}
				*/
				thisObj.renderer.render( thisObj.scene,thisObj.camera );				
			}
			else {//console.log('active false');
				thisObj.renderer.setAnimationLoop(null);	
			}
		}
		animate();	
	}//end function

	
	chargeLights(THREE) {
	    this.scene.add( new THREE.AmbientLight( 0xffffff));    
	    	    
	   	const directionalLight = new THREE.DirectionalLight( 0xffffff );
	   	directionalLight.position.set( 10,2,-10 );
	   	//directionalLight.castShadow = true;
	   	this.scene.add( directionalLight );	    
	
	   	
	    //const lightF = new THREE.PointLight( 0xffffff, 0.5, 300 );
		//lightF.position.set(250,150,250 );
		//this.scene.add( lightF );		
	    
	    //const lightB = new THREE.PointLight( 0xffeeee, 1, 300 );
		//lightF.position.set(-100, 0,0  );
		//this.scene.add( lightB );		
				
	}//end function

	//this.impshuttle = new WebGL_groupdtos(this,'data/game/ship/impshuttle/','impshuttle');
	//this.impshuttle.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);		
	//this.xwing = new WebGL_groupdtos(this,'data/game/player/ship/','xwing','xwing1');
	//this.xwing.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,[0,10,0]);										
	//this.tie = new WebGL_groupdtos(this,'data/game/ship/tie/','tie');
	//this.tie.loadWglObjects(THREE,this.scene,thisthis.objLoader = .fbxLoader,this.txtLoader,[0,15,0]);
	//WebGL_util.captureImageData(this,'data/cuartel/terrain.jpg');
	
	/*	
	onCaptureImageData(imgData){
		console.log('onCaptureImageData start');	
		
		let terrainHeightMax = 20;
		let countRows = imgData.height;
		let countCols = imgData.width;
		let data = [];
		let dataIndex = 0;
		for (let rowIndex=0;rowIndex<countRows;rowIndex++) {
			data[rowIndex] = [];
			for (let colIndex=0;colIndex<countCols;colIndex++) {	
				let elemRGBA = [];				
				for (let coordIndex=0;coordIndex<4;coordIndex++) {
					elemRGBA[coordIndex] = imgData.data[dataIndex];
					dataIndex++;
				}
				let percentWhite = XF_Math.getPercent(255,elemRGBA[0]);
				let percentBlack = 100-percentWhite;
				let valueHeight = XF_Math.getValuePercent(terrainHeightMax,percentBlack);
				data[rowIndex][colIndex] = valueHeight;
			}
		}//end for
		
		console.log('onCaptureImageData end');	
		
		this.terrain = new WebGL_terrain(this,'data/cuartel/','terrain',data);
		this.terrain.loadWglObject(this.app_THREE,this.scene,this.fbxLoader,this.txtLoader,null);

		
	}//end function	
	*/				
}//end class