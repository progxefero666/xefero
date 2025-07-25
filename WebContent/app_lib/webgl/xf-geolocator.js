/**
 * class XF_Geolocator.translateVertex3d(vertex3d,trans3d )
 */
class XF_Geolocator{
	
	constructor() {
	}//end constructor

	static translateVertex3d(vertex3d,trans3d ){
		for(var idx=0;idx<vertex3d.length;idx++){
			vertex3d[idx]+= trans3d[idx];				
		}//end for
		
	}//end 
	
	static translateGroupVertex(grpVertex,trans3d ){
		for(var vertexIndex=0;vertexIndex<grpVertex.length;vertexIndex++){
			for(var idx=0;idx<3;idx++){
				grpVertex[vertexIndex][idx]+= trans3d[idx];
			}			
		}//end for
	}//end 

	static rotateVertexInAxis(axisIndex,rotation,arrayVertex3d){
		var arraySerial = XF_Math3dUtil.getArrayOneDimension(arrayVertex3d);
		var pivot = new XF_Pivot();	
		
		XF_Math3dUtil.rotateVertexByAxis(pivot.pivotAxis[axisIndex],rotation,arraySerial);
		
		var arrayVertex3dReturn = XF_Math3dUtil.getArray3d(arraySerial);		
		return arrayVertex3dReturn;
	}//end 
		
	static rotateVertex(rotation,glVertex){ //[],[]
		var pivot = new XF_Pivot();	
		for(var axisIndex=0;axisIndex<3;axisIndex++){
			if(rotation[axisIndex]!=0.0){
				XF_Math3dUtil.rotateVertexByAxis(pivot.pivotAxis[axisIndex],rotation[axisIndex], glVertex);
				//pivot.rotatePivot(axisIndex,rotation[axisIndex]);
			}
		}
	}//end

	
}//end class
	