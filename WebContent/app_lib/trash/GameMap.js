/**
 * class WebGLAppUniverse
 * 
 */
class  GameMap {        
	
	//constructor	
	constructor(app,canvasId) {
		this.app = app;
		if(canvasId!=null){
			this.canvas =document.getElementById(canvasId);
		}
		else {
			this.canvas = document.createElement('canvas');	
		}
		this.configure();
	}//end constructor	
	
	configure(){
		this.mapRadius = 0.9;
		this.mapDistToCameraH = 3.5;
		this.mapDistToCameraV = 2.0;
		this.mapDistToCameraZ = 8.0;
	}//end function
			
	init(THREE,scene){	
		 			
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
		
	}//end function

			
	dinamic(THREE,wglCamera){
				
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

	}//end function
				
				
} //end class