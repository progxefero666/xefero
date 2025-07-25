
class XF_ScenePaint {        
    
	constructor(driver,ctx) {
		this.driver = driver;
		this.ctx = ctx;		
	}//end constructor
	
	
	clearCanvas() {	
		this.ctx.clearRect (0, 0,this.driver.canvasSize[0],this.driver.canvasSize[1]);
	}//end		
	
	//..................................................................................................
	//not driver functions
	//..................................................................................................
	drawPoint(canvasPoint,radius,colorRGBA) {				
		this.ctx.fillStyle = colorRGBA.getCanvasColor();
		this.ctx.fillRect(canvasPoint[0],canvasPoint[1],radius,radius);
	}//end
	
	//..................................................................................................
	//driver functions
	//..................................................................................................
	renderAxis() {
		var axisX = this.driver.getCanvasAxisX();
		var axisY = this.driver.getCanvasAxisY();
		this.paintLine2d(axisX[0],axisX[1],new XF_Color(0,0,255,255));
		this.paintLine2d(axisY[0],axisY[1],new XF_Color(255,255,0,255));
	}//end
		
	paintCircle(point2d,radius,colorRGBA) {				
		var canvasPoint = this.driver.getDriverPoint(point2d);		
		this.ctx.strokeStyle =  colorRGBA.getCanvasColor();
		this.ctx.beginPath();
		this.ctx.arc(canvasPoint[0],canvasPoint[1],radius,0,Math.PI*2,true); // Outer circle  
		this.ctx.stroke();	
	}//end 

	
	paintLine2d(point2d_0,point2d_1,colorRGBA) {
		this.ctx.lineWidth   = 1;
		this.ctx.strokeStyle = colorRGBA.getCanvasColor();
		this.ctx.beginPath();
		this.ctx.moveTo(point2d_0[0],point2d_0[1]);	
		this.ctx.lineTo(point2d_1[0],point2d_1[1]);	
		this.ctx.stroke();	
	}//end 
	
	paintLine(point2d_0,point2d_1,colorRGBA) {
		var canvasPoint_0 = this.driver.getDriverPoint(point2d_0);
		var canvasPoint_1 = this.driver.getDriverPoint(point2d_1);
		this.ctx.lineWidth   = 1;
		this.ctx.strokeStyle = colorRGBA.getCanvasColor();
		this.ctx.beginPath();
		this.ctx.moveTo(canvasPoint_0[0],canvasPoint_0[1]);	
		this.ctx.lineTo(canvasPoint_1[0],canvasPoint_1[1]);	
		this.ctx.stroke();	
	}//end 
	
	paintObjectPivot(objPivot) {		
		this.paintLine(objPivot.positionInit,objPivot.positionEnd,objPivot.color);
		this.paintCircle(objPivot.positionEnd,5,objPivot.color);
	}//end 
	
	
	fillCircle(point2d,radius,colorRGBA) {		
		var canvasPoint = this.driver.getDriverPoint(point2d);				
		this.ctx.fillStyle = colorRGBA.getCanvasColor();
		this.ctx.beginPath();
		this.ctx.arc(canvasPoint[0],canvasPoint[1],radius,0,Math.PI*2,true); // Outer circle  				
		this.ctx.fill();
	}//end
	//..................................................................................................	


	//..................................................................................
	//lib functions
	//..................................................................................
	static getCfPoint(center,radius,angle_y){
		var coord_x = center[0] + ( radius * Math.cos(angle_y));
		var  coord_y = center[1] + ( radius * Math.sin(angle_y));		
		return [coord_x,coord_y];	
	}//end

	/*
	XF_ScenePaint.getCtxColor();
	paintPoint(canvasPoint,color) {
		this.ctx.lineWidth   = 1;
		//this.ctx.globalAlpha = 1.0;
		this.ctx.strokeStyle = color;
		this.ctx.fillStyle = color;	
		this.ctx.fillRect(canvasPoint[0],canvasPoint[1],1,1);
	}

	paintPoint_inScaledContext(scaledcanvasPoint,color) {
		this.ctx.lineWidth   = 1;
		this.ctx.globalAlpha = 1.0;
		this.ctx.strokeStyle = color;
		this.ctx.fillStyle = color;	
		this.ctx.fillRect(canvasPoint,canvasPoint,1,1);
	}

	paintPointReference(canvasPoint,radius,color) {	
		this.paintPoint(canvasPoint,color);
		//this.paintCircle(canvasPoint,radius,color); 	
	}

	paintAxis = function(canvasAxis,color) {		
		this.ctx.strokeStyle = color;
		this.ctx.beginPath();
		this.ctx.moveTo(canvasAxis.imagePoint_1,canvasAxis.imagePoint_1);	
		this.ctx.lineTo(canvasAxis.imagePoint_2,canvasAxis.imagePoint_2);	
		this.ctx.stroke();	
	};
	*/
	
} //end class





