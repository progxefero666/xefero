/**
 * class XfPolyUtil.getPolys3d
 */

class  XfPolyUtil {  
	 
	constructor() {}//end constructor
	 
	static getPolys3d(arrayVertex){
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
			if(vertexIndex > 3){
				vertexIndex = 0;
				faceIndex++;
				faces[faceIndex] = [];
			}
		}
	
		let polys = [];
		let polyIndex=0;
		for(faceIndex=0;faceIndex<faces.length;faceIndex++){
			if(faces[faceIndex].length==4){
				polys[polyIndex] = new XfPoly3d(faces[faceIndex]);
				polyIndex++;
			}
			else {
				//console.log('face incorrect');
			}
		}		 
		
		//console.log(faces.length);//1138   18216
		return polys;
	}//end function	

	static getPoly3dCenter(poly3dPoints){
		let center = XF_Math3dUtil.getLineCenter(poly3dPoints[0],poly3dPoints[3])
		return center;
	}//end function
	

	 
}//end class	 