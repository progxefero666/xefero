/**
 * class XfRuteLine3d(parent,line_v0,line_v1,velocity)
 */
class  XfRuteLine3d{        
    
	constructor(parent,id,line_v0,line_v1,velocity){
		this.parent		= parent;
		this.id		= id;
		this.line 		= [line_v0,line_v1];
		this.velocity 	= velocity;
		this.postConstruct();
	}//end constructor
	
	postConstruct(){
		//let trans3d 	= XF_Math3dUtil.getTranslation3d(this.line[0],this.line[1]);
		//this.direction 	= new XF_Veztor(trans3d);
		//this.direction.toUnitVector();
		//this.line_eq = XfLineEQ.create(this.line[0][0],this.line[0][2],
		//							   this.line[1][0],this.line[1][2]);
		//this.angleY = XF_Math3dUtil.getTwoVertexAngle_Y([0,0,0],this.direction.elements);
		let dist3d = Math.floor(XF_Math3dUtil.getDistance3d(this.line[0],this.line[1]));
		this.countItems = dist3d * (10-this.velocity) * 1;

		this.points	= XF_Math3dUtil.getLineVertex(this.line[0],this.line[1],this.countItems);
		this.angleY = XF_Math3dUtil.getTwoVertexAngle_Y(this.line[0],this.line[1]);
		
		this.stepIndex = 0;		
		this.stepPoint = this.points[this.stepIndex];						   
	}//end function
	

	dinamic(THREE){		
		
		this.stepIndex+=1;
		
		
		if(this.stepIndex == this.countItems){	
			this.stepIndex 	= 0;	
			if(this.parent!=null){
				this.parent.onRouteEnd(THREE,this.id);
			}	
		}
		else{
			
			this.stepPoint = this.points[this.stepIndex];
		}
	}//end function
				
}//end class