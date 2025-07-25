/**
 * class WebGL_util.readJSonObject(file_path)
 */

 class  WebGL_object3d {        

	constructor(dataDirectory,name) {
		this.dataDirectory	= dataDirectory;
		this.name		= name;				
		this.boundRadius= 0;
		this.dto		= null;
		this.initPosition = null;				
	}//end constructor

	loadWglObject(THREE,scene,objLoader,mtlLoader,initPosition) {
		//let path = 	this.dataPath.concat(modelFileName);
		this.initPosition = initPosition;
		WebGL_ObjectLoader.loadObject3d(THREE,scene,objLoader,mtlLoader,this,this.dataDirectory,this.name);
	}//end function
	
	alertCharged(dto){
		console.log('object charged');
		this.dto = dto;		
		if(this.initPosition!=null){
			this.dto.position.x = this.initPosition[0];
			this.dto.position.y = this.initPosition[1];
			this.dto.position.z = this.initPosition[2];
		}
	}//end function
		
}//end class

/**
 * class WebGL_ObjectLoader.loadObject3d(THREE,scene,objLoader,mtlLoader,parent,dataDirectory,name)
 */

 class  WebGL_ObjectLoader {      
	 
	static loadObject3d(THREE,scene,objLoader,mtlLoader,parent,dataDirectory,name) {	
		let objectFileName = name.concat('.obj');
		let materialFileName = name.concat('.mtl');
		
		let objectFilePath = dataDirectory.concat(objectFileName);
		let materialFilePath = dataDirectory.concat(materialFileName);
		
		mtlLoader.load(materialFilePath,function(materials){
			materials.preload();
			thisObj.objLoader.setMaterials(materials);
		
			objLoader.load(objectFilePath,
				function(object){
					object.traverse( function ( child ) {
						//if ( child instanceof THREE.Mesh ) {//child.material = objMaterial;	}
					});
					//console.log(object.children[0]);
					let dto = object.children[0];
					scene.add(dto);
					if(parent!=null){
						parent.alertCharged(dto);
					}
				},
			    (xhr) => {
			        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			    },
			    (error) => {
			        //console.log(error);
			    }   			
			);
			
		});		
		
				
	}//end function
		
}//end class
	 