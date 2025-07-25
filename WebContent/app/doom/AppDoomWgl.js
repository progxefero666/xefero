// @ts-nocheck
/**
 * class AppDoomWgl
 */

var thisAppDoomWgl = null;
var controls = null;

class AppDoomWgl {        
	
	//constructor	
	//..........................................................................
	constructor(app,objCanvas,monitorWidth,monitorHeight,THREE,FBXLoader) {
		this.app = app;
		this.app_THREE 	 	= THREE;	
		this.monitorWidth 	= monitorWidth;
		this.monitorHeight 	= monitorHeight;	
		this.txtLoader 		= new THREE.TextureLoader();
		this.fbxLoader 		= new FBXLoader();		
		thisAppDoomWgl		= this;
		
			
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
		
		objCanvas.appendChild(this.renderer.domElement);
		
		this.boundingClientRect = this.renderer.domElement.getBoundingClientRect();		
		this.monitor = new GraphMonitor(Math.floor(this.boundingClientRect.left),
										Math.floor(this.boundingClientRect.right),
										Math.floor(this.boundingClientRect.top),
										Math.floor(this.boundingClientRect.bottom));			
		
		this.scene 		= new THREE.Scene();
		this.active = false;
		
		this.camera = new THREE.PerspectiveCamera( 50, this.monitorWidth / this.monitorHeight, 0.1, 10000);
		this.camera.position.x = -1.5;	
		this.camera.position.y = 1.6;
		this.camera.position.z = 0;		
		this.camera.rotation.y = XF_Math.RADIANS_270;
		
		this.sceneCamera = new THREE.PerspectiveCamera( 50, this.monitorWidth / this.monitorHeight,1.0, 10000);
		
		this.skybox = WebGL_sceneUtil.createSkyBox(THREE,DoomManager.PATH_SKY,'skybox',3000);		
		this.scene.add(this.skybox);
				
		this.chargeLights(THREE);
		this.init(THREE);		
	}//end constructor
	
	init(THREE){

		//this.houseBase = new WebGL_groupdtos(this,DoomManager.PATH_SCENE_HOUSEBASE,'housebase',null);
		//this.houseBase.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);		
				
		//this.city = new WebGL_listdtos(this,DoomManager.PATH_CITY,'city');
		//this.city.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null)
						
		//this.ironman = new WebGL_groupdtos(this,DoomManager.PATH_PLAYER,'ironman',null);
		//this.ironman.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);
		
		//this.ironman = new 	WebGL_dto(this,DoomManager.PATH_PLAYER,'ironman');
		//this.ironman.loadWglObject(THREE,this.scene,this.fbxLoader,this.txtLoader,null);	
		
		this.terrainElements = new WebGL_listdtos(this,DoomManager.PATH_TERRAIN,'terrainelements');
		this.terrainElements.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);		
						
		this.ironman = new 	WebGL_morphdto(this,DoomManager.PATH_PLAYER,'playerwalker');
		this.ironman.loadWglObjects(THREE,this.scene,this.fbxLoader,this.txtLoader,null);	
									
	}//end function
	
	alertAllDtosCharged(id){
		switch (id) {
			case 'terrainelements':
				this.terrain = new WebGL_listdtos(this,DoomManager.PATH_TERRAIN,'terrain');
				this.terrain.loadWglObjects(this.app_THREE,this.scene,this.fbxLoader,this.txtLoader,null);				
				break; 	
			case 'terrain': 
				this.controlScene = new DoomControlScene(this,this.terrain.dtos,this.terrainElements.dtos);							
				break; 		
			case 'playerwalker': 
			 	//this.player = new DoomPlayer(this,this.ironman.dto);
			 	this.player = new DoomPlayer(this,this.ironman.dtos);
				this.start();
				break; 				   		
		 	default:
	    }//end switch		
	}//end function	
		
	start() {
		this.active = true;				
		function animate() {
			if(thisAppDoomWgl.active){
				requestAnimationFrame( animate );		
				thisAppDoomWgl.renderer.clear();
				
				thisAppDoomWgl.player.dinamic();
				//thisAppDoomWgl.renderer.render(thisAppDoomWgl.scene,thisAppDoomWgl.camera );	

				//thisAppDoomWgl.sceneCamera.position.x = thisAppDoomWgl.player.position[0];	
				//thisAppDoomWgl.mapCamera.position.y = 10;	
				//thisAppDoomWgl.sceneCamera.position.z = thisAppDoomWgl.player.position[2];	
				thisAppDoomWgl.renderer.render(thisAppDoomWgl.scene,thisAppDoomWgl.sceneCamera );				
							
			}
			else {
				thisObj.renderer.setAnimationLoop(null);	
			}
		}
		animate();	
	}//end function	
	
	chargeLights(THREE) {
		//this.scene.add( new THREE.AmbientLight( 0xffffff, 0.4));    
		
		this.scene.add(new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ) );    
	    
	    
	    const directionalLight = new THREE.DirectionalLight( new THREE.Color("rgb(150,150,150)"), 0.5);
	   	directionalLight.position.set(1000,1,1000);
	    directionalLight.castShadow = true;
	   	this.scene.add( directionalLight );	    
	   			
		const lightF1 = new THREE.PointLight( 0xffffff, 1.0, 30 );
		lightF1.position.set(0,2,0);
		this.scene.add( lightF1 )
				
	}//end function
		
}//end class	