/**
 * class XfSceneLiveItem
 */
class XfEsceneLiveItem{        
    
	constructor(id,size,color,velocity,position,rotation) {
		this.id			= id;
		this.size		= size;		
		this.color		= color;
		this.pivot = new XfEsceneLiveItemPivot(20,position,rotation,this.color,velocity);
		this.rute = null;
		this.ruteItemIndex = -1;
	}//end constructor
	
	getPosition(){
		return this.pivot.position;
	}//end function
	
	getRotation(){
		return this.pivot.rotation;
	}//end function
	
	setRute(rute){
		this.rute = rute;
	}//end function
	
	dinamic(){
		this.pivot.dinamic();		
	}//end function
	
	dinamicInRute(){
		this.ruteItemIndex++;
		if(this.ruteItemIndex==this.rute.ruteItems.length){
			this.ruteItemIndex=0;
		}
		let ruteItemPosition = this.rute.ruteItems[this.ruteItemIndex].position;
		let ruteItemRotation = this.rute.ruteItems[this.ruteItemIndex].rotation;
		this.pivot.setState(ruteItemPosition,ruteItemRotation);
	}//end function
	
}//end class
	