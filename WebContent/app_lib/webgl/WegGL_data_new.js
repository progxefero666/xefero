

/**
 * class WebGL_dto((parent,dataPath,id)
 */
 class WebGL_dto {        
    
	//constructor	
	constructor(parent,dataPath,id) {
		this.parent  	= parent;
		this.dataPath	= dataPath;
		this.id  		= id;
		this.dto 		= null;
	}//end constructor	
	
	loadWglObject(THREE,scene,fbxLoader,txtLoader,initPosition) {
		
		let modelFileName 	= this.id.concat('.json');
		let path 			= 	this.dataPath.concat('/').concat(modelFileName);
		let modelObj 		=  WebGL_util.readJSonObject(path);	
		this.initPosition	= initPosition;
	
		let elem = modelObj.objects[0];
		
		let position	= elem.position;
		let fbxFileName = elem.id;
		
		let scale = null;
		if(modelObj.objects[0].scale !=null){
			scale = modelObj.objects[0].scale;
		}
		let opacity = 1;
		if(modelObj.objects[0].opacity!=null){
			opacity = modelObj.objects[0].opacity;
		}
		if(elem.textures!=null){
			let mapFileName = modelObj.objects[0].textures;
			
			let emissiveFileName = null;
			if(modelObj.objects[0].emissiveFileName!=null){
				emissiveFileName = modelObj.objects[0].emissiveFileName;
			}
							
			let aoFileName = null;
			if(modelObj.objects[0].aoFileName!=null){
				aoFileName = modelObj.objects[0].aoFileName;
			}
			let roughnessFileName = null;
			if(modelObj.objects[0].roughnessFileName!=null){
				roughnessFileName = modelObj.objects[0].roughnessFileName;
			}	
			
			let bumpFileName = null;
			if(modelObj.objects[0].bumpFileName!=null){
				bumpFileName = modelObj.objects[0].bumpFileName;
			}		
			// @ts-ignore
			let normalFileName = null;
			if(modelObj.objects[0].normalFileName!=null){
				normalFileName = modelObj.objects[0].normalFileName;
			}
							
			let alphaFileName = null;
			if(modelObj.objects[0].alphaFileName!=null){
				alphaFileName = modelObj.objects[0].alphaFileName;
				console.log('apply alpha map');
				WebGL_util.loadWglTextureAlphaObject(THREE,scene,fbxLoader,txtLoader,
					this,this.dataPath,fbxFileName,position,scale,opacity,mapFileName,alphaFileName)
				
			}		
			else {
				WebGL_util.loadWglComplexTextureObject(THREE,scene,fbxLoader,txtLoader,
					this,this.dataPath,fbxFileName,position,elem.color,scale,opacity,mapFileName,aoFileName,emissiveFileName,roughnessFileName,bumpFileName);													
			}
		}		
		else {
			// @ts-ignore
			let texture = WebGL_threeUtil.getColorTexture(THREE,'trCanvas',elem.color)
			WebGL_util.loadWglPhysicalColorObject(THREE,scene,fbxLoader,this,this.dataPath,fbxFileName,elem.position,scale,elem.color,elem.opacity,texture);
		}			
				
	}//end function
	
	alertItemCharged(scene,dto){
		if(this.initPosition!=null){
			dto.position.x = this.initPosition[0];
			dto.position.y = this.initPosition[1];
			dto.position.z = this.initPosition[2];
		}						
		scene.add(dto);
		this.dto = dto;				
		this.parent.alertAllDtosCharged(this.id);
	}//end function
			
}//end class

