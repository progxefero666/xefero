/**
 * class CarUtil.getAngularVelocityRotacional(velocityNormalized,turnValue)
 */
class CarUtil {
	
	//
	/*
	si 15 --> 200 kmh
	   x  --> 1
	x= 15 / 200 =  0,075 es un km/hora;	
	*/
	static FACTOR_KMH = 0.075;
	
	static FRAME_VELOCITY_MAX = 60;
		
	constructor() {}//end constructor
	
	static readCarTrack(path){
		let jsonTrack =  WebGL_util.readJSonObject(path);
		let carTrack = new CarTrack();
		for(let idx=0;idx<jsonTrack.steps.length;idx++){
			let step = new GameCarStep(jsonTrack.steps[idx].position,
									   jsonTrack.steps[idx].velocity,
									   jsonTrack.steps[idx].rotationY,
									   jsonTrack.steps[idx].rotationZ);
			carTrack.addStep(step);
		}				
		return carTrack;
	}//end function
		
	static getAngularVelocity(velocityNormalized){
		let arcLen = velocityNormalized;		
		let perimeter = arcLen * 360;	
		let radius = perimeter / (Math.PI*2);
		let w = velocityNormalized / radius;			
		return w;		
	}//end function
		
	static getFuerzaRotacional(mass,velocityNormalized,turnValue){
		let arcLen = velocityNormalized;
		let arcAngle = turnValue;
		let valueDivPerimeter = (Math.PI*2)	/ arcAngle;
		let perimeter = arcLen * valueDivPerimeter;	
		let radius = perimeter / (Math.PI*2);
		let w = velocityNormalized / radius;			
		let momInerciaRot = mass * (radius * radius);
		cantMomRot = momInerciaRot * w;	
		return cantMomRot;		
	}//end function
	
	static calculateWglCarRotationVelocityY(wglRotationMaxY,velocityMax,velocity){
		let percentVelocity = XF_Math.getPercent(velocityMax,velocity);
		let valueRes =  XF_Math.getValuePercent(wglRotationMaxY,percentVelocity);
		return valueRes;
	}//end function
		
				
	//radians 
	static calculateWglCarRotationY(wglCarRotationMax,turnValueMax,turnValue){
		let percent = XF_Math.getPercent(turnValueMax,turnValue);
		//console.log(percent);
		
		let wglRotationY  = XF_Math.getValuePercent(wglCarRotationMax,percent);
		return wglRotationY; 
	}//end function
		
	static calculateWglCarRotationAddY(turnState,wglCarRotationMax,turnValueMax,turnValue){
		let wglCarRotationY = 0;

		if(turnState!='cero'){ 
			wglCarRotationY = CarUtil.calculateWglCarRotationY(wglCarRotationMax,turnValueMax,turnValue);
			if(turnState=='right'){
				wglCarRotationY *= (-1);
			}
		}		
		return wglCarRotationY;			
	}//end function	
			
	static getVelocityInKmh(velocityMeterPerSecond){
		let valueKmh = (velocityMeterPerSecond * 3600) / 1000;
		return valueKmh;  
	}//end function	

	
	static getVelocity(velocityMax,frameVelocityMax,frameVelocity){
		let frVelPercent = XF_Math.getPercent(frameVelocityMax,frameVelocity);		
		let velocity = XF_Math.getValuePercent(velocityMax,frVelPercent);
		return velocity;
	}//end function	
	
	static getFrameVelocity(distance){
		return (distance / 1000) *3600;//metros per frame
	}//end function	
	
	static getFameVelocityInKmH(frameVelocity){
		/*
		si 200 es CarUtil.FRAME_VELOCITY_MAX
		X 	 --> frameVelocity
		*/
		let kmH = (200 * frameVelocity) / CarUtil.FRAME_VELOCITY_MAX;
		return Math.floor(kmH);  
	}//end function	
		
	static toKmH(velocityMs){		
		let velocityMetrosH = 3600 * velocityMs;
		let velocityKmH	= velocityMetrosH / 1000;
		return velocityKmH;
	}//end function	
	
	static getSpeedometerTextureVelocity(THREE,velocity){
		let strVelocity = Math.floor(velocity).toString();
		
		let canvas = document.createElement('canvas');	
		canvas.width = 512;
		canvas.height = 512;
		
		let ctx = canvas.getContext("2d");	
		ctx.fillStyle = 'rgb(255,255,255)';
		//ctx.fillStyle = '#000000';
		ctx.font='70px Arial';
		ctx.fillText(strVelocity,170,380);
		let cfTexture = new THREE.CanvasTexture(canvas);
		cfTexture.needsUpdate = true;
		return cfTexture;
	}//end function
			
	static getRacePositionTexture(THREE,racePosition){
		let strRacePosition = Math.floor(racePosition).toString(); //.concat('º');
		
		let canvas = document.createElement('canvas');	
		canvas.width = 256;
		canvas.height = 256;
		
		let ctx = canvas.getContext("2d");	
		ctx.fillStyle = 'rgb(255,255,255)';
		//ctx.fillStyle = '#000000';
		ctx.font='100px Arial';
		ctx.fillText(strRacePosition,1,100);
		let cfTexture = new THREE.CanvasTexture(canvas);
		cfTexture.needsUpdate = true;
		return cfTexture;
	}//end function
				
}//end class