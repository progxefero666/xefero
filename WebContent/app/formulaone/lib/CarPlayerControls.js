/**
 * CarPlayerControls
 */
 class  CarPlayerControls{        
	
	//constructor	
	constructor(app) {
		this.app  = app;
		this.init(this.app.app_THREE);
	}//end constructor
	
	init(THREE){	
		
		let velKmHoraMax = Math.floor(CarUtil.getVelocityInKmh(this.app.player.config.velocityMax));
		
		this.speedometerAngleMax = XF_Math.RADIANS_270;
		this.speedometerAngleUnit = this.speedometerAngleMax/velKmHoraMax;

		this.speedometerMaps = null;
		WebGL_util.loadTexturesFromImageRotated(
			THREE,this,'gamecar/racepanels/speedometerarrow.png',
			velKmHoraMax+1,this.speedometerAngleUnit);

		let speedometerMap = this.app.txtLoader.load( 'gamecar/racepanels/speedometerbase.png' );				
		let speedometerMaterial = new THREE.SpriteMaterial( { map: speedometerMap} );
		speedometerMaterial.needsUpdate = true
		speedometerMaterial.transparent =true;				
		this.speedometerback = new THREE.Sprite( speedometerMaterial );		
		this.app.scene.add( this.speedometerback );	
		
		let velocityInKmh = CarUtil.getVelocityInKmh(0); 
		let numberMap =CarUtil.getSpeedometerTextureVelocity(THREE,velocityInKmh);									
		let arrowMaterial = new THREE.SpriteMaterial( { map: numberMap} );
		arrowMaterial.needsUpdate = true
		arrowMaterial.transparent =true;
		this.speedometerNumber = new THREE.Sprite( arrowMaterial );		
		this.app.scene.add( this.speedometerNumber );			
			
	}//end function	
		
	onTexturesCharged(THREE,texturesMaps){
		this.speedometerMaps = texturesMaps;		
		let speedometerArrowMaterial = new THREE.SpriteMaterial( { map: this.speedometerMaps[0]} );
		speedometerArrowMaterial.needsUpdate = true
		speedometerArrowMaterial.transparent =true;				
		this.speedometerArrow = new THREE.Sprite( speedometerArrowMaterial );		
		this.app.scene.add( this.speedometerArrow );
	}//end function	
		
	dinamic(THREE,wglCamera){
					
		if(this.app.player.velocity!=null){
			let velocityInKmh = CarUtil.getVelocityInKmh(this.app.player.velocity);
			
			//set speedometerback position
			//..................................................................................				
			let cameraCalc = wglCamera.clone();
			let cameraVector = new THREE.Vector3(); 
			cameraCalc.getWorldDirection(cameraVector);		
			cameraVector.multiplyScalar(2);	
			cameraCalc.translateX(1.9*(-1));	
			cameraCalc.translateY(0.5*(-1));	
			this.speedometerback.position.x = cameraCalc.position.x+ cameraVector.x;
			this.speedometerback.position.y = cameraCalc.position.y+ cameraVector.y;
			this.speedometerback.position.z = cameraCalc.position.z+ cameraVector.z;		
			cameraCalc.translateY(0.5);			
			cameraCalc.translateX(1.9);			
			
			cameraCalc = wglCamera.clone();
			cameraVector = new THREE.Vector3(); 
			cameraCalc.getWorldDirection(cameraVector);		
			cameraVector.multiplyScalar(1.99);	
			cameraCalc.translateX(1.9*(-1));	
			cameraCalc.translateY(0.5*(-1));			
			let mapIndex = Math.floor(velocityInKmh);
			this.speedometerArrow.material.map = this.speedometerMaps[mapIndex];
			this.speedometerArrow.position.x = cameraCalc.position.x+ cameraVector.x;
			this.speedometerArrow.position.y = cameraCalc.position.y+ cameraVector.y;
			this.speedometerArrow.position.z = cameraCalc.position.z+ cameraVector.z;		
			cameraCalc.translateY(0.5);			
			cameraCalc.translateX(1.9);		
	

			let numberMap =CarUtil.getSpeedometerTextureVelocity(THREE,velocityInKmh);	
			this.speedometerNumber.material.map = numberMap;	
			cameraCalc = wglCamera.clone();
			cameraVector = new THREE.Vector3(); 
			cameraCalc.getWorldDirection(cameraVector);		
			cameraVector.multiplyScalar(1.8);	
			cameraCalc.translateX(1.65*(-1));	
			cameraCalc.translateY(0.5*(-1));	
			this.speedometerNumber.position.x = cameraCalc.position.x+ cameraVector.x;
			this.speedometerNumber.position.y = cameraCalc.position.y+ cameraVector.y;
			this.speedometerNumber.position.z = cameraCalc.position.z+ cameraVector.z;		
			cameraCalc.translateY(0.5);			
			cameraCalc.translateX(1.65);				
			
		}//end if														
		
	}//end function	
			
}//end class	