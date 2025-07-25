/**
 * class XF_MathPhysic
 */
class XF_MathPhysic {

	static GRAVITY = 9.8;
	
	constructor() {}//end constructor
	
	static getCurveTimeFly(velocity,angle){
		let time_ret = 2* ((velocity * Math.sin(angle))/XF_MathPhysic.GRAVITY);
		return time_ret;
	}//end function
	
}//end class