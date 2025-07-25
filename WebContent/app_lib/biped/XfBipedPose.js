/**
 * class  XfBipedPose
 */

  class  XfBipedPose {        
	
	//constructor	
	//..........................................................................
	constructor(id,posedBones) {
		this.id = id;
		this.posedBones	= posedBones;
	}//end constructor
	
	chargePosedBone(posedBone){
		if(this.posedBones==null){
			this.posedBones=[];
			this.posedBones[0]=posedBone;
		}
		else {
			this.posedBones[this.posedBones.length]=posedBone;
		}
	}//end funcion
	
}//end class