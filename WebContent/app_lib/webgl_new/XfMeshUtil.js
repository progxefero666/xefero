/**
 * class XfMeshUtil.getMeshPolys3d(arrayVertex)
 */

class  XfMeshUtil {  
	 
	constructor() {}//end constructor
	 
	static getMeshPolys3d(arrayVertex){
		let countCoords = arrayVertex.length;
		let vertex 		= [];
		let vertexIndex = 0;
		let axisIndex 	= 0;
		vertex[0] 		= [];

		for(let coordIndex=0;coordIndex<countCoords;coordIndex++){
			vertex[vertexIndex][axisIndex] = arrayVertex[coordIndex];	
			axisIndex++;
			if(axisIndex>2){
				vertexIndex++;
				vertex[vertexIndex] = [];
				axisIndex=0
			}
		}
		
		let faces 		= [];
		let faceIndex	= 0;
		vertexIndex 	= 0;
		faces[0]	 	= [];
		for(let vIndex=0;vIndex<vertex.length;vIndex++){
			faces[faceIndex][vertexIndex] = vertex[vIndex];
			vertexIndex++;
			if(vertexIndex > 2){
				vertexIndex = 0;
				faceIndex++;
				faces[faceIndex] = [];
			}
		}
	
		let polys = [];
		let polyIndex=0;
		for(faceIndex=0;faceIndex<faces.length;faceIndex++){
			if(faces[faceIndex].length==3){
				polys[polyIndex] = new XfMesh3d(faces[faceIndex]);
				polyIndex++;
			}
			else {
				//console.log('face incorrect');
			}
		}		 
		return polys;
	}//end function	

	static getFace3dCenter(poly3dPoints){
		
		//let medianaCenter_0 = XF_Math3dUtil.getLineCenter(poly3dPoints[0],poly3dPoints[1])
		let medianaCenter_1 = XF_Math3dUtil.getLineCenter(poly3dPoints[1],poly3dPoints[2])
		/*
		let medianaCenter_2 = XF_Math3dUtil.getLineCenter(poly3d.points[2],poly3d.points[0])
		
		let medianaLine_0 = [];
		medianaLine_0[0] = poly3d.points[0];
		medianaLine_0[1] = medianaCenter_1;
		
		let medianaLine_1 = [];
		medianaLine_1[0] = poly3d.points[1];
		medianaLine_1[1] = medianaCenter_2;
		*/
		//center must be interseccion medianaLine_0 and medianaLine_1
		//simulate this before create correct functions
		let center = XF_Math3dUtil.getLineCenter(poly3dPoints[0],medianaCenter_1);
		return center;
	}//end function
	
	
	/*
	public static double[] getTriangleCenter(double[][] triangleVertex){
		double[][] trSidesCenter = new double[][]{
				MathLine.getLineCenter(triangleVertex[0],triangleVertex[1]),
				MathLine.getLineCenter(triangleVertex[1],triangleVertex[2]),
				MathLine.getLineCenter(triangleVertex[2],triangleVertex[0])		
		return MathLine.getLinesInterscVertex(
				new double[][]{triangleVertex[0],trSidesCenter[1]}, //medianas[0] 
				new double[][]{triangleVertex[1],trSidesCenter[2]});//medianas[1]		
	} //end method
	
	*/
	
	 
}//end class	 