
function getVertex3d_asGroupVertex(array_vertex) {
	
	var cnt_vertex = array_vertex.length / 3;
	var grs_vertex = new Array(cnt_vertex);
	var itemIndex=0;
	for(var grpIdx=0;grpIdx<cnt_vertex;grpIdx++){
		grs_vertex[grpIdx] = new Array(3);
		for(var coordIdx=0;coordIdx<3;coordIdx++){
			grs_vertex[grpIdx][coordIdx] = array_vertex[itemIndex];
			itemIndex++;
		} //end for		
	} //end for	
	return grs_vertex;
	
}; //end function

function getVertex3d_asLines2d(array_vertex,include_last_segment) {
	
	var grp_vertex = getVertex3d_asGroupVertex(array_vertex);	
	var cnt_segments= 0;
	if(include_last_segment==true){	cnt_segments= grp_vertex.length;}
	else						  {	cnt_segments= grp_vertex.length-1;}
	 	
	var lines2d_return = new Array(cnt_segments); 
	for(var vertexIndex=0;vertexIndex<grp_vertex.length;vertexIndex++){
		var next_vertexIndex = vertexIndex+1;
		var include = true;
		if( next_vertexIndex==grp_vertex.length ){
			next_vertexIndex= 0;
			if(include_last_segment==false){
				include = false;
			}
		}		
		if(include){						
			lines2d_return[vertexIndex] = new Array(2);
			
			lines2d_return[vertexIndex][0] = new Array(2);						
			lines2d_return[vertexIndex][0][0] = grp_vertex[vertexIndex][0];
			lines2d_return[vertexIndex][0][1] = grp_vertex[vertexIndex][2];
			
			lines2d_return[vertexIndex][1] = new Array(2);
			lines2d_return[vertexIndex][1][0] =  grp_vertex[next_vertexIndex][0];
			lines2d_return[vertexIndex][1][1] =  grp_vertex[next_vertexIndex][2];
		}		
	} //end for
	
	return lines2d_return;
	
}; //end function