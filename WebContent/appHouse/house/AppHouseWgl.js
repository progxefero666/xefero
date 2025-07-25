
/**
 * class AppHouseWgl
 */
var thisAppHouseWgl = null;
class  AppHouseWgl {        
	
	//constructor	
	//..........................................................................
	constructor(app,THREE,FBXLoader,PointerLockControls) {
		this.app = app;
		this.app_THREE 	= THREE;
		thisAppHouseWgl = this;			
			
		this.objCanvas = document.getElementById("gl_canvas");
			
		this.txtLoader  = new THREE.TextureLoader();
		this.fbxLoader 	= new FBXLoader();
					
		this.player = new HousePlayer(this,1.5);
			
		this.scene = new THREE.Scene();
		//this.scene.background = new THREE.Color( 0xffffff );
		
		this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight,0.01, 10000 );//
		this.camera.position.y = 1.5;
						
		this.chargeLights(THREE); 	
		
		this.controls = new PointerLockControls( this.camera, document.body );
		this.scene.add( this.controls.getObject() );
				
		if ( this.controls.getObject().position.y < 1.5 ) {
			this.velocity.y = 0;
			this.controls.getObject().position.y = 1.5;
		}
								
		this.init(THREE);					
		this.start();									
	}//end constructor
	
	init(THREE){	

		//...............................................................................................
		window.addEventListener( 'resize', this.onWindowResize );								
		this.controls.addEventListener( 'lock', function () {
			document.getElementById( 'instructions' ).style.display = 'none';
			document.getElementById( 'blocker' ).style.display = 'none';
		});
		this.controls.addEventListener( 'unlock', function () {
			document.getElementById( 'blocker' ).style.display = 'block';
			document.getElementById( 'instructions' ).style.display = '';
			thisAppHouseWgl.app.reset();
		});
		document.addEventListener( 'keydown', this.onKeyDown );
		document.addEventListener( 'keyup', this.onKeyUp );
		//...............................................................................................					
		
			
		//...............................................................................................
		let zoomsize_width = Math.floor(XF_Math.getValuePercent( window.innerWidth,150));
		let zoomsize_height = Math.floor(XF_Math.getValuePercent( window.innerHeight,150));
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setViewport (0,0,window.innerWidth,window.innerHeight);
		this.renderer.gammaOutput = true;				
		this.renderer.shadowMap.enabled = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.autoClear = false;		
		this.renderer.alpha= true;	
		this.objCanvas.appendChild( this.renderer.domElement );
		//document.body.appendChild(this.renderer.domElement);
		this.boundingClientRect = this.renderer.domElement.getBoundingClientRect();		
		
		this.monitor = new GraphMonitor(Math.floor(this.boundingClientRect.left),
								Math.floor(this.boundingClientRect.right),
								Math.floor(this.boundingClientRect.top),
								Math.floor(this.boundingClientRect.bottom));	
										
		//...............................................................................................
		
		//...............................................................................................
		//this.dataPath = HouseManager.PATH_SCENE_COMMON;		
		//this.skybox = WebGL_sceneUtil.createSkyBox(THREE,this.dataPath.concat('skybox/'),'skybox',3000);		
		//this.scene.add(this.skybox);
				
		//this.terrain = new WebGL_groupdtos(this,this.dataPath.concat('terrain/'),'terrain');
		//this.terrain.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);
						
		//this.sceneGrpCommon = new WebGL_listdtos(this,HouseManager.PATH_SCENE_COMMON,'scene_common');
		//this.sceneGrpCommon.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,[0,0,0]);
		
		this.houseBase = new WebGL_groupdtos(this,HouseManager.PATH_SCENE_HOUSEBASE,'housebase',null);
		this.houseBase.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);						
		
		this.ironman = new WebGL_groupdtos(this,HouseManager.PATH_SCENE_HOUSEBASE,'ironman',null);
		this.ironman.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);		
				
		this.playerCharged = false;		
		
				
		this.cameraVector = new THREE.Vector3(); 		
		this.fireGunSphere = WebGL_threeGenObjects
			.createObjectSphereColor(THREE,0.01,16,new THREE.Color("rgb(0,255,0)"),[0,0,0]);//[-0.194,1.6,-0.312]
		this.scene.add( this.fireGunSphere );  		
		
		this.fireTargetSphere = WebGL_threeGenObjects
			.createObjectSphereColor(THREE,0.02,16,new THREE.Color("rgb(0,255,0)"),[0,0,0]);//[-0.194,1.6,-0.312]
		this.scene.add( this.fireTargetSphere ); 			
		//...............................................................................................
		
		//tablet
		//...............................................................................................

		//debugger;
		this.tabletCanvas = document.getElementById("map_tablet");
		this.tabletVpWidth = Math.floor(this.monitor.getSizeXByPercent(30));
		this.tabletVpHeight = this.tabletVpWidth;
		let tabletCanvasLeft 	= this.monitor.left + 10;
		let strtabletCanvasLeft= tabletCanvasLeft.toString().concat('px');				
		let tabletCanvasTop 	= this.monitor.top  + 10;
		let strtabletCanvasTop = tabletCanvasTop.toString().concat('px');			
		$('#map_tablet').width(this.tabletVpWidth);		
		$('#map_tablet').height(this.tabletVpHeight);	
		$('#wglTabletContainer').css('left',strtabletCanvasLeft);
		$('#wglTabletContainer').css('top',strtabletCanvasTop);
				
								
		this.rendererTablet = new THREE.WebGLRenderer( { antialias: true } );
		this.rendererTablet.setPixelRatio( window.devicePixelRatio );
		this.rendererTablet.setSize(this.tabletVpWidth,this.tabletVpHeight);
		this.rendererTablet.gammaOutput = true;				
		this.rendererTablet.shadowMap.enabled = true;
		this.rendererTablet.outputEncoding = THREE.sRGBEncoding;
		this.rendererTablet.alpha= true;	
		this.rendererTablet.setClearColor(0xffffff, 0);
		this.tabletCanvas.appendChild( this.rendererTablet.domElement );
		
		this.cameraTablet	= new THREE.PerspectiveCamera(50,this.tabletVpWidth/this.tabletVpHeight,0.0001,10);									
		//this.cameraTablet= new THREE.OrthographicCamera(-1.5,1.5,1.5,-1.5,0.01,5);
		this.cameraTablet.position.x = 0;	
		this.cameraTablet.position.y = 0;
		this.cameraTablet.position.z = 0.3;	
		//this.cameraTablet.rotation.y = XF_Math.RADIAN * 270;		
		this.cameraTablet.layers.set(2);
										
		this.tabletCharged = false;
		this.wglTablet = new WebGL_groupdtos(this,TabletManager.PATH_TABLET,'tablet',null);
		this.wglTablet.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);							
		//...............................................................................................
		
	}//end function	
	
	alertAllDtosCharged(id){
		switch (id) {
			case 'tablet': console.log('tablet charged');							
				for(let idx=0;idx<this.wglTablet.grdto.children.length;idx++){
					this.wglTablet.grdto.children[idx].children[0].layers.set(2);					
				}				
				this.tabletCharged = true;
				break; 		
			case 'ironman':
				this.playerCharged = true;	
				break;		   		
		 	default:
	    }//end switch		
	}//end function	
	
	start() {
		this.active = true;
		let prevTime = performance.now();
		function animate() {
			requestAnimationFrame( animate );
				
			thisAppHouseWgl.renderer.clear();
			
			const time = performance.now();
			if(thisAppHouseWgl.controls.isLocked === true ) {
				const delta = ( time - prevTime ) / 1000;
	
				thisAppHouseWgl.player.dinamic(delta);

				thisAppHouseWgl.controls.moveRight( - thisAppHouseWgl.player.velocity.x * delta );
				thisAppHouseWgl.controls.moveForward( - thisAppHouseWgl.player.velocity.z * delta );					
				//thisAppHouseWgl.controls.getObject().position.y += ( thisAppHouseWgl.velocity.y * delta );
				thisAppHouseWgl.controls.getObject().position.y = 1.5;
						
				thisAppHouseWgl.player.setPosition(thisAppHouseWgl.controls.getObject().position);
																								
			}//end if

			if(thisAppHouseWgl.playerCharged){
				WebGL_threeUtil.setObjectStateToCameraView
					(thisAppHouseWgl.app_THREE,thisAppHouseWgl.camera,thisAppHouseWgl.ironman.grdto,0.75);//0.5 0.75 1.4
			}			
					
			//..................................................................................
			let wglCamera = thisAppHouseWgl.camera.clone();
			wglCamera.getWorldDirection(thisAppHouseWgl.cameraVector);			  		
			thisAppHouseWgl.cameraVector.multiplyScalar(0.7);
			wglCamera.translateX(-0.12);
			wglCamera.translateY(-0.09);
			thisAppHouseWgl.fireGunSphere.position.x = wglCamera.position.x+ thisAppHouseWgl.cameraVector.x;
			thisAppHouseWgl.fireGunSphere.position.y = wglCamera.position.y+ thisAppHouseWgl.cameraVector.y;
			thisAppHouseWgl.fireGunSphere.position.z = wglCamera.position.z+ thisAppHouseWgl.cameraVector.z;	
			
			wglCamera = thisAppHouseWgl.camera.clone();
			wglCamera.getWorldDirection(thisAppHouseWgl.cameraVector);
			thisAppHouseWgl.cameraVector.multiplyScalar(10.0);			
			thisAppHouseWgl.fireTargetSphere.position.x = wglCamera.position.x+ thisAppHouseWgl.cameraVector.x;
			thisAppHouseWgl.fireTargetSphere.position.y = wglCamera.position.y+ thisAppHouseWgl.cameraVector.y;
			thisAppHouseWgl.fireTargetSphere.position.z = wglCamera.position.z+ thisAppHouseWgl.cameraVector.z;										
			//..................................................................................
							
			prevTime = time;
			thisAppHouseWgl.renderer.setViewport (0,0,window.innerWidth,window.innerHeight);
			thisAppHouseWgl.renderer.render(thisAppHouseWgl.scene,thisAppHouseWgl.camera);
									
			/*					
			if(thisAppHouseWgl.tabletCharged){
				thisAppHouseWgl.rendererTablet.clear();
				thisAppHouseWgl.rendererTablet.render(thisAppHouseWgl.scene,thisAppHouseWgl.cameraTablet);
			}
			*/				
		}//end function		
		
		animate();
		
	}//end function		

		
	chargeLights(THREE) {
		//this.scene.add( new THREE.AmbientLight( 0xffffff, 0.5));    
		
		const lightF1 = new THREE.PointLight( 0xffffff, 1.0, 30 );
		lightF1.position.set(0,2,4);
		this.scene.add( lightF1 );
		
		/*
		const lightF1 = new THREE.PointLight( 0xffffff, 1.0, 30 );
		lightF1.position.set(-13,7,4);
		lightF1.shadowCameraVisible = true;
		lightF1.shadowDarkness = 0.70;
		lightF1.castShadow = true;

		const lightF2 = new THREE.PointLight( 0xffffff, 1.0, 30 );
		lightF2.position.set(13,7,4);
		lightF2.shadowCameraVisible = true;
		lightF2.shadowDarkness = 0.70;
		lightF2.castShadow = true;
				
		this.scene.add( lightF1 );		
	    this.scene.add( lightF2 );
	    */	
	    let tabletLight = new THREE.AmbientLight( 0xffffff, 1.0);	
	    tabletLight.layers.set(2);
	    this.scene.add( tabletLight );
	    		
		/*13 7
		let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
		light.position.set( 0.5, 1, 0.75 );
		this.scene.add( light );
		*/
	}//end function	
		
	onWindowResize() {
		thisAppHouseWgl.camera.aspect = window.innerWidth / window.innerHeight;
		thisAppHouseWgl.camera.updateProjectionMatrix();
		thisAppHouseWgl.renderer.setSize( window.innerWidth, window.innerHeight );
	}//end function	
		
	onKeyDown( event ) {
	
		switch ( event.code ) {
			case 'ArrowUp':
			case 'KeyW':
				thisAppHouseWgl.player.moveForward = true;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				thisAppHouseWgl.player.moveLeft = true;
				break;
			case 'ArrowDown':
			case 'KeyS':
				thisAppHouseWgl.player.moveBackward = true;
				break;
			case 'ArrowRight':
			case 'KeyD':
				thisAppHouseWgl.player.moveRight = true;
				break;
		}//end switch
	}//end function

	onKeyUp( event ) {
		
		switch ( event.code ) {
			case 'ArrowUp':
			case 'KeyW':
				thisAppHouseWgl.player.moveForward = false;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				thisAppHouseWgl.player.moveLeft = false;
				break;
			case 'ArrowDown':
			case 'KeyS':
				thisAppHouseWgl.player.moveBackward = false;
				break;
			case 'ArrowRight':
			case 'KeyD':
				thisAppHouseWgl.player.moveRight = false;
				break;
		}//end switch
	}//end function

						
}//end class