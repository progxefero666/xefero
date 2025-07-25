/**
 * class XfRute2dUtil.getRuteFromRectangle(center,halfSideX,halfSideZ,sideNumItems);
 */

 class XfRute2dUtil {        
    
	constructor() {
			
	}//end constructor
	
	/*
	static getRuteFromRectangle(center,halfSideX,halfSideZ,sideNumItems){
	
		let rectPoints = [];
		rectPoints[0]= [halfSideX,		halfSideZ];
		rectPoints[1]= [halfSideX*(-1),	halfSideZ];
		rectPoints[2]= [halfSideX*(-1),	halfSideZ*(-1)];
		rectPoints[3]= [halfSideX,		halfSideZ*(-1)];
		
		let sideA_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[0],rectPoints[1],sideNumItems);
		let sideB_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[1],rectPoints[2],sideNumItems);
		let sideC_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[2],rectPoints[3],sideNumItems);
		let sideD_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[3],rectPoints[0],sideNumItems);
		
		let pointIndex = 0;
		let ruteItems = [];
		
		let tangentAngle = Math.PI;
		for(var idx=0;idx<sideA_points.length;idx++){
			ruteItems[pointIndex] = new XfRute2dItem(sideA_points[idx],tangentAngle);			
			pointIndex++;
		}
		
		tangentAngle = Math.PI + (Math.PI/2);
		for(var idx=0;idx<sideB_points.length;idx++){
			ruteItems[pointIndex] = new XfRute2dItem(sideB_points[idx],tangentAngle);
			pointIndex++;
		}
		
		tangentAngle = 0;
		for(var idx=0;idx<sideC_points.length;idx++){
			ruteItems[pointIndex] = new XfRute2dItem(sideC_points[idx],tangentAngle);
			pointIndex++;
		}
		
		tangentAngle = Math.PI/2
		for(var idx=0;idx<sideD_points.length;idx++){
			ruteItems[pointIndex] = new XfRute2dItem(sideD_points[idx],tangentAngle);
			pointIndex++;
		}
		return new XfRute2d(ruteItems);
	}//end
	*/	
	static getRuteFromCf(center,radius,numItems){
		
		let ruteItems = [];
		let angle_inc= (Math.PI*2) / numItems;
		let currentAngle= 0.0;
		for(var idx=0;idx<numItems;idx++){
			let position =XF_Math2dCf.getCfPoint(center,radius,currentAngle);
			currentAngle = XF_Math.getAngleInc(currentAngle,angle_inc);
			let tangentAngle =  XF_Math.getAngleInc(currentAngle,(Math.PI/2));
			ruteItems[idx] = new XfRute2dItem(position,tangentAngle);			
		}
		return new XfRute2d(ruteItems);
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
	
}//end class