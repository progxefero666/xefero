/**
 * class XfRute3dUtil.getRuteFromRectangle(center,halfSideX,halfSideZ,sideNumItems,elevation)
 */
 class XfGeo2dRect {        
    
	constructor(pointCorner,rectWitdh,rectHeight) {
		this.pointCorner= pointCorner;
		this.rectWitdh 	= rectWitdh;
		this.rectHeight = rectHeight;
		this.generatePoints();
	}//end constructor

	generatePoints(){
		let maxCoordX = this.pointCorner[0]+ rectWitdh;
		let maxCoordY = this.pointCorner[1]+ rectHeight;
		this.points = [];
		this.points[0] = [this.pointCorner[0],	this.pointCorner[1]];
		this.points[1] = [maxCoordX,			this.pointCorner[1]];
		this.points[2] = [maxCoordX,			maxCoordY];
		this.points[3] = [this.pointCorner[0],	maxCoordY];
	}//end function
	
}//end class