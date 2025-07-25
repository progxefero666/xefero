/**
 * class XfBipedModelObject
 */

 class  XfBipedModelObject {        
	
	//constructor	
	//..........................................................................
	constructor(parentId,id,color,position,mapFileName,bumpFileName,normalFileName) {
		this.parentId = parentId;		
		this.id 	= id;
		this.color=color;
		this.position=position;
		this.mapFileName = mapFileName;
		this.bumpFileName = bumpFileName;
		this.normalFileName = normalFileName;
		this.parentIndex = -1;	
		this.parentTranslation = [0,0,0];
	}//end constructor

}//end clas	