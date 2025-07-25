// @ts-nocheck
/**
 *  WebGL Application Acuario
 */

 var thisObj = null;
var controls = null;

class  WebGLAppWoman {        
	
	//constructor	
	//..........................................................................
	constructor(objCanvas,monitorWidth,monitorHeight,THREE,FBXLoader,FlyControls,OrbitControls) {

		this.monitorWidth = monitorWidth;
		this.monitorHeight = monitorHeight;
	

		//charge Three WebGlMonitor
		//.....................................................................		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( monitorWidth, monitorHeight);				
		objCanvas.appendChild( this.renderer.domElement );	
		
		this.active = false;
		this.executeRender = false;
					
		//create scene
		//.....................................................................
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color("rgb(110, 172,255)");
		//this.scene.background = new THREE.Color("rgb(10, 10,10)");
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
		var groundTexture = new THREE.TextureLoader().load('data/textures/terrain.png');
		var groundNormalTexture = new THREE.TextureLoader().load('data/textures/terrain_normal.png');
		
		var groundMaterial = new THREE.MeshPhongMaterial();
		groundMaterial.map= groundTexture;
		groundMaterial.bumpMap= groundNormalTexture;
	
		var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ), groundMaterial );
		mesh.position.y = -55.0;
		mesh.rotation.x = - Math.PI / 2;
		mesh.receiveShadow = true;
		this.scene.add( mesh );		
		*/
		//load universo
		//.....................................................................
		var fbxLoader = new FBXLoader();

		this.biped = new XfBiped(this,'woman');
		this.biped.init(THREE,this.scene,fbxLoader,new THREE.TextureLoader());
		
		//var grpItems = readModel3DfromPath( './data/','man'); bad readModel3DfromPath
		//grpItems.position[1] = -55; //center to camera v axis				
		//grpItems.loadWglObjects(THREE,this.scene,fbxLoader,new THREE.TextureLoader());
			
		//prepare camera 
		//.....................................................................
		this.camera = new THREE.PerspectiveCamera( 50, this.monitorWidth / this.monitorHeight, 0.1, 500);
		//camera.position.x = 20;	
		this.camera .position.y = 20;
		this.camera .position.z = 150;
		//const helper = new THREE.CameraHelper( this.camera );
		//this.scene.add( helper );
	
		//this.chargeControls(FlyControls);
						
		//prepare Scene controls 
		//.....................................................................
		controls = new OrbitControls( this.camera, this.renderer.domElement );
					
	}//end function
		
	start() {
		
		thisObj = this;				
		function animate() {
			if(thisObj.active){
				requestAnimationFrame( animate );
				//thisObj.flyControl.update(0.01)	  
				
				//.........................................................................
				if(thisObj.executeRender){
					thisObj.renderer.render( thisObj.scene,thisObj.camera );
				}
				//.........................................................................				
			}
			else {
				thisObj.renderer.setAnimationLoop(null);	
			}
		}
		animate();
	}//end function		
	
	alertAllDtosCharged(id){
	}//end function
		
	chargeLights(THREE) {
	    this.scene.add( new THREE.AmbientLight( new THREE.Color("rgb(125, 125,125)"))); 
	    
	    const lightF = new THREE.PointLight( 0xffffff, 1, 300 );
		lightF.position.set(0, 100, 50  );
		this.scene.add( lightF );

	    const lightB = new THREE.PointLight( 0xffffff, 1, 300 );
		lightB.position.set(25, 100, -50  );
		this.scene.add( lightB );
	}//end function
	
	onAllBonesCharged(){
		console.log('all Bones charged');	
		this.active = true;
		this.executeRender = true;
		this.start();
	}//end function
	
	executeAnimation() {
		console.log('executeAnimation start');
		this.executeRender = false;
		this.biped.executePose();
		this.executeRender = true;
		console.log('executeAnimation end 8');
	}//end function

					
}//end class