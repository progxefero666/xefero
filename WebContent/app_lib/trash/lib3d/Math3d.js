//................................................
// constructor
//................................................
function Math3d(){
};

//................................................
//static constants
//................................................
Math3d.VCC = new Array(0.0,0.0,0.0);
	
//................................................
// static methods 
//................................................
Math3d.getVCC = function(){
	return new Array(0.0,0.0,0.0);
};

Math3d.getTranslation3d = function(vertex_0,vertex_1){	
	return new Array(
		vertex_1[0]-vertex_0[0],
		vertex_1[1]-vertex_0[1],
		vertex_1[2]-vertex_0[1]
	);	
};
	
Math3d.getTranslation3d_asVector = function(vertex_0,vertex_1){
	var trans3d =Math3dVertex.getTranslation3d (vertex_0,vertex_1);
	return Vector.create(trans3d);
};

Math3d.getDistance_inPlaneY = function(vertex_0,vertex_1){
	var elem_x,elem_y;
	var result = 0.0;

	if( (vertex_0[0]==vertex_1[0]) && (vertex_0[2]==vertex_1[2]) ){
		return 0;
	}
	if( (vertex_0[0]!=vertex_1[0]) && (vertex_0[2]!=vertex_1[2]) ){
		
		elem_x = (vertex_1[0]-vertex_0[0])*(vertex_1[0]-vertex_0[0]);
		elem_y = (vertex_1[2]-vertex_0[2])*(vertex_1[2]-vertex_0[2]);		
		result = Math.sqrt(elem_x + elem_y);			
	}
	else{
		if(vertex_0[0]==vertex_1[0]){
			if(vertex_0[2]>vertex_1[2]){
				result = vertex_0[2] - vertex_1[2];
			}
			else{
				result = vertex_1[2] - vertex_0[2];
			}
		}
		if(vertex_0[2]==vertex_1[2]){
			if(glVertex_a[0]>vertex_1[0]){
				result = vertex_0[0] - glVertex_b[0];
			}
			else{
				result = vertex_1[0] - vertex_0[0];
			}			
		}					
	}	
	return result;
	
}; //end method

Math3d.getDistance_inPlaneX = function(vertex_0,vertex_1){
	var elem_x,elem_y;		
	var result = 0.0;
	if( (vertex_0[1]==vertex_1[1]) && (vertex_0[2]==vertex_1[2]) ){
		return 0.0;
	}

	if( (vertex_0[1]!=vertex_1[1]) && (vertex_0[2]!=vertex_1[2]) ){
		elem_x = (vertex_1[1]-vertex_0[1])*(vertex_1[1]-vertex_0[1]);
		elem_y = (vertex_1[2]-vertex_0[2])*(vertex_1[2]-vertex_0[2]);		
		result = Math.sqrt(elem_x + elem_y);			
	}
	else{
		if(vertex_0[1]==vertex_1[1]){
			if(vertex_0[2]>vertex_1[2]){
				result = vertex_0[2] - vertex_1[2];
			}
			else{
				result = vertex_1[2] - vertex_0[2];
			}
		}
		if(vertex_0[2]==vertex_1[2]){
			if(vertex_0[1]>vertex_1[1]){
				result = vertex_0[1] - vertex_1[1];
			}
			else{
				result = vertex_1[1] - vertex_0[1];
			}			
		}			
	}					
	return result;				
}; //end method


Math3d.getDistance_inPlaneZ = function(vertex_0,vertex_1){
	var elem_x,elem_y;
	
	var result = 0.0;
	if( (vertex_0[1]==vertex_1[1]) && (vertex_0[0]==vertex_1[0]) ){
		return 0.0;
	}

	if( (vertex_0[1]!=vertex_1[1]) && (vertex_0[0]!=vertex_1[0]) ){
		elem_x = (vertex_1[1]-vertex_0[1])*(vertex_1[1]-vertex_0[1]);
		elem_y = (vertex_1[0]-vertex_0[0])*(vertex_1[0]-vertex_0[0]);		
		result = Math.sqrt(elem_x + elem_y);			
	}
	else{
		if(vertex_0[1]==vertex_1[1]){
			if(vertex_0[0]>vertex_1[0]){
				result = vertex_0[0] - vertex_1[0];
			}
			else{
				result = vertex_1[0] - vertex_0[0];
			}
		}
		if(vertex_0[0]==vertex_1[0]){
			if(vertex_0[1]>vertex_1[1]){
				result = vertex_0[1] - vertex_1[1];
			}
			else{
				result = vertex_1[1] - vertex_0[1];
			}			
		}			
	}					
	return result;			
	
}; //end method
	