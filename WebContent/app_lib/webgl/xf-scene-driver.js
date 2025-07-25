
/**
 * class XF_SceneDriver
 */
class XF_SceneDriver {
	
	constructor(canvasSize,physicSize) {
		this.canvasSize = canvasSize;
		this.physicSize = physicSize;
		
		//calculated
		this.ptCenter	= this.getPointCenter(canvasSize);
		this.unitX = this.canvasSize[0] / this.physicSize[0];
		this.unitY = this.canvasSize[1] / this.physicSize[1];			
		this.zoom = 1.0;
	}//end constructor

	getPointCenter(canvasSize){ //[2]		
		var halfWidth = Math.floor(canvasSize[0]/2);
		var halfHeight =Math.floor(canvasSize[1]/2);		
		var point2d = [halfWidth,halfHeight];
		return point2d;
	}//end 
	
	getCanvasAxisX(){
		var axis = [];
		axis[0] = [0,this.ptCenter[1]];
		axis[1] = [this.canvasSize[0],this.ptCenter[1]];		 
		return axis;
	}//end 

	getCanvasAxisY(){
		var axis = [];
		axis[0] = [this.ptCenter[0],0];
		axis[1] = [this.ptCenter[0],this.canvasSize[1]];		 
		return axis;
	}//end 

	getDriverPoint(vertex) {				
		var coordCalcX= Math.floor((vertex[0]*this.zoom) * this.unitX);
		var coordCalcY= Math.floor((vertex[1]*this.zoom) * this.unitY);
		
		var point_return = [];
		point_return[0] = this.ptCenter[0] + coordCalcX;;
		point_return[1] = this.ptCenter[1] + coordCalcY; 
		return point_return;		
	}//end


	getDriverPoints(array_vertex) {
		var points_return = [];
		for(var idx=0;idx<array_vertex.length;idx++) {
			points_return = this.getDriverPoint(array_vertex[idx]);
		}
		return points_return;
	}//end

}//end class





//................................................
/*
XF_DriverOrtho.prototype.getDriverScreenLen= function(real_len) {
	var vertex_0 = [0.0,0.0,0.0];
	var vertex_1 = [0.0,real_len,0.0];
	
	var point_0 =this.getDriverPoint(vertex_0);
	var point_1 =this.getDriverPoint(vertex_1);
	var len_return = point_0[1]-point_1[1];
	return len_return;
};
*/
//................................................

