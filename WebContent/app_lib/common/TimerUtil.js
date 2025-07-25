/**
 * class TimerUtil
 */
class TimerUtil{   
	
	//constructor	
	constructor() {}
					
	static toMMSS(totalSeconds){
		//let hours = Math.floor(totalSeconds / 3600);
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;
		let strMinutes = minutes.toString();
		let strSeconds = seconds.toString();
		//console.log(strMinutes);
		let result = strMinutes.concat(':').concat(strSeconds);
		return result;
	}//end function	
	
	static toMMSSmmm(totalMiliseconds){
		//.toFixed(3)
		let totalSeconds = Math.floor(totalMiliseconds / 1000);
		let miliseconds = totalMiliseconds % 1000;	
		
		let minutes = Math.floor(totalSeconds / 60);		
		let seconds = totalSeconds % 60;

		let strMinutes = minutes.toString();
		let strSeconds = seconds.toString();		
		let strMiliseconds = miliseconds.toString();
				
		let result = strMinutes.concat(':').concat(strSeconds).concat(':').concat(strMiliseconds);
		return result;						
	}//end function
	

	
		
}//end class		