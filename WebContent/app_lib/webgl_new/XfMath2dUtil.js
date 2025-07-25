/**
 * XF_Math2dUtil.getDistance2d(point0,point1)
 */
class XF_Math2dUtil{
	
	constructor() {
	}//end constructor

	static getDistance2d(point0,point1) {
		var diff_x = point1[0]-point0[0];
		var diff_y = point1[1]-point0[1];				
		return Math.sqrt((diff_x*diff_x)+(diff_y*diff_y));		
	}
	
	//functions: linesMB
	//.......................................................................................
	static getLineFactorM(lineCoord) {	
		var diff_X = lineCoord[1][0] - lineCoord[0][0];
		if(diff_X==0){diff_X= 0.0000001;}
		
		var diff_Y = lineCoord[1][1] - lineCoord[0][1];
		if(diff_Y==0){diff_Y= 0.0000001;}

		return (diff_Y/diff_X);
	};//end function

	static getLineFactorB(lineCoord) {
		var diff_X = lineCoord[1][0] - lineCoord[0][0];
		if(diff_X==0){diff_X= 0.0000001;}
		
		var diff_Y = lineCoord[1][1] - lineCoord[0][1];
		if(diff_Y==0){diff_Y= 0.0000001;}
		
		var factorYX = (lineCoord[0][1]*lineCoord[1][0]) 
					 - (lineCoord[1][1]*lineCoord[0][0]);
		return (factorYX /diff_X);			
	};//end function

	//functions: lines 2d
	//.......................................................................................
	static getLinesIntersectionPoint(lineA,lineB) {
		var factorB 	= (lineB.b-lineA.b);
		var factorM 	= (lineA.m-lineB.m);	
		var factorBM10 	= (lineB.b*lineA.m);		
		var factorBM01 	= (lineA.b*lineB.m);	
		var factorBM	= factorBM10 - factorBM01;
		
		var coordX = factorB  / factorM;
		var coordY = factorBM / factorM;		
		return [coordX,coordY];
	}

	static getLineCenterPoint(vertex_a,vertex_b) {
		var coordCalc = [];
		for(var idx=0;idx<3;idx++){
			coordCalc[idx] = Math.floor(vertex_a[idx] + ((vertex_b[idx]-vertex_a[idx])/2));		
		}
		return coordCalc
	};//end function


	static getLinePoints(pPointA,pPointB,numPoints){
		var IncX= (pPointB[0]-pPointA[0]) / numPoints; 
		var IncY= (pPointB[1]-pPointA[1]) / numPoints;
		
		var linePoints = [];	
		for(var ptIndex=0;ptIndex<=numPoints;ptIndex++){
			var posX= pPointA[0] + (IncX *ptIndex);
			var posY= pPointA[1] + (IncY *ptIndex);
			linePoints[ptIndex]= [posX,posY];
		}
		return linePoints;
	};


	static getLinePointsEscFinal(pPointA,pPointB,numPoints){
		var IncX= (pPointB[0]-pPointA[0]) / numPoints; 
		var IncY= (pPointB[1]-pPointA[1]) / numPoints;
		var linePoints = [];	
		for(var ptIndex=0;ptIndex<numPoints;ptIndex++){
			var posX= pPointA[0] + (IncX *ptIndex);
			var posY= pPointA[1] + (IncY *ptIndex);
			linePoints[ptIndex]= [posX,posY];
		}
		//console.log(linePoints);
		return linePoints;
	};
	



}//end class