/*
 * class WebGL_groupdtos
*/
 class WebGL_groupdtos {        
    
	//constructor	
	constructor(parent,dataPath,id,name) {
		this.parent  	= parent;
		this.dataPath	= dataPath;
		this.id  		= id;
		this.name		= name;
		this.itemChargedIndex = -1;
		this.countItems = 0;
		this.boundRadius= 0;
		this.grdto		= null;
		this.ring = null;
		this.initPosition = null;
	}//end constructor	
	
	loadWglObjects(THREE,scene,fbxLoader,txtLoader,initPosition) {
		this.grdto = new THREE.Group();
		if(this.name!=null){
			this.grdto.name = this.name;
		}
		
		let modelFileName = this.id.concat('.json');
		let path = 	this.dataPath.concat(modelFileName);
		
		let modelObj =  WebGL_util.readJSonObject(path);
		this.boundRadius = modelObj.boundsRadius;
		
		this.initPosition= initPosition; 
	
		this.countItems = modelObj.objects.length;
		for (let i=0;i<this.countItems;i++){
			let fbxFileName = modelObj.objects[i].id;
			let color = modelObj.objects[i].color
			let position = modelObj.objects[i].position;
			
			let materialType = 'normal';
			if(modelObj.objects[i].material!=null){	
				materialType = modelObj.objects[i].material;
			}	
				
			let scale = null;
			if(modelObj.objects[i].scale !=null){
				scale = modelObj.objects[i].scale;
			}
			let opacity = modelObj.objects[i].opacity;
			if(modelObj.objects[i].textures!=null){			
	
				let mapFileName = modelObj.objects[i].textures;
				
				let emissiveFileName = null;
				if(modelObj.objects[i].emissiveFileName!=null){
					emissiveFileName = modelObj.objects[i].emissiveFileName;
				}
								
				let aoFileName = null;
				if(modelObj.objects[i].aoFileName!=null){
					aoFileName = modelObj.objects[i].aoFileName;
				}
				let roughnessFileName = null;
				if(modelObj.objects[i].roughnessFileName!=null){
					roughnessFileName = modelObj.objects[i].roughnessFileName;
				}				
				let bumpFileName = null;
				if(modelObj.objects[i].bumpFileName!=null){
					bumpFileName = modelObj.objects[i].bumpFileName;
				}		
				let normalFileName = null;
				if(modelObj.objects[i].normalFileName!=null){
					normalFileName = modelObj.objects[i].normalFileName;
				}
										
				//let textureLoader = new THREE.TextureLoader();
				if(materialType == 'normal'){
					WebGL_util.loadWglComplexTextureObject(THREE,scene,fbxLoader,txtLoader,
						this,this.dataPath,fbxFileName,
						position,color,scale,opacity,
						mapFileName,aoFileName,emissiveFileName,roughnessFileName,bumpFileName,normalFileName);								
				}
				if(materialType == 'physical'){
					WebGL_util.loadWglPhysicalTextureObject(THREE,scene,fbxLoader,txtLoader,
					this,this.dataPath,fbxFileName,position,color,scale,opacity,mapFileName,aoFileName,emissiveFileName,roughnessFileName,bumpFileName);				
				}
			}		
			else {
				// @ts-ignore
				let texture = WebGL_threeUtil.getColorTexture(THREE,'trCanvas',color)
				WebGL_util.loadWglPhysicalColorObject(THREE,scene,fbxLoader,this,this.dataPath,fbxFileName,position,scale,color,opacity,texture);
			}			
		}//end for
	
		
	}//end function
	
	alertItemCharged(scene,dto){
		this.itemChargedIndex++;
		this.grdto.add(dto);
		if(this.itemChargedIndex==(this.countItems-1) ){	
			
			if(this.initPosition!=null){
				this.grdto.position.x = this.initPosition[0];
				this.grdto.position.y = this.initPosition[1];
				this.grdto.position.z = this.initPosition[2];
			}											
			scene.add(this.grdto);		
			this.parent.alertAllDtosCharged(this.id);			
		}
	}//end function
	
	setLayer(layerId){
		for (let i=0;i<this.grdto.children.length;i++){
			this.grdto.children[i].layers.set(layerId);
		}//end for		
	}//end function
	
}//end class	

	
/**
 * class WebGL_listdtos
 */
 class WebGL_listdtos {        
    
	//constructor	
	constructor(parent,dataPath,id) {
		this.parent  	= parent;
		this.dataPath	= dataPath;
		this.id  		= id;
		this.itemChargedIndex = -1;
		this.countItems = 0;
		this.dtos 		= [];
	}//end constructor	
	
	loadWglObjects(THREE,scene,fbxLoader,txtLoader,initPosition) {
	
		let modelFileName = this.id.concat('.json');
		let path = 	this.dataPath.concat('/').concat(modelFileName);
		let modelObj =  WebGL_util.readJSonObject(path);	
		
		this.position	= modelObj.position;
		if(initPosition!=null){
			this.position = initPosition;
		}
	
		this.countItems = modelObj.objects.length;
		for (let i=0;i<this.countItems;i++){
			let fbxFileName = modelObj.objects[i].id;
			let color = modelObj.objects[i].color
			let position = modelObj.objects[i].position;
			
			let materialType = 'normal';
			if(modelObj.objects[i].material!=null){	
				materialType = modelObj.objects[i].material;
			}	
				
			let scale = null;
			if(modelObj.objects[i].scale !=null){
				scale = modelObj.objects[i].scale;
			}
			let opacity = modelObj.objects[i].opacity;
			if(modelObj.objects[i].textures!=null){
				let mapFileName = modelObj.objects[i].textures;
				
				let emissiveFileName = null;
				if(modelObj.objects[i].emissiveFileName!=null){
					emissiveFileName = modelObj.objects[i].emissiveFileName;
				}
								
				let aoFileName = null;
				if(modelObj.objects[i].aoFileName!=null){
					aoFileName = modelObj.objects[i].aoFileName;
				}
				let roughnessFileName = null;
				if(modelObj.objects[i].roughnessFileName!=null){
					roughnessFileName = modelObj.objects[i].roughnessFileName;
				}				
				let bumpFileName = null;
				if(modelObj.objects[i].bumpFileName!=null){
					bumpFileName = modelObj.objects[i].bumpFileName;
				}			
								
				if(materialType == 'normal'){
					WebGL_util.loadWglComplexTextureObject(THREE,scene,fbxLoader,txtLoader,
						this,this.dataPath,fbxFileName,position,color,scale,opacity,mapFileName,aoFileName,emissiveFileName,roughnessFileName,bumpFileName);								
				}
				if(materialType == 'physical'){
					WebGL_util.loadWglPhysicalTextureObject(THREE,scene,fbxLoader,txtLoader,
					this,this.dataPath,fbxFileName,position,color,scale,opacity,mapFileName,aoFileName,emissiveFileName,roughnessFileName,bumpFileName);				
				}				
			}		
			else {
				// @ts-ignore
				let texture = WebGL_threeUtil.getColorTexture(THREE,'trCanvas',color)
				WebGL_util.loadWglPhysicalColorObject(THREE,scene,fbxLoader,this,this.dataPath,fbxFileName,position,scale,color,opacity,texture);
			}			
		}//end for
		
	}//end function
	
	alertItemCharged(scene,dto){
		this.itemChargedIndex++;
		dto.name = this.id;
		scene.add(dto);
		this.dtos[this.itemChargedIndex] = dto;		
		if(this.itemChargedIndex==(this.countItems-1) ){		
			this.parent.alertAllDtosCharged(this.id);			
		}
	}//end function
	
	setLayer(layerId){
		for (let i=0;i<this.dtos.length;i++){
			this.dtos[i].layers.set(layerId);
		}//end for		
	}//end function
	
}//end class


