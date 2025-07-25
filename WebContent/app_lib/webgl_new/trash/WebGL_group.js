/**
 * class WebGL_group
 */


class  WebGL_group {        
	
	//constructor	
	//..........................................................................
	constructor(app,id,position,objects,dataDirectory,textureDirectory) {	
		this.app 		= app;	
		this.id 		= id;
		this.position	= position;
		this.objects 	= objects;
		this.dataDirectory = dataDirectory;
		this.textureDirectory =textureDirectory;		
		this.wglObjects = [];
		this.group = null;
		this.itemChargedIndex = -1;
		this.postConstructor();
	}//end constructor
	
	
	postConstructor() {
		for (var i=0;i<this.objects.length;i++){
			this.wglObjects[i] = new WebGL_item(
				this,
				this.objects[i].id,
				this.objects[i].color,
				this.objects[i].position,
				1.0,
				1.0,
				this.dataDirectory ,						
				this.objects[i].textures,
				this.objects[i].textures,
				null
			);
		}
	}//end function
		
	
	alertItemCharged(THREE,scene){
		this.itemChargedIndex+=1;
				
		if(this.itemChargedIndex==(this.wglObjects.length-1) ){			
			this.group = new THREE.Group();
			for (var i=0;i<this.wglObjects.length;i++){
				this.group.add(this.wglObjects[i].sceneObj);
			}
			//this.group.rotation.y = RADIAN * 90;
			//scene.add(this.group);
			this.app.alertGroupCharged(scene,this.group,this.id);
		}
		
	}//end function	
		
	loadWglObjects(THREE,scene,fbxLoader,loaderTextures) {
		
		this.scene = scene;
			
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
	
}//end class