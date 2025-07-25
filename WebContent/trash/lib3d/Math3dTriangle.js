
//................................................
// constructor
//................................................
function Math3dTriangle(){};
 
//................................................
// static methods 
//................................................
Math3dTriangle.getTrianglePlaneVectors = function(triangle_array_vertex){
	var array_vectors = Math3dVector.getVectors(triangle_array_vertex);
	var plane_vectors = new Array(2);
	plane_vectors[0] = array_vectors[0].dup().subtract(array_vectors[1].dup());
	plane_vectors[1] = array_vectors[1].dup().subtract(array_vectors[2].dup());
	return plane_vectors;
};

Math3dTriangle.getTriangleNormal = function(triangle_array_vertex){	
	var plane_vectors = Math3dTriangle.getTrianglePlaneVectors(triangle_array_vertex);
	var normal_vector = plane_vectors[0].cross(plane_vectors[1]);
	return normal_vector.elements;
}; //end normal