/**
 * class WebGL_morphdto
 */
 class WebGL_morphdto {        
    
	//constructor	
	constructor(parent,dataPath,id) { //,name
		this.parent  	= parent;
		this.dataPath	= dataPath;
		this.id  		= id;
		//this.name		= name;

		
		this.boundRadius= 0;
		this.countItems = 0;
		this.countItemsCharged = 0;
		this.dtos = []
		
		this.itemActiveIndex=0;
		this.ring = null;
		this.initPosition = null;
	}//end constructor	
	
	loadWglObjects(THREE,scene,fbxLoader,txtLoader,initPosition) {
		this.grdto = new THREE.Group();
		//this.grdto.name = this.name;
		let modelFileName = this.id.concat('.json');
		let path = 	this.dataPath.concat(modelFileName);
		
		let modelObj =  WebGL_util.readJSonObject(path);
		this.boundRadius = modelObj.boundsRadius;
		
		this.initPosition= initPosition; 
	
		this.listOrdered = [];
		this.countItems = modelObj.objects.length;
		for (let i=0;i<this.countItems;i++){
			this.listOrdered[i]= modelObj.objects[i].id;
		}
		for (let i=0;i<this.countItems;i++){
			let fbxFileName = modelObj.objects[i].id;
			let color = modelObj.objects[i].color
			let position = modelObj.objects[i].position;
			
			let materialType = 'normal';
			if(modelObj.objects[i].material!=null){	
				materialType = modelObj.objects[i].material;
			}	
						
			let scale = null;
			if(modelObj.objects[i].scale !=null){
				scale = modelObj.objects[i].scale;
			}
			let opacity = modelObj.objects[i].opacity;
			if(modelObj.objects[i].textures!=null){
				let mapFileName = modelObj.objects[i].textures;
				
				let emissiveFileName = null;
				if(modelObj.objects[i].emissiveFileName!=null){
					emissiveFileName = modelObj.objects[i].emissiveFileName;
				}
								
				let aoFileName = null;
				if(modelObj.objects[i].aoFileName!=null){
					aoFileName = modelObj.objects[i].aoFileName;
				}
				let roughnessFileName = null;
				if(modelObj.objects[i].roughnessFileName!=null){
					roughnessFileName = modelObj.objects[i].roughnessFileName;
				}				
				//console.log(bumpFileName);
				let bumpFileName = null;
				if(modelObj.objects[i].bumpFileName!=null){
					bumpFileName = modelObj.objects[i].bumpFileName;
				}					
				if(materialType == 'normal'){
					//debugger;
					WebGL_util.loadWglComplexTextureObject(THREE,scene,fbxLoader,txtLoader,
						this,this.dataPath,fbxFileName,position,color,scale,opacity,mapFileName,aoFileName,emissiveFileName,roughnessFileName,bumpFileName);								
				}
				if(materialType == 'physical'){
					WebGL_util.loadWglPhysicalTextureObject(THREE,scene,fbxLoader,txtLoader,
					this,this.dataPath,fbxFileName,position,color,scale,opacity,mapFileName,aoFileName,emissiveFileName,roughnessFileName,bumpFileName);				
				}
			}		
			else {
				// @ts-ignore
				let texture = WebGL_threeUtil.getColorTexture(THREE,'trCanvas',color)
				WebGL_util.loadWglPhysicalColorObject(THREE,scene,fbxLoader,this,this.dataPath,fbxFileName,position,scale,color,opacity,texture);
			}			
		}//end for
	
		
	}//end function
	
	getListIndex(dtoName){
		let index = 0;
		for (let i=0;i<this.countItems;i++){
			// @ts-ignore
			if(this.listOrdered[i]==dtoName){
				index = i;
				break;
			}
		}
		return index;
	}//end function
	
	alertItemCharged(scene,dto){	

		
		this.countItemsCharged++;
		
		if(this.initPosition!=null){
			dto.position.x = this.initPosition[0];
			dto.position.y = this.initPosition[1];
			dto.position.z = this.initPosition[2];
		}	
		
		let itemChargedIndex = this.getListIndex(dto.name)
		this.dtos[itemChargedIndex] = dto;

		if(itemChargedIndex==0){
			this.dtos[itemChargedIndex].visible = true;
		}
		else {
			this.dtos[itemChargedIndex].visible = false;
		}		
		if(this.countItemsCharged==this.countItems ){		
			for (let i=0;i<this.dtos.length;i++){
				scene.add(this.dtos[i]);	
			}		
			this.itemActiveIndex=0;					
			this.parent.alertAllDtosCharged(this.id);			
		}
	}//end function
	
	dinamic(scene){
		scene.remove(this.dtos[this.itemActiveIndex]);	
		this.itemActiveIndex++;
		if(this.itemActiveIndex==(this.countItems-1) ){
			this.itemActiveIndex = 0;
		}
		scene.add(this.dtos[this.itemActiveIndex]);	
	}//end function
		
	setLayer(layerId){
		for (let i=0;i<this.grdto.children.length;i++){
			this.grdto.children[i].layers.set(layerId);
		}//end for		
	}//end function

		
}//end class		

