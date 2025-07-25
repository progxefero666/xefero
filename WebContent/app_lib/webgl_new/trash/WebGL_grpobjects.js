/**
 *   class  WebGL_grpobject
 */

class  WebGL_grpobjects {        
	
	//constructor	
	//..........................................................................
	constructor(parent,id,position,objects,dataDirectory) {
		this.parent 	= parent;
		this.id 		= id;
		this.position	= position;
		this.objects 	= objects;
		this.dataDirectory = dataDirectory;	
		this.wglObjects = [];
		this.group = null;
		this.itemChargedIndex = -1;
		this.postConstructor();
	}//end constructor
	
	postConstructor() {
		//this.wglObjects = [];
		
		for (var i=0;i<this.objects.length;i++){
			this.wglObjects[i] = new WebGL_object(
				this,
				this.objects[i].id,
				this.objects[i].color,
				this.objects[i].position,
				1.0,
				this.objects[i].opacity,
				this.dataDirectory ,						
				this.objects[i].textures,
				this.objects[i].textures,
				null
			);
		}		
				
	}//end function
		
	setParent(parent){
		
	}//end function
	
	alertItemCharged(){
		this.itemChargedIndex+=1;
		if(this.itemChargedIndex==(this.wglObjects.length-1) ){				
			if(this.parent!=null){
				this.parent.alertAllDtosCharged(this.id);
			}
		}			
	}//end function
		
	loadWglObjects(THREE,scene,fbxLoader,loaderTextures) {
		this.scene	 =scene;
		for (var i=0;i<this.objects.length;i++){
			if(this.objects[i].textures!=null){
				
				this.wglObjects[i].loadWglTextureObject(
					THREE,scene,
					fbxLoader,
					loaderTextures);
			}				
			else {
				var texture = getColorTexture(THREE,'trCanvas',this.wglObjects[i].color);				
				this.wglObjects[i].loadWglColorObject(THREE,this.scene,fbxLoader,texture);
			}
		}	
	}//end function	
	
	loadWglTextureInObject(THREE,scene,fbxLoader,loaderTextures,mapFileName) {
		let objIndex = this.wglObjects.length-1;
		this.wglObjects[objIndex].mapFileName = mapFileName;
		removeObject3D(THREE,this.wglObjects[objIndex].sceneObj);
		this.wglObjects[objIndex].loadWglTextureObject(
					THREE,scene,
					fbxLoader,
					loaderTextures);		
		/*
		let textureMapPath =this.dataDirectory.concat(mapFileName);
				console.log(textureMapPath);
		let objMaterial = new THREE.MeshPhongMaterial(); 
		objMaterial.map= loaderTextures.load(textureMapPath);
		objMaterial.bumpMap= loaderTextures.load(textureMapPath);	
		this.wglObjects[objIndex].sceneObj.material = objMaterial;
		*/
	}//end function

	
}//end class