
//................................................
// constructor
//................................................
function Math3dMesh(){
};
 
//................................................
// static methods 
//................................................
Math3dMesh.getCountTriangles = function(array_vertex_length){
	return array_vertex_length/3;	
}; //end method

Math3dMesh.getNormals = function(array_vertex){
	var cnt_triangles= Math3dMesh.getCountTriangles(array_vertex.length);	
	var array_normals = new Array(array_vertex.length);
	
	var normal_itemIndex 	= 0;
	for(var trIndex=0;trIndex<cnt_triangles;trIndex++) {
		var face_array_vertex = new Array(9);
		
		var face_array_index = 0;
		for(var vIndex=0;vIndex<3;vIndex++){
			var first_elem = (trIndex * 9) + (vIndex*3);								
			face_array_vertex[face_array_index++] =  array_vertex[first_elem];
			face_array_vertex[face_array_index++] =  array_vertex[first_elem+1];				
			face_array_vertex[face_array_index++] =  array_vertex[first_elem+2];				
		};//end for					
		
		var tr_normal =Math3dTriangle.getTriangleNormal(face_array_vertex);
		for(var vertexIndex=0;vertexIndex<3;vertexIndex++){
			array_normals[normal_itemIndex++] = tr_normal[0];
			array_normals[normal_itemIndex++] = tr_normal[1];
			array_normals[normal_itemIndex++] = tr_normal[2];
		}; //end for		
	}; //end for
	
	return array_normals;
}; //end method