/**
 * class WebGL_terrain((parent,dataPath,id)
 */
 class WebGL_terrain {        
    
	//constructor	
	constructor(parent,dataPath,id,imageData) {
		this.parent  	= parent;
		this.dataPath	= dataPath;
		this.id	= id;
		this.imageData  = imageData;
		this.dto 		= null;
	}//end constructor	
	
	loadWglObject(THREE,scene,fbxLoader,txtLoader,initPosition) {
		let modelFileName 	= this.id.concat('.json');
		let path 			= 	this.dataPath.concat('/').concat(modelFileName);
		let modelObj 		=  WebGL_util.readJSonObject(path);	
		this.initPosition	= initPosition;
	
		let elem = modelObj.objects[0];
		
		let position	= elem.position;
		let fbxFileName = elem.id;
		

		let mapFileName = modelObj.objects[0].textures;
		
		WebGL_util.loadWglTerrainByTexture(THREE,scene,fbxLoader,txtLoader,
			this,this.dataPath,fbxFileName,position,elem.color,1,mapFileName,this.imageData);
				
	}//end function
	
	alertItemCharged(scene,dto){
		if(this.initPosition!=null){
			dto.position.x = this.initPosition[0];
			dto.position.y = this.initPosition[1];
			dto.position.z = this.initPosition[2];
		}						
		scene.add(dto);
		this.dto = dto;				

	}//end function
			
}//end class
	

