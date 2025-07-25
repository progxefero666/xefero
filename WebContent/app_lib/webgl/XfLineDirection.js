/**
 * class XfLineDirection
 */
class  XfLineDirection{        
    
	constructor(line_v0,line_v1){
		this.line = [line_v0,line_v1];
		let trans3d = XF_Math3dUtil.getTranslation3d(line_v0,line_v1);
		this.direction = new XF_Veztor(trans3d);
		this.direction.toUnitVector();
		
		this.postConstruct();
	}//end constructor
	
	postConstruct(){
		this.len = Math.floor(XF_Math3dUtil.getDistance3d(this.line[0],this.line[1]));
		this.line_eq = XfLineEQ.create(this.line[0][0],this.line[0][2],
									   this.line[1][0],this.line[1][2]);
		this.points	= XF_Math3dUtil.getLineVertex(this.line[0],this.line[1],this.len);
		this.angleY = this.getDirection_angleY();							   
	}//end function
	
	getDirection_angleY(){		
		//et angleY =XF_Math3dUtil.getTwoVertexAngle_Y(this.line[0],this.line[1]);
		let angleY =XF_Math3dUtil.getTwoVertexAngle_Y([0,0,0],this.direction.elements);
		return angleY;		
	} //end method
	
/*
	public void postConstruct(){
		this.direction.toUnitVector();
		this.len = Math3d.getDistance3d(line[0],line[1]);				
		this.line_eq=new LineEQ(this.line[0][0],this.line[0][2],
										  this.line[1][0],this.line[1][2]);
		
		this.angle_y = this.getDirection_angle_y();
		
	} //end method
		


			
	public LineDirection(double[] line_v0,double[] line_v1){
		this.line = new double[][]{line_v0,line_v1};
		double[] trans3d = Math3d.getTranslation3d(line_v0,line_v1);		
		this.direction = Veztor.create(trans3d);
		this.postConstruct();
	} //end constructor
	
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