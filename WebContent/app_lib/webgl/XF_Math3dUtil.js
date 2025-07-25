/**
 * class XF_Math3dUtil.getDistance3d(vertex_a,vertex_b)
 */
class XF_Math3dUtil{
	
	constructor() {
	}//end constructor

	static getPositionCC(){
		return [0.0,0.0,0.0]
	}//end 
	
	
	static getRotationZero(){
		return [0.0,0.0,0.0]
	}//end 
	/*

	static getVertexClone(vertex)rotateVertexByAxis
		var vertex_clone = [];
		vertex_clone[0] = vertex[0];
		vertex_clone[1] = vertex[1];
		vertex_clone[2] = vertex[2];
		return vertex_clone;
	}//end
	
	 */
	//one dimension
	static getCloneOfArray(arrayOrigin){
		//var arrayCopy = JSON.parse(JSON.stringify(arrayOrigin))
		var arrayCopy = [];
		for(var idx=0;idx<arrayOrigin.length;idx++){
			arrayCopy[idx] = arrayOrigin[idx] ;
		}
		return arrayCopy;
	}
	static getCloneOfTwoDimArray(arrayOrigin){
		var arrayCopy = [];
		for(var arrayIndex=0;arrayIndex<arrayOrigin.length;arrayIndex++){
			arrayCopy[arrayIndex] = [];			
			arrayCopy[arrayIndex][0] = arrayOrigin[arrayIndex][0]; 
			arrayCopy[arrayIndex][1] = arrayOrigin[arrayIndex][1];
			arrayCopy[arrayIndex][2] = arrayOrigin[arrayIndex][2];
		}
		return arrayCopy;
	}//end
	
	static getArrayOneDimension(arrayTwoDimension){
		var arrayOne = [];
		var indElem =0;
		for(var indFila=0;indFila<arrayTwoDimension.length;indFila++){
			for(var indCol=0;indCol<arrayTwoDimension[indFila].length;indCol++){
				arrayOne[indElem] =arrayTwoDimension[indFila][indCol];
				indElem++;
			}
		}
		return arrayOne;
	}//end
	
	static getArray3d(arrayOneDimension){
		var array3d = [];
		var countVertex = arrayOneDimension.length/3;		
		var indElem=0;
		for(var vertexIndex=0;vertexIndex<countVertex;vertexIndex++){			
			array3d[vertexIndex] =[];
			for(var indCol=0;indCol<3;indCol++){
				array3d[vertexIndex][indCol] =arrayOneDimension[indElem];
				indElem++;
			}
			
		}//end for
		return array3d;
	}//end 
	
	static getCloneVertexScaledByCC(vertex3dOrigin,scale){
		var vertex3dReturn= XF_Math3dUtil.getCloneOfArray(vertex3dOrigin);
		for(var idx=0;idx<vertex3dReturn.length;idx++){
			if(scale>=0){
				vertex3dReturn[idx]= vertex3dReturn[idx] *scale;
			}
			else{
				vertex3dReturn[idx]= vertex3dReturn[idx] /scale;
			}
		}
		return vertex3dReturn;
	}//end 
	
	
	static getTranslation3d(vertex_0,vertex_1){
		var trans3d = [];
		trans3d[0] = vertex_1[0]-vertex_0[0];
		trans3d[1] = vertex_1[1]-vertex_0[1];
		trans3d[2] = vertex_1[2]-vertex_0[2];		
		return trans3d;
	}//end
	
	
	static getDistance3d(vertex_a,vertex_b){		
		//Distancia = raiz cuadrada[(x2 - x1)² + (y2 - y1)² + (z2 - zx1)² ]				
		var diff_x 	 = vertex_b[0]-vertex_a[0];
		var diff_y 	 = vertex_b[1]-vertex_a[1];
		var diff_z 	 = vertex_b[2]-vertex_a[2];		
		return Math.sqrt((diff_x * diff_x)+(diff_y * diff_y)+(diff_z * diff_z));		
	}//end 	
	
