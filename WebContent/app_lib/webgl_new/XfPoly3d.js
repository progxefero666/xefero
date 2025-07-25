/**
 * class XfMesh3d
 */

 class  XfPoly3d {        
	
	//constructor	
	//..........................................................................
	constructor(points) { //[3][3]
		this.points = points;
		this.center = XfPolyUtil.getPoly3dCenter(this.points);
		//this.postConstructor();		
	}//end constructor	
	
	static create(point1,point2,point3,point4) {
		return new XfPoly3d([point1,point2,point3,point4]);
	}//end constructor
	

	
}//end class

