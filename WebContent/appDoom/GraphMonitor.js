/**
 * class GraphMonitor.getSizeXByPercent(percent)
 */
class GraphMonitor{   
	
	static CP_RADIUS_PERCENT = 15;
	
	//constructor	
	constructor(left,right,top,bottom) {
		this.left 	= left;
		this.right 	= right;
		this.top 	= top;
		this.bottom = bottom;
		this.postConstructor();
	}//end constructor	
	
	postConstructor(){
		this.width = this.right - this.left;
		this.height= this.bottom - this.top;
		this.widthHalf = Math.floor(this.width/2);
		this.heightHalf = Math.floor(this.height/2);
		
		this.docPointCenter= [];		
		this.docPointCenter[0] = this.left + this.widthHalf;
		this.docPointCenter[1] = this.top + this.heightHalf;
		
		this.cpRadius = this.getSizeXByPercent(GraphMonitor.CP_RADIUS_PERCENT);
	}//end function 
	
	isPointIntoCp(coordX,coordY){
		let result = false;
		let distToCenter = this.getDistanceToCenter(coordX,coordY);
		if(distToCenter<=this.cpRadius){
			result = true;
		}
		return result;
	}//end function 
	
	getDistanceToCenter(coordX,coordY){
		return XF_Math2dUtil.getDistance2d(this.docPointCenter,[coordX,coordY]);
	}//end function 
	
	getSizeXByPercent(percent){
		return Math.floor(XF_Math.getValuePercent(this.width,percent));
	}//end function 
	
	getPercentBySizeX(sizeX){
		 return XF_Math.getPercent(this.width,sizeX);		 
	}//end function 
	
	getSizeYByPercent(percent){
		return Math.floor(XF_Math.getValuePercent(this.height,percent));
	}//end function 
		
}//end class	