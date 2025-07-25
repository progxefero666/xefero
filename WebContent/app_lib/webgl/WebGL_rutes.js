/**
 *  class  WebGL_rutes 
 */
 class  WebGL_rutes {        
	
	//constructor
	constructor(){}
	
}//end class

/**
 *  class  XfRutePlaneY 
 */
 class  XfRutePlaneY {        
	
	//constructor	
	//..........................................................................
	constructor(points) {
		this.points = points;		
		this.postconstructor();
	}//end constructor
	
	postconstructor(){
		this.rotationsY  = [];
		for(let ptIdx=0;ptIdx<(this.points.length-1);ptIdx++){
			this.rotationsY[ptIdx] = XF_Math3dUtil.getTwoVertexAngle_Y(this.points[ptIdx],this.points[ptIdx+1]);
		}
		this.rotationsY[this.points.length-1] = this.rotationsY[this.points.length-2];
	}//end function


}//end class