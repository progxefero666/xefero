/**
 *  class  WebGL_sceneUtil.getAleatoryCoord3d(center,radiusMax,heightMax)
 */
 class  WebGL_sceneUtil {        
	
	//constructor	
	constructor(){}
	
	static getAleatoryCoord3d(center,radiusMax,heightMax){
		let coordY = XF_Math.getAleatoryValue(heightMax);
		let coordY_pos = XF_Math.getAleatoryBoolean();
		
		if(!coordY_pos){
			coordY *= (-1);			
		}
		let radioCalc = XF_Math.getAleatoryValue(radiusMax);
		let angleCalc = XF_Math.toRadians(XF_Math.getAleatoryValue(360));
		let coord3d =  XF_Math3dCf.getCf3dOneVertex(1,center,radioCalc,angleCalc);
		coord3d[1] = coordY;
		return coord3d;
	}//end function	
	
	static getAleatoryCoord3dInSceneY(gameScene){
		//console.log('radiusMax:');
		//console.log(gameScene.radiusMax);
		let radioCalc = XF_Math.getAleatoryValue(gameScene.radiusMax);
		let angleCalc = XF_Math.toRadians(XF_Math.getAleatoryValue(360));
		let coord3d =  XF_Math3dCf.getCf3dOneVertex(1,gameScene.center,radioCalc,angleCalc);
		return coord3d;
	}//end function
	
	static getAleatoryCoord3dInPoint(center,radiusMax){
		let radioCalc = XF_Math.getAleatoryValue(radiusMax);
		let angleCalc = XF_Math.toRadians(XF_Math.getAleatoryValue(360));
		let coord3d =  XF_Math3dCf.getCf3dOneVertex(1,center,radioCalc,angleCalc);
		return coord3d;
	}//end function
		
		
	//....................................................................................			
	//functions for sky bounding box
	//....................................................................................
  	static createSkyBox(THREE,basePath,filename,size) {
		  let skyboxMaterials = WebGL_sceneUtil.createMaterialArray(THREE,basePath,filename);
		  let skyboxGeo = new THREE.BoxGeometry(size,size,size);
		  let skybox = new THREE.Mesh(skyboxGeo, skyboxMaterials);
		  return skybox;
	}//end function
		  
	static createPathStrings(basePath,filename) {
		const baseFilename = basePath + filename;
		const fileType = '.jpg';
		const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
		const pathStings = sides.map(side => {
		    return baseFilename + "_" + side + fileType;
		});
		
		return pathStings;
	}//end function
	
	static createMaterialArray(THREE,basePath,filename) {
		const skyboxImagepaths = WebGL_sceneUtil.createPathStrings(basePath,filename);
		const materialArray = skyboxImagepaths.map(image => {
		    let texture = new THREE.TextureLoader().load(image);
		    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); 
		});
		return materialArray;
	}//end function
	//....................................................................................
			
}//end class


