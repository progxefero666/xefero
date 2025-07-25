/**
 * WebGL_textobject
 */

 
 class  WebGL_textobject {        
	
	//constructor	
	//..........................................................................
	constructor(parent,name,color,position,scale,dataDirectory,mapFileName,bumpFileName,normalFileName) {
		this.parent 	= parent;		
		this.name 	= name;
		this.color=color;
		this.position=position;
		this.scale = scale;
		this.dataDirectory = dataDirectory;
		this.mapFileName = mapFileName;
		this.bumpFileName = bumpFileName;
		this.normalFileName = normalFileName;		
		this.sceneObj = null;
		
	}//end constructor


	loadWglObject(THREE,scene,fbxLoader,loaderTextures) {	
		
		var textureMapPath =this.dataDirectory.concat(this.mapFileName);
		var  objMaterial = new THREE.MeshPhongMaterial(); //MeshStandardMaterial1
		objMaterial.map= loaderTextures.load(textureMapPath);			
		objMaterial.bumpMap= loaderTextures.load(textureMapPath);		
		//objMaterial.normalMap= loaderTextures.load(textureMapPath);
		
		console.log(this.name);
		
		var objThis =  this;			 		
	 	fbxLoader.load(
		  	this.dataDirectory.concat(this.name ),
		    (object) => {
		         object.traverse(function (child) {
		             if(child.isMesh) {
		                 child.material = objMaterial;
		                 child.material.transparent = false;
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