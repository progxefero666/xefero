/**
 * WebGL_object3ds
 */

 class  WebGL_item {        
	
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
		let itemReturn = new WebGL_item(
			this.parent,	
			this.name,
			this.color,
			[position[0],position[1],position[2]],
			this.scale,
			this.opacity,
			this.dataDirectory,
			this.mapFileName,
			this.bumpFileName,
			this.normalFileName,		
		null
		);
		return itemReturn;
	}//end function
	
	toJSonString(){
		let jsonReturn = {
			"name":this.name,
			"color":this.color,
			"position": [
				this.position[0],
				this.position[1],
				this.position[2]
			],
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
		        object.scale.set(1,1,1);
		         
				object.position.x = this.position[0];	
				object.position.y = this.position[1];	
				object.position.z = this.position[2];	
		         		        	 
		        if(this.parent!=null){
					object.position.x += this.parent.position[0];	
					object.position.y += this.parent.position[1];
					object.position.z += this.parent.position[2];
				} 		        
				objThis.sceneObj = object;
				//scene.add(objThis.sceneObj);				
		        objThis.parent.alertItemCharged(THREE,scene);
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
				
		var textureMapPath =this.dataDirectory.concat(this.mapFileName);
		var  objMaterial = new THREE.MeshStandardMaterial(); //MeshPhongMaterial 
		objMaterial.map= loaderTextures.load(textureMapPath);			
		objMaterial.bumpMap= loaderTextures.load(textureMapPath);		
		//objMaterial.normalMap= loaderTextures.load(textureMapPath);
		
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
		        //console.log(objThis.scale); 
		        object.scale.set(1,1,1);
		         
		        console.log(object.scale); 
				object.position.x = this.position[0];
				object.position.y = this.position[1];
				object.position.z = this.position[2];
	        		
	        	
		        if(this.parent!=null){
					object.position.x += this.parent.position[0];	
					object.position.y += this.parent.position[1];
					object.position.z += this.parent.position[2];
				} 	        
				
				objThis.sceneObj = object;	
				//scene.add(objThis.sceneObj);
				objThis.parent.alertItemCharged(THREE,scene);
		    },
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    (error) => {
		        //console.log(error);
		    }   
		)
	}//end function
	
	
	/*
			//var textureMapPath =this.textureDirectory.concat(this.mapFileName);		  	
		var textureMapPath =this.dataDirectory.concat(this.mapFileName);		
		var envMapPath =this.dataDirectory.concat('metalica.jpg');
		
		var  objMaterial = new THREE.MeshPhongMaterial(); //  MeshPhongMaterial
		objMaterial.map= loaderTextures.load(envMapPath);			 
		objMaterial.bumpMap= loaderTextures.load(envMapPath);		
		//objMaterial.normalMap= loaderTextures.load(envMapPath);
		objMaterial.transparent =true;
		objMaterial.opacity= this.opacity;
 		
 		//objMaterial.color =0xffffff;
		//objMaterial.roughnessMap= loaderTextures.load(textureMapPath);
 		//objMaterial.metalnessMap= loaderTextures.load(textureMapPath);
 		//objMaterial.metalness = 1.0;
 		//objMaterial.roughness = 0.4;
	*/
	
}//end clas	