	static getLineCenter(vertex_a,vertex_b){
		var coordCalc =[];
		for(var idx=0;idx<3;idx++){
			coordCalc[idx] = vertex_a[idx] + ((vertex_b[idx]-vertex_a[idx])/2.0);		
		}
		return coordCalc;
	}//end 	
	

	static getLineVertex(v_0, v_1, countSubdiv){
		 
		//........................................................................
		// method a
		//........................................................................		
		var traslation =XF_Math3dUtil.getTranslation3d(v_0,v_1);
		var traslationUnit = [];
		traslationUnit[0] =	traslation[0]/countSubdiv;
		traslationUnit[1] =traslation[1]/countSubdiv
		traslationUnit[2] =traslation[2]/countSubdiv;
			
		var vertexReturn = [];		
		for(var idx=0;idx<=countSubdiv;idx++) {
			vertexReturn[idx] = [];			
			vertexReturn[idx][0]=v_0[0]+traslationUnit[0]*idx;
			vertexReturn[idx][1]=v_0[1]+traslationUnit[1]*idx;
			vertexReturn[idx][2]=v_0[2]+traslationUnit[2]*idx;
		} //end for
		

		return vertexReturn;			
	}//
	 
	
	static getTwoVertexAngleZ(vertex_a,vertex_b){
		/*
		var dist_y = 0;
		if(vertex_b[1]>vertex_a[1]){
			dist_y = vertex_b[1] - vertex_a[1]; 
		}
		else{			
			dist_y = vertex_a[1] - vertex_b[1];
		}
		
		var dist_x = 0;
		if(vertex_b[0]>vertex_a[0]){
			dist_x = vertex_b[0] - vertex_a[0]; 
		}
		else{			
			dist_x =vertex_a[0] - vertex_b[0];
		}		
		if(dist_x==0){return 0;}	
		var angleZ = 0;
		if(vertex_b[0]>=vertex_a[0]){
			angleZ = Math.atan(dist_y/dist_x);
		}
		else{
			angleZ = Math.PI - Math.atan(dist_y/dist_x);
		}		

		*/
		if((vertex_b[0] - vertex_a[0])==0){return 0;}
		var dist_x = vertex_b[0] - vertex_a[0];
		var dist_y = vertex_b[1] - vertex_a[1]; 
		 
		
		var angleZ = 0;
		if(vertex_b[0]>=vertex_a[0]){
			angleZ = Math.atan(dist_y/dist_x);
		}
		else{
			angleZ = Math.PI - Math.atan(dist_y/dist_x);
		}		
		return angleZ;
	}//end 
	
	static getTwoVertexAngle_Y(glVertex_a,glVertex_b){
		let distance2dPlaneH = XF_Math3dUtil.getDistanceTwoVertexPlaneY(glVertex_a,glVertex_b);
		
		let distance2dPlaneV = 0;
		if(glVertex_b[2]>glVertex_a[2]){
			distance2dPlaneV = glVertex_b[2] - glVertex_a[2]; 
		}
		else{			
			distance2dPlaneV = (glVertex_a[2] - glVertex_b[2]) ;
		}								
		
		//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		// forzado para no dividir por zero
		if(distance2dPlaneH==0){
			distance2dPlaneH = 0.001;
		}
		//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
			
		let angleBase = Math.asin(distance2dPlaneV/distance2dPlaneH);	
					

		//...............................................................................
		if(glVertex_b[0]>=glVertex_a[0]){			 
			if(glVertex_b[2]>=glVertex_a[2]){
				
				angleBase = (Math.PI*2) - angleBase;
			}
			else{
			//angleBase = angleBase;
			}
		}
		else{
			if(glVertex_b[2]>=glVertex_a[2]){				
				angleBase = Math.PI + angleBase;
			}
			else{								
				angleBase = Math.PI- angleBase;
			}									
		}				
		//...............................................................................
							
		let angleReturn = angleBase;
		if(angleReturn>= (Math.PI*2) ){
			if(angleReturn==(Math.PI*2)){
				angleReturn = 0;	
			}		
			else{
				angleReturn = angleReturn -(Math.PI*2);	
			}			 				
		}		
		return angleReturn;	
									
	}//end 
	

	
	static getDistanceTwoVertexPlaneY(glVertex_a,glVertex_b){		
		let elem_x,elem_y;
		
		let result = 0;
		if( (glVertex_a[0]==glVertex_b[0]) && (glVertex_a[2]==glVertex_b[2]) ){
			return 0;
		}

		if( (glVertex_a[0]!=glVertex_b[0]) && (glVertex_a[2]!=glVertex_b[2]) ){
			elem_x = (glVertex_b[0]-glVertex_a[0])*(glVertex_b[0]-glVertex_a[0]);
			elem_y = (glVertex_b[2]-glVertex_a[2])*(glVertex_b[2]-glVertex_a[2]);		
			result = Math.sqrt(elem_x + elem_y);		
		}
		else{
			if(glVertex_a[0]==glVertex_b[0]){
				if(glVertex_a[2]>glVertex_b[2]){
					result = glVertex_a[2] - glVertex_b[2];
				}
				else{
					result = glVertex_b[2] - glVertex_a[2];
				}
			}
			if(glVertex_a[2]==glVertex_b[2]){
				if(glVertex_a[0]>glVertex_b[0]){
					result = glVertex_a[0] - glVertex_b[0];
				}
				else{
					result = glVertex_b[0] - glVertex_a[0];
				}			
			}			
		}
		return result;
	} //end function
		
	
	
