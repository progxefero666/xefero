/**
 * class XfLineEQ.create();
 */
class  XfLineEQ {        
    
	constructor(point_0,point_1){
		let diff_X 	= point_1[0] - point_0[0];		
		let diff_Y	= point_1[1] - point_0[1];
		let factorYX= (point_0[1] * point_1[0]) - (point_1[1]*point_0[0]);
		if(diff_X==0){diff_X= 0.0000001;}
		if(diff_Y==0){diff_Y= 0.0000001;}
		this.m = diff_Y   / diff_X;		
		this.b = factorYX / diff_X;			
	}//end constructor
	
	static create(point_0_x,point_0_y,point_1_x,point_1_y){
		let point0 = [point_0_x,point_0_y];
		let point1 = [point_1_x,point_1_y];
		return new XfLineEQ(point0,point1);
	}//end function
	
/*
	public LineEQ(double point_0_x,double point_0_y,double point_1_x,double point_1_y){
		double diff_X 	= point_1_x - point_0_x;		
		double diff_Y	= point_1_y - point_0_y;		
		double factorYX 	= (point_0_y * point_1_x) - (point_1_y*point_0_x);		
		if(diff_X==0f){diff_X= 0.0000001;}
		if(diff_Y==0f){diff_Y= 0.0000001;}		
		this.m = diff_Y   / diff_X;		
		this.b = factorYX / diff_X;
	}
*/

	
}//end class