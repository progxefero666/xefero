//................................................
// constructor
//................................................
function Math3dCf(){
};
 
//................................................
// static methods 
//................................................
Math3dCf.getFcOn = function(axis,vcenter,radius,rotation){
	
	var vertex_return = new Array(3);		
	switch(axis){
		case 0:
			vertex_return[0] = vcenter[0];
			vertex_return[1] = vcenter[1] + (radius * Math.cos(rotation));
			vertex_return[2] = vcenter[2] + (radius * Math.sin(rotation));
			break;		
		case 1:
			vertex_return[0] = vcenter[0] + (radius * Math.cos(rotation));				
			vertex_return[1] = vcenter[1];							
			vertex_return[2] = vcenter[2] + (radius * Math.sin(rotation));		
			break;		
		case 2:
			vertex_return[0] = vcenter[0] + (radius * Math.cos(rotation));										
			vertex_return[1] = vcenter[1] - (radius * Math.sin(rotation));
			vertex_return[2] = vcenter[2];
			break;				
	}			
	return (val1*val2);
	
}; //end function