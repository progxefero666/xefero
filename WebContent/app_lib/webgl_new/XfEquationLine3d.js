/**
 * class XfEquationLine3d
 */
class  XfEquationLine3d {        
    
	constructor(factor_x,factor_y,factor_z){
		this.factor_x = factor_x;		
		this.factor_y = factor_y;	
		this.factor_z = factor_z;	
	}//end constructor
	
	
	static create(factor_xyz){
		return new XfEquationLine3d(factor_xyz[0],factor_xyz[1],factor_xyz[2]);
	} //end constructor
	
	
}//end class