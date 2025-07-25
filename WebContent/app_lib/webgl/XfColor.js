
/**
 * class XF_Color.getAleatoryColor()
 */
class  XF_Color {        
    
	constructor(value_red,value_green,value_blue,value_alpha) {
		this.values = new Array();	
		this.values[0] = value_red;
		this.values[1] = value_green;
		this.values[2] = value_blue;
		this.values[3] = value_alpha;				
	}
	
	getCanvasColor() {   
		var color_res = 'rgb(' + this.values[0] + ',' + this.values[1] + ',' + this.values[2] + ')';
		return color_res;	
	}


	
} //end constructor




