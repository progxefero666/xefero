/**
 * WebGL_object3ds
 */

 class  WebGL_object {        
	
	//constructor	
	//..........................................................................
	constructor(parent,name,color,position,scale,opacity,dataDirectory,mapFileName,bumpFileName,normalFileName) {
		this.parent 	= parent;		
		this.name 	= name;
		this.color=color;
		this.position=position;
		this.scale = scale;
		this.opacity = opacity;
		this.dataDirectory = dataDirectory;
		this.mapFileName = mapFileName;
		this.bumpFileName = bumpFileName;
		this.normalFileName = normalFileName;		
		this.sceneObj = null;
	}//end constructor

	getObjectClone(){
		let itemReturn = new WebGL_object(
			this.parent,	
			this.name,
			this.color,
			[this.position[0],this.position[1],this.position[2]],
			this.scale,
			this.opacity,
			this.dataDirectory,
			this.mapFileName,
			this.bumpFileName,
			this.normalFileName
		);
		return itemReturn;
	}//end function
	
	toJSonString(){
		let jsonReturn = {
			"name":this.name,
			"color":this.color,
			"scale":this.scale,
			"opacity":this.opacity,
			"dataDirectory":this.dataDirectory,
			"mapFileName":this.mapFileName,
			"bumpFileName":this.bumpFileName,
			"normalFileName":this.normalFileName
		};
		return jsonReturn;
	}//end function
	
	loadWglColorObject(THREE,scene,fbxLoader,textureMap) {
		
		
		//var  objMaterial = new THREE.MeshNormalMaterial();
		var  objMaterial = new THREE.MeshStandardMaterial();							
		objMaterial.color = new THREE.Color(this.color[0],this.color[1],this.color[2]);
		//objMaterial.map = textureMap;
		objMaterial.normalMap = textureMap;
		objMaterial.transparent =true;
		objMaterial.opacity= this.opacity;
				
		var objfbxPath = this.dataDirectory.concat(this.name );		
		var objThis =  this;		
	 	fbxLoader.load(
		  	objfbxPath,
		    (object) => {
		         object.traverse(function (child) {
		             if(child.isMesh) {
		                 child.material = objMaterial;
		            }
		         })
				object.position.x = this.position[0];	
				object.position.y = this.position[1];	
				object.position.z = this.position[2];	
		         		        	 
		        if(this.parent!=null){
					object.position.x += this.parent.position[0];	
					object.position.y += this.parent.position[1];
					object.position.z += this.parent.position[2];
				} 		        
				objThis.sceneObj = object;
				scene.add(objThis.sceneObj);				
		        objThis.parent.alertItemCharged();
		    },
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    (error) => {
		        //console.log(error);
		    }
		)
	}//end function

	loadWglTextureObject(THREE,scene,fbxLoader,loaderTextures) {	
		
		//console.log(this.opacity);
		
		var textureMapPath =this.dataDirectory.concat(this.mapFileName);
		var  objMaterial = new THREE.MeshStandardMaterial(); //MeshPhongMaterial 
		objMaterial.map= loaderTextures.load(textureMapPath);			
		objMaterial.bumpMap= loaderTextures.load(textureMapPath);		
		//objMaterial.normalMap= loaderTextures.load(textureMapPath);
		
		objMaterial.transparent =true;
		objMaterial.opacity= this.opacity;
		
		var objThis =  this;			 		
	 	fbxLoader.load(
		  	this.dataDirectory.concat(this.name ),
		    (object) => {
		         object.traverse(function (child) {
		             if(child.isMesh) {
		                 child.material = objMaterial;
		            }
		         })
		         
		        object.scale.set(objThis.scale,objThis.scale,objThis.scale);
		         
				object.position.x = this.position[0];
				object.position.y = this.position[1];
				object.position.z = this.position[2];
	        		
		        if(this.parent!=null){
					object.position.x += this.parent.position[0];	
					object.position.y += this.parent.position[1];
					object.position.z += this.parent.position[2];
				} 	        
				
				objThis.sceneObj = object;					
				scene.add(objThis.sceneObj);
				
				objThis.parent.alertItemCharged();
		    },
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    (error) => {
		        //console.log(error);
		    }   
		)
	}//end function
	
}//end clas	