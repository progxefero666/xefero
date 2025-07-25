/**
 * class XfRute3dUtil.getRuteFromRectangle(center,halfSideX,halfSideZ,sideNumItems,elevation)
 */
 class XfRute3dUtil {        
    
	constructor() {
	}//end constructor

	
	static getRuteFromRectangle(center,halfSideX,halfSideZ,elevation,velocityPercent){
	
		let aletValueDirection = XF_Math.getAleatoryValue(100);
			
		let rectPoints = [];
		rectPoints[0]= [halfSideX,		halfSideZ];
		rectPoints[1]= [halfSideX*(-1),	halfSideZ];
		rectPoints[2]= [halfSideX*(-1),	halfSideZ*(-1)];
		rectPoints[3]= [halfSideX,		halfSideZ*(-1)];
		
		let numItemsX = Math.floor(halfSideX * 2);
		let numItemsZ= Math.floor(halfSideZ * 2);
		
		numItemsX = XF_Math.getValuePercent(numItemsX,velocityPercent);
		numItemsZ = XF_Math.getValuePercent(numItemsZ,velocityPercent);
		
		let sideA_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[0],rectPoints[1],numItemsX);
		let sideB_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[1],rectPoints[2],numItemsZ);
		let sideC_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[2],rectPoints[3],numItemsX);
		let sideD_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[3],rectPoints[0],numItemsZ);
		
		
		let pointIndex = 0;
		let ruteItems = [];
		
		let tangentAngle = Math.PI;
		for(var idx=0;idx<sideA_points.length;idx++){
			if(aletValueDirection < 50){
				tangentAngle = 0;
			}
			let vertex3d = [];
			vertex3d[0] = sideA_points[idx][0];
			vertex3d[1] = elevation;
			vertex3d[2] = sideA_points[idx][1];
			ruteItems[pointIndex] = new XfRute3dItem(vertex3d,tangentAngle);			
			pointIndex++;
		}
		
		tangentAngle = (Math.PI/2);
		if(aletValueDirection < 50){
			tangentAngle = Math.PI + (Math.PI/2);
		}
		for(var idx=0;idx<sideB_points.length;idx++){
			let vertex3d = [];
			vertex3d[0] = sideB_points[idx][0];
			vertex3d[1] = elevation;
			vertex3d[2] = sideB_points[idx][1];
			ruteItems[pointIndex] = new XfRute3dItem(vertex3d,tangentAngle);	
			pointIndex++;
		}
		
		tangentAngle = 0;
		if(aletValueDirection < 50){
			tangentAngle = Math.PI;
		}
		for(var idx=0;idx<sideC_points.length;idx++){

			let vertex3d = [];
			vertex3d[0] = sideC_points[idx][0];
			vertex3d[1] = elevation;
			vertex3d[2] = sideC_points[idx][1];
			ruteItems[pointIndex] = new XfRute3dItem(vertex3d,tangentAngle);	
			pointIndex++;
		}
		
		tangentAngle = Math.PI + (Math.PI/2);
		if(aletValueDirection < 50){
			tangentAngle = Math.PI/2
			
		}
		for(var idx=0;idx<sideD_points.length;idx++){
			let vertex3d = [];
			vertex3d[0] = sideD_points[idx][0];
			vertex3d[1] = elevation;
			vertex3d[2] = sideD_points[idx][1];
			ruteItems[pointIndex] = new XfRute3dItem(vertex3d,tangentAngle);	
			pointIndex++;
		}
		
		
		//set aleatory direction inverse
		let routeReturn = null;
		if(aletValueDirection<50){
			let newRruteItems = [];
			for(var idx=0;idx<ruteItems.length;idx++){
				let ruteItemIndex = ruteItems.length - (idx+1);
				newRruteItems[idx] = ruteItems[ruteItemIndex];
			}
			routeReturn = new XfRute3d(newRruteItems);
		}
		else {
			routeReturn = new XfRute3d(ruteItems);
		}
		
		//set aleatory init point 
		//init point max -> (ruteItems.length/4)*3
		/*
		let aleatStepIndex = XF_Math.getAleatoryValue((ruteItems.length/4)*3);
		if(aletValueDirection<50){
			aleatStepIndex = XF_Math.getAleatoryValue(ruteItems.length/4);
		}
		routeReturn.setStepIndex(aleatStepIndex);
		*/
		return routeReturn;
	}//end
	
		
	/*
	static getRuteFromRectangle(center,halfSideX,halfSideZ,sideNumItems,elevation){
	
		let rectPoints = [];
		rectPoints[0]= [halfSideX,		halfSideZ];
		rectPoints[1]= [halfSideX*(-1),	halfSideZ];
		rectPoints[2]= [halfSideX*(-1),	halfSideZ*(-1)];
		rectPoints[3]= [halfSideX,		halfSideZ*(-1)];
		
		let numPointSideX = Math.floor(halfSideX * 2);
		let numPointSideZ = Math.floor(halfSideZ * 2);
		let sideA_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[0],rectPoints[1],numPointSideX);
		let sideB_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[1],rectPoints[2],numPointSideZ);
		let sideC_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[2],rectPoints[3],numPointSideX);
		let sideD_points = XF_Math2dUtil.getLinePointsEscFinal(rectPoints[3],rectPoints[0],numPointSideZ);
		
		
		let pointIndex = 0;
		let ruteItems = [];
		
		let tangentAngle = Math.PI;
		for(var idx=0;idx<sideA_points.length;idx++){
			let vertex3d = [];
			vertex3d[0] = sideA_points[idx][0];
			vertex3d[1] = elevation;
			vertex3d[2] = sideA_points[idx][1];
			ruteItems[pointIndex] = new XfRute3dItem(vertex3d,tangentAngle);			
			pointIndex++;
		}
		
		tangentAngle = Math.PI/2;
		for(var idx=0;idx<sideB_points.length;idx++){
			let vertex3d = [];
			vertex3d[0] = sideB_points[idx][0];
			vertex3d[1] = elevation;
			vertex3d[2] = sideB_points[idx][1];
			ruteItems[pointIndex] = new XfRute3dItem(vertex3d,tangentAngle);	
			pointIndex++;
		}
		
		tangentAngle = 0;
		for(var idx=0;idx<sideC_points.length;idx++){
			let vertex3d = [];
			vertex3d[0] = sideC_points[idx][0];
			vertex3d[1] = elevation;
			vertex3d[2] = sideC_points[idx][1];
			ruteItems[pointIndex] = new XfRute3dItem(vertex3d,tangentAngle);	
			pointIndex++;
		}
		
		tangentAngle = Math.PI - (Math.PI/2);
		for(var idx=0;idx<sideD_points.length;idx++){
			let vertex3d = [];
			vertex3d[0] = sideD_points[idx][0];
			vertex3d[1] = elevation;
			vertex3d[2] = sideD_points[idx][1];
			ruteItems[pointIndex] = new XfRute3dItem(vertex3d,tangentAngle);	
			pointIndex++;
		}
		
		return new XfRute3d(ruteItems);
	}//end
	*/
}//end class