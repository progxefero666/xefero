
/**
 * class XF_Pivot
 */
class  XF_Pivot{        
    
	constructor() {//[]
		this.position = [0.0,0.0,0.0];
		this.rotation = [0.0,0.0,0.0];		
		this.pivotAxis = []; //RAxis[]
		this.regeneratePivot();
	}//end constructor
	
	regeneratePivot(){
		this.pivotAxis = []; //RAxis[3]
		this.pivotAxis[0] = new XF_RAxis(
			XF_Math3dUtil.getCloneOfArray(this.position),				
			[(this.position[0] + 1.0),this.position[1],this.position[2]]				
		);
		this.pivotAxis[1] = new XF_RAxis(
			XF_Math3dUtil.getCloneOfArray(this.position),				
			[(this.position[0]),this.position[1]+ 1.0,this.position[2]]				
		);
		
		this.pivotAxis[2] = new XF_RAxis(
			XF_Math3dUtil.getCloneOfArray(this.position),				
			[(this.position[0]),this.position[1],this.position[2]+ 1.0]				
		);
	}//end
	
	translatePivot(translation) {//[]
		for(var axis_index=0;axis_index<3;axis_index++){
			this.pivotAxis[axis_index].move_3d(translation);
		}
		XF_Geolocator.translateVertex3d(this.position,translation);			
	}//end


	movePivot(vertex) {//[]
	
		var translation = XF_Math3dUtil.getTranslation3d(this.position,vertex);	
		for(var axis_index=0;axis_index<3;axis_index++){
			this.pivotAxis[axis_index].move_3d(translation);
		}
		XF_Geolocator.translateVertex3d(this.position,translation);								
				
	}//end

	getPivotVector(axisIndex){//return XF_Veztor
		var vectorReturn = XF_Math3dUtil.getCloneOfArray(this.pivotAxis[axisIndex].vectorDirecction.getClone());
		return vectorReturn;		
	}//end	

	
	getDirecctionVertex(axis, translationDistance){//return []
	
		var vectorCalc = new XF_Veztor([
			this.pivotAxis[axis].vectorDirecction.elements[0],
			this.pivotAxis[axis].vectorDirecction.elements[1],	
			this.pivotAxis[axis].vectorDirecction.elements[2]]
		);
	
		vectorCalc.multiplyByScalar(translationDistance);
		var positionCalc = XF_Math3dUtil.getCloneOfArray(this.position);
		XF_Geolocator.translateVertex3d(positionCalc,vectorCalc.elements);
		return positionCalc;
	}//end

	getDirecctionVertexInverse(axis,translationDistance){
		var vectorClone= new XF_Veztor([
			this.pivotAxis[axis].vectorDirecction.elements[0],
			this.pivotAxis[axis].vectorDirecction.elements[1],	
			this.pivotAxis[axis].vectorDirecction.elements[2]]
		);
		var vectorCalc = XF_Veztor.getVectorInverse(vectorClone);
		vectorCalc.multiplyByScalar(translationDistance);	
		var positionCalc = XF_Math3dUtil.getCloneOfArray(this.position);
		XF_Geolocator.translateVertex3d(positionCalc,vectorCalc.elements);
		return positionCalc;
	}//end

	translate(axis,direction,translationDistance){
		if(direction==DIRECTION_POSITIVE) {
			this.movePivot(this.getDirecctionVertex(axis,translationDistance));
		}
		else {
			this.movePivot(this.getDirecctionVertexInverse(axis,translationDistance));
		}
	}//end

	rotatePivot(rotation_axis,rotation_angle){		
		var rotationMatrix = this.pivotAxis[rotation_axis].getRotationMatrix(rotation_angle);
		
		for(var axis_index=0;axis_index<3;axis_index++){
			
			if(axis_index!=rotation_axis){	
				var vertexFirstElemIndex = 0;
				var vertexRotatedElements = [];
				
				vertexRotatedElements[0] = 
					(this.pivotAxis[axis_index].axis_vertex_1[vertexFirstElemIndex] * rotationMatrix.elements[0][0]) +
					(this.pivotAxis[axis_index].axis_vertex_1[vertexFirstElemIndex+1] * rotationMatrix.elements[1][0]) +
					(this.pivotAxis[axis_index].axis_vertex_1[vertexFirstElemIndex+2] * rotationMatrix.elements[2][0]) +
					(1.0 * rotationMatrix.elements[3][0]) ;
				
				vertexRotatedElements[1] = 
					(this.pivotAxis[axis_index].axis_vertex_1[vertexFirstElemIndex] * rotationMatrix.elements[0][1]) +
					(this.pivotAxis[axis_index].axis_vertex_1[vertexFirstElemIndex+1] * rotationMatrix.elements[1][1]) +
					(this.pivotAxis[axis_index].axis_vertex_1[vertexFirstElemIndex+2] * rotationMatrix.elements[2][1]) +
					(1.0 * rotationMatrix.elements[3][1]) ;
				
				vertexRotatedElements[2] = 
					(this.pivotAxis[axis_index].axis_vertex_1[vertexFirstElemIndex] * rotationMatrix.elements[0][2]) +
					(this.pivotAxis[axis_index].axis_vertex_1[vertexFirstElemIndex+1] * rotationMatrix.elements[1][2]) +
					(this.pivotAxis[axis_index].axis_vertex_1[vertexFirstElemIndex+2] * rotationMatrix.elements[2][2]) +
					(1.0 * rotationMatrix.elements[3][2]);
				
					this.pivotAxis[axis_index] = new XF_RAxis(XF_Math3dUtil.getCloneOfArray(this.position),vertexRotatedElements);					
			}//end if
			
			if(rotation_angle>=0){
				if(axis_index==rotation_axis){	
					//console.log(XF_Math.toDegrees(this.rotation[rotation_axis]));
					this.rotation[rotation_axis] = XF_Math
				 		.getAngleInc(this.rotation[rotation_axis],rotation_angle);		
				 	//console.log(XF_Math.toDegrees(this.rotation[rotation_axis]));					
				}
			}
			else {
				this.rotation[rotation_axis] = XF_Math
				 	.getAngleDec(this.rotation[rotation_axis],rotation_angle);			
			}			
		}//end for
		
		/*
		if(rotation_angle>=0){
			this.rotation[rotation_axis] = XF_Math
			 	.getAngleInc(this.rotation[rotation_axis],rotation_angle);			
		}
		else {
			this.rotation[rotation_axis] = XF_Math
			 	.getAngleDec(this.rotation[rotation_axis],rotation_angle);			
		}
		 */   		
	}//end
	
	rotateVertex(rotation,glVertex){ //[],[]
		for(var axisIndex=0;axisIndex<3;axisIndex++){
			if(rotation[axisIndex]!=0.0){
				XF_Math3dUtil.rotateVertexByAxis(this.pivotAxis[axisIndex],rotation[axisIndex], glVertex);
				//this.rotatePivot(axisIndex,rotation[axisIndex]);
			}
		}
	}//end
	
	
}//end clas