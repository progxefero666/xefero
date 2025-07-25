/**
 * class  Planeta3D 
 */
 class  Planeta3D {        
	
	//constructor	
	//..........................................................................
	constructor(parent,name,size,color,distanceToSun,timeTranslation,timeRotation,mapFileName,normalFileName,bumpFileName) {
		this.parent = parent;
		this.name = name;		
		this.size 	= size;
		this.color = color;
		this.distanceToSun=distanceToSun;
		this.timeTranslation=timeTranslation;
		this.timeRotation = timeRotation;
		this.mapFileName =mapFileName;
		this.normalFileName = normalFileName;
		this.bumpFileName = bumpFileName;
		this.ruta3d =  null;
		this.wglObject = null;
		this.init() ;
		this.activeConsole  = true;
	}//end constructor
	
	init() {
		let countSteps = Math.floor(this.timeTranslation) * 10;
		
		this.ruta3d = new XfRuteCf3d(
			[0,0,0],
			this.distanceToSun,
			countSteps);
		
		let dataPath 	= this.parent.dataDirectory;
		//let texturePath = this.parent.dataDirectory.concat('texture/');

		
		//let initPosition= [10,0,0];
		let initPosition= this.ruta3d.stepPoint;
		this.wglObject 	= new WebGL_object(
			this.parent,
			this.name,
			this.color,
			initPosition,
			this.size,
			1.0,
			dataPath,
			this.mapFileName,
			this.bumpFileName,
			this.normalFileName); 
	}//end function
		
	loadInScene(THREE,scene,fbxLoader,loaderTextures,context){
		
		if(this.mapFileName!=null){
			this.wglObject.loadWglTextureObject(THREE,scene,fbxLoader,loaderTextures);
		}
		else {
			let itemColor = this.wglObjects[i].color;
			//var itemColor = [0.0,0.0,0.0,1.0];
			let imgData = createImageDataFromColor(
					context,
					256,256,
					itemColor);
			var texture = new THREE.DataTexture(imgData,256,256 );	
			texture.needsUpdate = true
			this.wglObject.loadWglColorObject(THREE,scene,fbxLoader,texture);
		}				
	}//end function
	

	dinamic() {
		this.ruta3d.dinamic();
		this.wglObject.position = this.ruta3d.stepPoint;									
	}//end function	
	
	
}//end class	