	static get_mmatrix_mult( matrix_a, matrix_b) { //Matrix4x4,Matrix4x4
		var value_calc;
		var m_elem = [];//[][]
		
		for(var row_a_index=0;row_a_index<4;row_a_index++){
			m_elem[row_a_index]=[];
			for(var col_b_index=0;col_b_index<4;col_b_index++){
				value_calc = 0;
				for(var aux_index=0;aux_index<4;aux_index++){
					var valueMult = matrix_a.elements[row_a_index][aux_index] 
					              * matrix_b.elements[aux_index][col_b_index]
					value_calc = value_calc + valueMult;					
				}
				m_elem[row_a_index][col_b_index] = value_calc;
			}
		}
		return new XF_Matrix4x4(m_elem);
	}//end 
	
	
	static getVectorModulus(vector){
		var dot_value = XF_Veztor.dot(vector, vector);
		var modulus_value =  Math.sqrt(dot_value);
		return modulus_value;
	}//end
	
	static getVectorUnit(vector){ //XF_Veztor
		var modulus_value = XF_Math3dUtil.getVectorModulus(vector);
		var new_values= [];
		for(var coord_index=0;coord_index<vector.elements.length;coord_index++){
			new_values[coord_index] = vector.elements[coord_index]/modulus_value;
		}
		return new XF_Veztor(new_values);				
	}//end
	
	static getAxisRotationMatrix(axisIndex,angle){
		return XF_RAxis.getAxisRotation(axisIndex).getRotationMatrix(angle);		
	}//end
	
