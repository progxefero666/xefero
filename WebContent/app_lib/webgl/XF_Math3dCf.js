/**
 * class XF_Math3dCf.getCf3dOneVertex(axisIndex,vertexCenter,radius,rotationInPlane)
 */

class  XF_Math3dCf {        
   	
	constructor() {				
	};//end constructor
	
	static ROTATION_POSITIVE = 0;
	static ROTATION_NEGATIVE = 1;
	
	static getCf3dOneVertex(axisIndex,vertexCenter,radius,rotationInPlane){
		let vertexReturn = [0,0,0];
		
		switch (axisIndex) {
			case 0:
				vertexReturn[0] = vertexCenter[0];
				vertexReturn[1] = vertexCenter[1] + (radius * Math.cos(rotationInPlane));
				vertexReturn[2] = vertexCenter[2] + (radius * Math.sin(rotationInPlane));				
				break;
			case 1:
				vertexReturn[0] = vertexCenter[0] + (radius * Math.cos(rotationInPlane));
				vertexReturn[1] = vertexCenter[1];
				vertexReturn[2] = vertexCenter[2] - (radius * Math.sin(rotationInPlane));							
				break;
	 		case 2:
				vertexReturn[0] = vertexCenter[0] + (radius * Math.cos(rotationInPlane));
				vertexReturn[1] = vertexCenter[1] - (radius * Math.sin(rotationInPlane));
				vertexReturn[2] = vertexCenter[2];						 
	    		break;
		 	default:
	    };
	    
		return vertexReturn;
	};//end function	
	static getCf3dAllVertex(axisIndex,vertexCenter,radius,numSides,direction,rotationInPlane){
		let angle_inc 	 = (Math.PI*2) / numSides;	
		let angle_vertex =  XF_Math.getAngleInc(0.0,rotationInPlane);
		let listVertex 	 = [];
		for(let sideIndex=0;sideIndex<numSides;sideIndex++){
			listVertex[sideIndex] = XF_Math3dCf.getCf3dOneVertex(axisIndex,vertexCenter,radius,angle_vertex);
			
			if(direction==XF_Math3dCf.ROTATION_POSITIVE){
				angle_vertex= XF_Math.getAngleInc(angle_vertex,angle_inc);				
			}
			else {
				angle_vertex= XF_Math.getAngleDec(angle_vertex,angle_inc);
			}
			
		}//end for		
		return listVertex;
	};//end function
	static getCfVertexPlaneZ(vertexCenter,radius,numSides){//,direction
		let angle_inc 	 = (Math.PI*2) / numSides;	
		let angle_vertex =  0.0;
		let listVertex 	 = [];
		for(let sideIndex=0;sideIndex<numSides;sideIndex++){
			listVertex[sideIndex] = XF_Math3dCf.getCf3dOneVertex(2,vertexCenter,radius,angle_vertex);
			//if(direction==XF_Math3dCf.ROTATION_POSITIVE){
				angle_vertex= XF_Math.getAngleInc(angle_vertex,angle_inc);				
			//}
			//else {angle_vertex= MathAngle.getAngleDec(angle_vertex,angle_inc);}			
		}//end for		
		return listVertex;
	};//end function
	static getCfVertexPlaneZattCC(radius,numSides){//,direction
		let vertexCenter = [0,0,0];
		let angle_inc 	 = (Math.PI*2) / numSides;	
		let angle_vertex =  0.0;
		let listVertex 	 = [];
		for(let sideIndex=0;sideIndex<numSides;sideIndex++){
			listVertex[sideIndex] = XF_Math3dCf.getCf3dOneVertex(2,vertexCenter,radius,angle_vertex);
			angle_vertex= XF_Math.getAngleInc(angle_vertex,angle_inc);					
		}//end for		
		return listVertex;
	};//end function	
	static getCfTransXYinPlaneZ(radius,numSides){//,direction
		let vertexCenter = [0,0,0];
		let angle_inc 	 = (Math.PI*2) / numSides;	
		let angle_vertex =  0.0;
		let listTransXY 	 = [];
		for(let sideIndex=0;sideIndex<numSides;sideIndex++){
			let currentVertex = XF_Math3dCf.getCf3dOneVertex(2,vertexCenter,radius,angle_vertex);
			listTransXY[sideIndex] = [currentVertex[0],currentVertex[1]];
			angle_vertex= XF_Math.getAngleInc(angle_vertex,angle_inc);					
		}//end for		
		return listTransXY;
		
	};//end function	
		
	static getCfRutePlaneY(vertexCenter,radius,numSides,direction,rotationInPlane){
		let rutePlaneY_vertex = XF_Math3dCf.getCf3dAllVertex(1,vertexCenter,radius,numSides,direction,rotationInPlane);
		return new XfRutePlaneY(rutePlaneY_vertex);
	};//end function	
		

				
} //end class