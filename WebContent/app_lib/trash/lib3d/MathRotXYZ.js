//................................................
// constructor
//................................................
function MathRotXYZ(){
	
};

//................................................
//static constants 
//................................................
//MathRotXYZ.C = 


//................................................
// static methods 
//................................................
MathRotXYZ.getAngleY = function(vertex_0,vertex_1){
	
	var distance_inPlaneY = Math3d.getDistance_inPlaneY(vertex_0,vertex_1);
	var distance_inPlaneV = 0.0;
	if(vertex_1[2]>vertex_0[2]){
		distance_inPlaneV = vertex_1[2] - vertex_0[2]; 
	}
	else{			
		distance_inPlaneV = (vertex_0[2] - vertex_1[2]) ;
	}								
	
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	// forzado para no dividir por zero
	if(distance_inPlaneY==0){
		distance_inPlaneY = 0.001;
	}
	//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::	
	var angleBase = Math.asin(distance_inPlaneV/distance_inPlaneY);				
	 
	//...............................................................................
	if(vertex_1[0]>=vertex_0[0]){			 
		if(vertex_1[2]>=vertex_0[2]){}//angleBase = angleBase;
		else{
			angleBase = (Math.PI*2)- angleBase;
		}
	}
	else{
		if(vertex_1[2]>=vertex_0[2]){				
			angleBase = Math.PI- angleBase;
		}
		else{				
			angleBase = Math.PI + angleBase;
		}									
	}				
	//...............................................................................
	
	var angleReturn = angleBase;
	if(angleReturn==(Math.PI*2)){angleReturn = 0.0;}		
	//if(angleReturn>(Math.PI*2)) {//console.log("ERRROR GMATH CHECK");
	return angleReturn;	
	
}; //end method

MathRotXYZ.getAngleX = function(vertex_0,vertex_1){
	
}; //end method

MathRotXYZ.getAngleZ = function(vertex_0,vertex_1){
	
}; //end method

MathRotXYZ.getDirectionAngleY = function(vector){	
	return MathRotXYZ.getAngleY(Math3d.VCC,vector.elements);
}; //end method


