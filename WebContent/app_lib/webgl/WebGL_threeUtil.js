/**
 * class WebGL_threeUtil.setVectorFromCoords(vector,coords)
 */

 class  WebGL_threeUtil {        

	constructor() {}//end constructor
	
	/**
	 * remove object from three scene
	 */
	 static removeObject3D(THREE,object3D) {
	    if (!(object3D instanceof THREE.Object3D)) return false;
	
	    // for better memory management and performance
	    if (object3D.geometry) object3D.geometry.dispose();
	
	    if (object3D.material) {
	        if (object3D.material instanceof Array) {
	            // for better memory management and performance
	            object3D.material.forEach(material => material.dispose());
	        } else {
	            // for better memory management and performance
	            object3D.material.dispose();
	        }
	    }
	    object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
	    return true;
	}//end function
	
	static setVectorFromCoords(vector,coords){		
		vector.x = coords[0];
		vector.y = coords[1];
		vector.z = coords[2];	
		return vector;
	}//end function
	

		
	static getVectorFromCoords(THREE,coords){
		let vector = new THREE.Vector3(); 
		vector.x = coords[0];
		vector.y = coords[1];
		vector.z = coords[2];	
		return vector;
	}//end function
	
	static getVector3Coords(vector3){
		let coords3d=[];
		coords3d[0] = vector3.x;
		coords3d[1] = vector3.y;
		coords3d[2] = vector3.z;						
		return coords3d;
	}//end function
		
	static setVector3Coords(vector3,coords){		
		vector3.x = coords[0];
		vector3.y = coords[1];
		vector3.z = coords[2];						
	}//end function
	
	static setWglObjectPosition(wglObject,coords){
		WebGL_threeUtil.setVector3Coords(wglObject.position,coords);				
	}//end function
		
	static setObjectStateToCameraView(THREE,wglCamera,wglObject,viewDistance){	
		let cameraVector = new THREE.Vector3(); 
		wglCamera.getWorldDirection(cameraVector);
		cameraVector.multiplyScalar(viewDistance);
		
		wglObject.position.x = wglCamera.position.x + cameraVector.x;
		wglObject.position.y = wglCamera.position.y + cameraVector.y;
		wglObject.position.z = wglCamera.position.z + cameraVector.z;
		
		wglObject.rotation.x = wglCamera.rotation.x;
		wglObject.rotation.y = wglCamera.rotation.y;
		wglObject.rotation.z = wglCamera.rotation.z;
								
	}//end function
		
	static getCameraView3dCoords(THREE,wglCamera,viewDistance){		
		let cameraVector = new THREE.Vector3(); 
		wglCamera.getWorldDirection(cameraVector);
		if(viewDistance!=null){
			cameraVector.multiplyScalar(viewDistance);
		}
		let coords 	= [];
		coords[0]	= wglCamera.position.x + cameraVector.x;
		coords[1]	= wglCamera.position.y + cameraVector.y;
		coords[2]	= wglCamera.position.z + cameraVector.z;
		return coords;		
	}//end function
	
	static getColorTexture(THREE,canvasId,color){
		//var itemColor = [0.0,0.0,0.0,1.0];
		//let canvas = document.getElementById(canvasId);
		
		let canvas = document.createElement('canvas');	
		
		let ctx = canvas.getContext("2d");	
		let imgData = createImageDataFromColor(
			ctx,
			256,256,
			color);
		let texture = new THREE.DataTexture(imgData,256,256 );
		texture.needsUpdate = true;
		return texture;
	}//end function
		
	//let numberMap =WebGL_threeUtil.getTextureFromNumber(THREE,'rgb(255, 0, 0)','100');		
	static getTextureFromNumber(THREE,color,strNumber){
		let canvas = document.createElement('canvas');	
		canvas.width = 512;
		canvas.height = 512;
		
		let ctx = canvas.getContext("2d");	
		ctx.fillStyle = 'rgb(255,255,255)';
		//ctx.fillStyle = '#000000';
		ctx.font='90px Arial';
		ctx.fillText("100",180,350);
		let cfTexture = new THREE.CanvasTexture(canvas);
		cfTexture.needsUpdate = true;
		return cfTexture;
	}//end function
			
	
}//end class

/**
 * class WebGL_threeGenObjects.createObjectSphereColor(THREE,radius,whSegments,threeColor,position)
 * new THREE.Color("rgb(0,0,0)");
 */

 class  WebGL_threeGenObjects {        

	constructor() {}//end constructor

	//new THREE.Color("rgb(0,0,0)");		

	static createObjectSphereColor(THREE,radius,whSegments,threeColor,position){
			
		let material = new THREE.MeshBasicMaterial( { color: threeColor } );
		let geometry = new THREE.SphereGeometry(radius,16,16);
		if(whSegments!=null){
			geometry = new THREE.SphereGeometry(radius,whSegments,whSegments);
		}		 		 
		let sphere = new THREE.Mesh( geometry, material ); 
		if(position!=null){
			sphere.position.x = position[0];
			sphere.position.y = position[1];
			sphere.position.z = position[2];
		}
		return sphere;
	}//end function
	
	static createObjectSphere(THREE,radius,whSegments,floatRGB,position){
		
		let objColor = new THREE.Color();
		objColor.r = floatRGB[0];
		objColor.g = floatRGB[1];
		objColor.b = floatRGB[2];
		
		let material = new THREE.MeshBasicMaterial( { color: objColor } );
		let geometry = new THREE.SphereGeometry(radius,16,16);
		if(whSegments!=null){
			geometry = new THREE.SphereGeometry(radius,whSegments,whSegments);
		}		 		 
		let sphere = new THREE.Mesh( geometry, material ); 
		if(position!=null){
			sphere.position.x = position[0];
			sphere.position.y = position[1];
			sphere.position.z = position[2];
		}
		return sphere;
	}//end function
	
	static createObjectBox(THREE,size,floatRGB,position){
		
		let objColor = new THREE.Color();
		objColor.r = floatRGB[0];
		objColor.g = floatRGB[1];
		objColor.b = floatRGB[2];
				 
		let cubeGeometry = new THREE.BoxGeometry(size,size,size);
		let cubeMaterial = new THREE.MeshBasicMaterial( { color: objColor } );
		let cube 		 = new THREE.Mesh( cubeGeometry, cubeMaterial );
		if(position!=null){
			cube.position.x = position[0];
			cube.position.y = position[1];
			cube.position.z = position[2];
		}
		return cube;
	}//end function
	
	static createObjectBoxInAleatoryPosition(THREE,center,radiusMax,heightMax,size,floatRGB){
		let objCoord = WebGL_sceneUtil.getAleatoryCoord3d(center,radiusMax,heightMax);
		return WebGL_threeGenObjects.createObjectBox(THREE,size,floatRGB,objCoord);
	}

	
}//end class
	
	
	 	