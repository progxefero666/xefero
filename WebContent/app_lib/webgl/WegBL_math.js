/**
 * 
 */

	const RADIAN= Math.PI / 180.0;
	
	function getValuePercent(valueTotal,percent){
		return(valueTotal * percent) /100.0;	
	}//end
		
	function getPercent(valueTotal,valuePercent){
		return ((valuePercent*100.0)/valueTotal);
	}//end

	function getAngleInc(pAng_Init,pAng_Inc) {		
		var angRes=pAng_Init + pAng_Inc;
		
		if(  angRes >= (Math.PI*2) ){
			angRes= angRes - (Math.PI*2) ;
		}
		return(angRes);
	}//end

	function getAngleDec(pAng_Init,pAng_Inc){		
		var angRes= pAng_Init - pAng_Inc;
		
		if(  angRes < ((Math.PI*2) *(-1) ) ){
				angRes= angRes + (Math.PI*2) ;
		}
		return(angRes);
	}		
	
	function getAngleDiff(angle_a,angle_b) {
		var valueReturn = 0;
		if( (angle_a>=angle_b) ){
			valueReturn = angle_a-angle_b;
		}
		else{
			valueReturn = angle_a + ((Math.PI*2) -angle_b)
		}
		return valueReturn;
	}//end 
	

	