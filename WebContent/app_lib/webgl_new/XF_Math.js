/**
 * class XF_Math.getAngleInc(pAng_Init,pAng_Inc)
 */
class XF_Math {
	
	static RADIAN= Math.PI / 180.0;
	static RADIANS_90= Math.PI / 2;
	static RADIANS_270= XF_Math.RADIAN * 270;
	
	constructor() {}//end constructor
	
	static getAngleInc(pAng_Init,pAng_Inc) {		
		var angRes=pAng_Init + pAng_Inc;
		
		if(  angRes >= (Math.PI * 2) ){
			angRes= angRes - (Math.PI * 2);
		}
		return(angRes);
	}//end

	static getAngleDec(pAng_Init,pAng_Inc){		
		var angRes= pAng_Init - pAng_Inc;
		
		if(  angRes < ((Math.PI * 2)*(-1) ) ){
				angRes= angRes + (Math.PI * 2);
		}
		return(angRes);
	}		
	
	static getAngleDiff(angle_a,angle_b) {
		var valueReturn = 0;
		if( (angle_a>=angle_b) ){
			valueReturn = angle_a-angle_b;
		}
		else{
			valueReturn = angle_a + ((Math.PI * 2)-angle_b)
		}
		return valueReturn;
	}//end 
	

	static calculaArgumento(valueR,valueI) {
		var valueRes = Math.atan(valueI/valueR);
		return valueRes;		
	}//end 

	static obtenerValorPorcentaje(porcTotal,valTotal,porcParc){ //doubles
		var valueRes= (valTotal*porcParc) /porcTotal;	
		return valueRes;
	}//end


	static getValuePercent(valueTotal,percent){
		return(valueTotal * percent) /100.0;	
	}//end
	static getPercent(valueTotal,valuePercent){
		return ((valuePercent*100.0)/valueTotal);
	}//end

	static toRadians(angleGrades){		
		return (XF_Math.RADIAN *angleGrades);
	}//end

	static toDegrees(angleRad){		
		return (angleRad /XF_Math.RADIAN);	
	}//end
	
	static getAleatoryValue(maxValor){		
		var valReal = maxValor * Math.random();

		if (valReal==0){
			return 1;
		}
		else{
			return Math.floor(valReal);
		}
	}
		
	static getAleatoryValueMin(minValor,maxValor){
		let valueDiff = maxValor - minValor;
		let valCalc = valueDiff * Math.random();
		return minValor + Math.floor(valCalc);
	}//end function
	
	static getAleatoryBoolean(){
		let valCalc = Math.floor(100 * Math.random());
		if(valCalc<50){
			return true;
		}
		else {
			return false;
		}
	}//end function
	
	static getGlCloneVertexScaledByCC(vertex,scale){
		var vertex_clone = [];
		vertex_clone[0] = vertex[0]*scale;
		vertex_clone[1] = vertex[1]*scale;
		vertex_clone[2] = vertex[2]*scale;
		return vertex_clone;
	}//end function

	static getVertexClone(vertex){
		var vertex_clone = [];
		vertex_clone[0] = vertex[0];
		vertex_clone[1] = vertex[1];
		vertex_clone[2] = vertex[2];
		return vertex_clone;
	}//end function
	
	static getCfPerimeter(radius){						
		return (2.0 * radius * Math.PI);		
	}//end function
	
	static getCfArcLenByAngle(radius,rangeAngle){
		let perimeter =  XF_Math.getCfPerimeter(radius);
		let arcLen = (perimeter * rangeAngle) /(Math.PI*2);
		return arcLen;
	}//end function

}//end class





