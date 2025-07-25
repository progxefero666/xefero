/**
 * class XfLineVector
 */
class  XfLineVector{        
    
	constructor(coords,direction){
		this.coords 	= coords;
		this.direction  = direction;
		this.angleY = XfMathVector.getVectorAngle_Y(this.direction);
	}//end constructor
	
	static create(coords,coords_end){
		let direction = Veztor.create(XF_Math3dUtil.getTranslation3d(coords,coords_end));		
		return new XfLineVector(coords,direction);
	} //end constructor
	
}//end class