	static rotateVertex(rotationMatrix, glVertex){
		var vertexCount = glVertex.length / 3;
		for(var vIndex=0;vIndex<vertexCount;vIndex++){
			
			var vertexFirstElemIndex = vIndex * 3;
			
			var vertexRotatedElements = [];
			vertexRotatedElements[0] = [];
			vertexRotatedElements[1] = [];
			vertexRotatedElements[2] = [];
			vertexRotatedElements[3] = [];
			
			vertexRotatedElements[0] = 
				(glVertex[vertexFirstElemIndex]   * rotationMatrix.elements[0][0]) +
				(glVertex[vertexFirstElemIndex+1] * rotationMatrix.elements[1][0]) +
				(glVertex[vertexFirstElemIndex+2] * rotationMatrix.elements[2][0]) +
				(1.0 * rotationMatrix.elements[3][0]);
			
			vertexRotatedElements[1] = 
				(glVertex[vertexFirstElemIndex] * rotationMatrix.elements[0][1]) +
				(glVertex[vertexFirstElemIndex+1] * rotationMatrix.elements[1][1]) +
				(glVertex[vertexFirstElemIndex+2] * rotationMatrix.elements[2][1]) +
				(1.0 * rotationMatrix.elements[3][1]);
			
			vertexRotatedElements[2] = 
				(glVertex[vertexFirstElemIndex] * rotationMatrix.elements[0][2]) +
				(glVertex[vertexFirstElemIndex+1] * rotationMatrix.elements[1][2]) +
				(glVertex[vertexFirstElemIndex+2] * rotationMatrix.elements[2][2]) +
				(1.0 * rotationMatrix.elements[3][2]); 
			
			vertexRotatedElements[3] = 
				(glVertex[vertexFirstElemIndex] * rotationMatrix.elements[0][3]) +
		     	(glVertex[vertexFirstElemIndex+1] * rotationMatrix.elements[1][3]) +
		     	(glVertex[vertexFirstElemIndex+2] * rotationMatrix.elements[2][3]) +
			 	(1.0 * rotationMatrix.elements[3][3]);
				
			glVertex[vertexFirstElemIndex]   = vertexRotatedElements[0];
			glVertex[vertexFirstElemIndex+1] = vertexRotatedElements[1];
			glVertex[vertexFirstElemIndex+2] = vertexRotatedElements[2];
			
		}//end for
		
	}//end

	static rotateVertexByAxis(axisRot,angle, glVertex){//RAxis axisRot,float angle,float[] glVertex
		
		XF_Math3dUtil.rotateVertex(axisRot.getRotationMatrix(angle), glVertex);
	}//end
	
	static rotateVertexByAxisIndex(axisIndex,angle,glVertex){//int axisIndex,float angle,float[] glVertex
		var rotMatrix =XF_Math3dUtil.getAxisRotationMatrix(axisIndex, angle);
		
		XF_Math3dUtil.rotateVertex(rotMatrix, glVertex);
	}//end
	
	static getVertexSelectionForSphere(center,axisIndex,radius,countSides,angle,countVertexReturn){
		var vertexReturn = []
		var angle_inc= (Math.PI * 2) / countSides;	
		var angle_vertex	= XF_Math.getAngleInc(0.0,angle);	
		for(var idx=0;idx<countVertexReturn;idx++){
			vertexReturn[idx] = XF_Math3dCf.getCf3dOneVertex(axisIndex,center, radius, angle_vertex);
			angle_vertex	= XF_Math.getAngleInc(angle_vertex,angle_inc);
		}
		return vertexReturn;
	}//end
		
	static getSphereAllVertex(position,radius,countSides){
		let	numLayers = countSides + 1;
		
		let plane_z_vertex =XF_Math3dUtil
			.getVertexSelectionForSphere([0,0,0],2,radius,(countSides*2),(Math.PI/2),numLayers);
				
		let layer_radius = [];
		let layersCoordY = [];
		for(let layerIndex=0;layerIndex<numLayers;layerIndex++){
			layersCoordY[layerIndex] = plane_z_vertex[layerIndex][1];			
			layer_radius[layerIndex] =Math.abs(plane_z_vertex[layerIndex][0]);	
		}
		layer_radius[0] = 0.0;
		layer_radius[numLayers-1] = 0.0;
		
		
		//...................................................................
		let  cfPosition = [position[0],position[1],position[2]]
		
		let vertexReturn = [];		
		let itemIndex = 0;
		for(let layerIndex=0;layerIndex< (numLayers-1);layerIndex++) {	
			cfPosition[1] = layersCoordY[layerIndex] + position[1];
			
			let layerVertex = XF_Math3dCf.getCf3dAllVertex(
				1,
				cfPosition,
				layer_radius[layerIndex],
				countSides,XF_Math3dCf.ROTATION_NEGATIVE,
				0.0
			);
			for(let idx=0;idx< layerVertex.length;idx++) {
				vertexReturn[itemIndex] = layerVertex[idx];
				itemIndex++;
			}			

		}//end for
		
		
		return vertexReturn;		
	}//end
		
}//end class