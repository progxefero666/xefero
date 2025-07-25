/**
 * class XfBipedUtil.bipedAngle
 */

  class  XfBipedUtil {        
	
	//constructor	
	//..........................................................................
	constructor() {}
	
		
	static readBiped3DfromPath(modelId,position) {
		let ppath 			= './data/';
		let modelFileName 	= modelId.concat('.json');
		let path 			= 	ppath.concat(modelId).concat('/').concat(modelFileName); 
		
		let modelObj =  readJSonObject(path);	
		let model = new XfBipedModel(
				modelObj.id,
				position,
				modelObj.objects,
				modelObj.dataDirectory
		);					
		for (var objIdx=0;objIdx<model.wglObjects.length;objIdx++){
			model.wglObjects[objIdx].position[0] += position[0];	
			model.wglObjects[objIdx].position[1] += position[1];
			model.wglObjects[objIdx].position[2] += position[2];
		}
			
		return model;
	}//end function
	
	
	static bipedAngle(angleDegress){
		let angleReturn = 0;
		if(angleDegress>=0){
			angleReturn = XF_Math.toRadians(angleDegress);
		}
		else {
			angleReturn = XF_Math.toRadians(360+angleDegress);
		}
		return angleReturn;
	}//end function
		
}//end class