/**
 * XF_Math2dCf.getCfPoint(center,radius,angle_y){
 */

class  XF_Math2dCf {        
   	
	constructor() {				
	}//end constructor

	static getCfAngle(pointCenter,pointCalc){

		var angle = Math.atan2(pointCalc[1]- pointCenter[1],pointCalc[0] - pointCenter[0]);
		return angle;
	}
	
	static getCfPoint(center,radius,angle_y){
		var coord_x = center[0] + ( radius * Math.cos(angle_y));
		var  coord_y = center[1] + ( radius * Math.sin(angle_y));		
		return [coord_x,coord_y];	
	}//end

	static getCfPoints(center,radius,numSides){
		var angle_inc= (Math.PI*2) / numSides;
		var arrayVertex=[];
		
		var currentAngle= 0.0;
		for(var vertexIndex=0;vertexIndex<numSides;vertexIndex++){
			arrayVertex[vertexIndex]=XF_Math2dCf.getCfPoint(center,radius,currentAngle);
			currentAngle = XF_Math.getAngleInc(currentAngle,angle_inc);
		}//end for
		return arrayVertex;		
	}//end
	
	static getCfAngleRanges(angleStart,countSides){		
		var angle_inc	= (Math.PI*2)  / countSides;		
		var angleInit 	= angleStart;
		//var angleEnd 	= XF_Math.getAngleInc(angleInit,angle_inc);		
		var ranges		= [];
		for(var idx=0;idx<countSides;idx++){
			ranges[idx] = [];
			ranges[idx][0] = angleInit;
			ranges[idx][1] = angle_inc;
			angleInit= XF_Math.getAngleInc(angleInit,angle_inc);
			//angleEnd = XF_Math.getAngleInc(angleEnd,angle_inc);
		}
		return ranges;	
	}//end

	static getCfSelectPoints(center,radius,angleInit,angleRange,countVertex){
		var angle_inc= angleRange / (countVertex-1);
		var arrayVertex=[];
		
		var currentAngle=  angleInit;
		for(var vertexIndex=0;vertexIndex<countVertex;vertexIndex++){
			arrayVertex[vertexIndex]=XF_Math2dCf.getCfPoint(center,radius,currentAngle);
			currentAngle = XF_Math.getAngleInc(currentAngle,angle_inc);
		}
		
		return arrayVertex;		
	}//end
	
	static getRelationAngle(vertex_a,vertex_b){
		var dist_y = 0;
		if(vertex_b[1]>vertex_a[1])	{dist_y = vertex_b[1] - vertex_a[1];}
		else						{dist_y = vertex_a[1] - vertex_b[1];}
		
		var dist_x = 0;
		if(vertex_b[0]>vertex_a[0])	{dist_x = vertex_b[0] - vertex_a[0];}
		else						{dist_x =vertex_a[0] - vertex_b[0];	}		
		if(dist_x==0){return 0;}		
				
		var angleCalc = 0.0;
		if(vertex_b[0]>=vertex_a[0]){angleCalc = Math.atan(dist_y/dist_x);}
		else						{angleCalc = Math.PI - Math.atan(dist_y/dist_x);}		
		
		var angleReturn = angleCalc;
		if(vertex_b[1]<vertex_a[1]){
			angleReturn = (Math.PI*2) -angleCalc
		}
		return angleReturn;		
		
	}//end 
	
	/*
	static getRelationAngle(vertex_a,vertex_b){
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
		
		
		var angleCalc = 0.0;
		if(vertex_b[0]>=vertex_a[0]){
			angleCalc = Math.atan(dist_y/dist_x);
		}
		else{
			angleCalc = Math.PI - Math.atan(dist_y/dist_x);
		}		
		
		var angleReturn = angleCalc;
		return angleReturn;		
		
	}//end 	 
	static getCfSelectPoints(center,radius,angleCenter,angleRange,countVertex){
		var angle_inc= angleRange / (countVertex-1);
		var arrayVertex=[];
		
		var currentAngle=  XF_Math.getAngleDec(angleCenter,(angleRange/2.0));
		for(var vertexIndex=0;vertexIndex<countVertex;vertexIndex++){
			arrayVertex[vertexIndex]=XF_Math2dCf.getCfPoint(center,radius,currentAngle);
			currentAngle = XF_Math.getAngleInc(currentAngle,angle_inc);
		}
		
		return arrayVertex;		
	}//end
	*/
}//end class

