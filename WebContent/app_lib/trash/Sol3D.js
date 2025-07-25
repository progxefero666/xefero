/**
 * Sol3D
 */

  class  Sol3D {        
	
	//constructor	
	//..........................................................................
	constructor(parent,name,position,size,mapFileName,normalFileName,bumpFileName) {
		this.parent = parent;	
		this.name = name;	
		this.position = position;
		this.size = size;
		this.mapFileName = mapFileName;
		this.normalFileName = normalFileName;
		this.bumpFileName = bumpFileName;			
		this.wglObject = null;			
		this.init();
	}//end constructor
	
	init() {
		
		let dataPath 	= this.parent.dataDirectory;
		//let texturePath = this.parent.dataDirectory.concat('texture/');
				
		this.wglObject 	= new WebGL_object(
			this.parent,
			this.name,
			this.color,
			this.position,
			this.size,
			1.0,
			dataPath,
			this.mapFileName,
			this.bumpFileName,
			this.normalFileName);
	}//end function
	
	loadInScene(THREE,scene,fbxLoader,loaderTextures){
			
		this.wglObject.loadWglTextureObject(THREE,scene,fbxLoader,loaderTextures);
			
	}//end function
	
	
}//end class	