
//................................................
// constructor
class  XfMathVector {        
    
	constructor(){}
	
	static getVectors(triangle_array_vertex){			
		var array_vectors = new Array(3);
		var vectorIndex = 0;
		for(var vertexIndex=2;vertexIndex>=0;vertexIndex--){
			var vertexFirstCoordIndex = (vertexIndex * 3);
			array_vectors[vectorIndex] = XF_Veztor.create( 
				new Array(
					triangle_array_vertex[vertexFirstCoordIndex],
					triangle_array_vertex[vertexFirstCoordIndex+1],
					triangle_array_vertex[vertexFirstCoordIndex+2])
			);
			vectorIndex++;
		};	
		return array_vectors;
	}; //end method
		
	static getVectorAngle_Y(vector){		
		return XF_Math3dUtil.getTwoVertexAngle_Y([0,0,0],vector.elements);		
	} //end method
			
}//end class
 

