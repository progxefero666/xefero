/**
 * class XfMesh3d
 */

 class  XfMesh3d {        
	
	//constructor	
	//..........................................................................
	constructor(points) { //[3][3]
		this.points = points;
		this.center = XfMeshUtil.getFace3dCenter(this.points);
		this.postConstructor();		
	}//end constructor	
	
	static create(point1,point2,point3) {
		return new XfMesh3d([point1,point2,point3]);
	}//end constructor
	
	postConstructor(){
		
		let poly2dPoints = [];
		poly2dPoints[0] = [this.points[0][0],this.points[0][2]];
		poly2dPoints[1] = [this.points[1][0],this.points[1][2]];
		poly2dPoints[2] = [this.points[2][0],this.points[2][2]];
		this.poly2d = new XfPoly2d(poly2dPoints);
		
	}//end function

	
}//end class

