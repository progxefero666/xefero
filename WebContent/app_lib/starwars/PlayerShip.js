/**
 * class WebGLAppUniverse
 * 
 */
var thisObj = null;
var controls = null;

class  PlayerShip {        
	
	//constructor	
	constructor(app,gameScene,wglCabina,velocity,modeCabina) {
		this.app 	  = app;
		this.gameScene= gameScene;
		this.wglCabina= wglCabina;
		this.velocity = velocity;
		this.modeCabina = modeCabina;
		this.acelerationState = 'speedCero';
		this.turnState = 'turnCero';	
		this.elevationState ='elevationCero';
		//console.log(this.wglCabina.name);'xwing1'		
		this.configure();
		this.init(this.app.app_THREE,this.app.scene);		
	}//end constructor	
	
	configure(){
		
		this.boundRadius= 17.0;
		this.rollValueMax = 45;
		this.velocityMin = 0.01;
		this.velocityMax = 15;
		this.velocityInc = 0.005;
		
		this.yawLeft = 0;
		this.yawRight = 0;
		this.pitchUp = 0;
		this.pitchDown = 0;
		
		this.light = null;
		this.distCameraToFrontBall = null;
		this.distCabinaToCameraY = 7;
		if(this.modeCabina){
			this.distCabinaToCameraZ = 20;
			this.distCabinaToCameraY = 7;
		}
		else {
			this.distCabinaToCameraZ = 40;
			this.distCabinaToCameraY = 7;
		}
		this.distJoinFront = this.distCabinaToCameraZ + this.boundRadius;
		this.distJoinSides  = this.distCabinaToCameraZ;
		
		this.interval = null;
		this.checkCollisions = true;
		this.checkCollisionsInterval = 1000;
	}//end function
	
	init(THREE,scene){				
		this.shipCenter = []; 
		//scene.add(this.wglCabina);
		
		//........................................................................................		
		this.boundsSpheres = [];
		
		let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		let geometry = new THREE.SphereGeometry(0.1,16,16);		
		this.boundsSpheres[0] = new THREE.Mesh( geometry, material ); 	
		this.boundsSpheres[0].name = 'boundsSpheres_F';
	
		geometry = new THREE.SphereGeometry(0.1,16,16);		
		this.boundsSpheres[1] = new THREE.Mesh( geometry, material );
		this.boundsSpheres[1].name = 'boundsSpheres_R';
		
		geometry = new THREE.SphereGeometry(0.1,16,16);		
		this.boundsSpheres[2] = new THREE.Mesh( geometry, material );
		this.boundsSpheres[2].name = 'boundsSpheres_L';
		
		scene.add(this.boundsSpheres[0]);
		scene.add(this.boundsSpheres[1]);
		scene.add(this.boundsSpheres[2]);	
		//........................................................................................
						
		
	}//end function
	
	dinamic(THREE,scene,wglCamera){

		//........................................................................
		if(this.acelerationState != 'speedCero'){
			if(this.acelerationState == 'speedUp'){				
				this.incrementVelocity();
			}
			if(this.acelerationState == 'speedDown'){				
				this.decrementVelocity();
			}
		}
		
		this.rotation = wglCamera.rotation.clone();		
		let cameraVector = new THREE.Vector3(); 
		wglCamera.getWorldDirection(cameraVector);			  		
		cameraVector.multiplyScalar(this.distCabinaToCameraZ);
		this.position = new THREE.Vector3(); 
		this.position.x = wglCamera.position.x+ cameraVector.x;
		this.position.y = wglCamera.position.y+ cameraVector.y;
		this.position.z = wglCamera.position.z+ cameraVector.z;
		//........................................................................			
		this.updateWglState();							
		this.updateShipReferencePoints(THREE,wglCamera);		
		//........................................................................	
			
	
		
		//........................................................................
		/*
		if(this.checkCollisions){
			let collision = false;
			let collisionObjName = null;
			let collisionPoint = null;
			let collisionObjPosition = null;
			
			let raycasterVector = new THREE.Vector3(); 
			wglCamera.getWorldDirection(raycasterVector);			
			
			let raycaster = new THREE.Raycaster(wglCamera.position,raycasterVector,0,this.distCameraToFrontBall);
			let intersects = raycaster.intersectObjects(scene.children );		
			for (let i=0;i< intersects.length;i++) {			
				if(intersects[i].object.name.length>0){
					if(!this.gameScene.isExcludeObjectByName(intersects[i].object.name)){
						console.log(intersects[i].object.name);		
						collisionObjName = intersects[i].object.name;
						collisionObjPosition = intersects[i].object.position.clone();
						collisionPoint = intersects[i].point;
						collision = true;
						this.checkCollisions = false;	
						this.interval = new PlayerTimer(this,this.checkCollisionsInterval);	
						this.interval.run();		
						break;	
					}	
				}		
			}//end for	
			
			if(collision) {
				let contactCoords = [collisionPoint.x,collisionPoint.y,collisionPoint.z];				
				this.app.onCollisionContact(collisionObjName,contactCoords);
			}	
		}
		*/
		
	}//end function
	
	onAlert( ) {
		this.interval.abort();	   	
		this.interval = null;	
		this.checkCollisions = true;	   	
	}//end function
		
	updateShipReferencePoints(THREE,wglCamera){
			
		//JoinFront
		let sphereVector = new THREE.Vector3(); 
		wglCamera.getWorldDirection(sphereVector);			 
		sphereVector.multiplyScalar(this.distJoinFront);		
		this.boundsSpheres[0].position.x =  wglCamera.position.x+ sphereVector.x;
		this.boundsSpheres[0].position.y =  wglCamera.position.y+ sphereVector.y;
		this.boundsSpheres[0].position.z =  wglCamera.position.z+ sphereVector.z;		
		this.boundsSpheres[0].rotation.x = this.rotation.x;
		this.boundsSpheres[0].rotation.y = this.rotation.y;
		this.boundsSpheres[0].rotation.z = this.rotation.z;			
		this.boundsSpheres[0].translateY(this.distCabinaToCameraY * (-1));

		if(this.distCameraToFrontBall==null){
			this.distCameraToFrontBall = XF_Math3dUtil.getDistance3d(
				WebGL_threeUtil.getVector3Coords(wglCamera.position),
				WebGL_threeUtil.getVector3Coords(this.boundsSpheres[0].position));			
		}
		sphereVector = new THREE.Vector3(); 
		wglCamera.getWorldDirection(sphereVector);			 
		sphereVector.multiplyScalar(this.distJoinSides);
		this.boundsSpheres[1].position.x =  wglCamera.position.x+ sphereVector.x;
		this.boundsSpheres[1].position.y =  wglCamera.position.y+ sphereVector.y;
		this.boundsSpheres[1].position.z =  wglCamera.position.z+ sphereVector.z;		
		this.boundsSpheres[1].rotation.x = this.rotation.x;
		this.boundsSpheres[1].rotation.y = this.rotation.y;
		this.boundsSpheres[1].rotation.z = this.rotation.z;			
		this.boundsSpheres[1].translateX(this.boundRadius);
		this.boundsSpheres[1].translateY(this.distCabinaToCameraY * (-1));
						
		this.boundsSpheres[2].position.x =  wglCamera.position.x+ sphereVector.x;
		this.boundsSpheres[2].position.y =  wglCamera.position.y+ sphereVector.y;
		this.boundsSpheres[2].position.z =  wglCamera.position.z+ sphereVector.z;		
		this.boundsSpheres[2].rotation.x = this.rotation.x;
		this.boundsSpheres[2].rotation.y = this.rotation.y;
		this.boundsSpheres[2].rotation.z = this.rotation.z;			
		this.boundsSpheres[2].translateX(this.boundRadius * (-1));
		this.boundsSpheres[2].translateY(this.distCabinaToCameraY * (-1));		
		

	}//end function

	updateWglState(){
		this.wglCabina.position.x = this.position.x;
		this.wglCabina.position.y = this.position.y;
		this.wglCabina.position.z = this.position.z;
		this.wglCabina.rotation.x = this.rotation.x;		
		this.wglCabina.rotation.y = this.rotation.y;		
		this.wglCabina.rotation.z = this.rotation.z;		
		
		this.wglCabina.translateY(this.distCabinaToCameraY * (-1));
		this.shipCenter	=  WebGL_threeUtil.getVector3Coords(this.wglCabina.position);
		
		if(this.turnState!='turnCero'){	
			if(this.turnState=='turnRight'){
				this.yawRight += 0.003;
				if(this.yawRight>1.0){
					this.yawRight = 1.0;
				}
				this.app.flyControl.turnRight(this.yawRight);
				//this.app.flyControl.update(1.0); 
			}
			else {
				this.yawLeft += 0.003;
				if(this.yawLeft>1.0){
					this.yawLeft = 1.0;
				}					
				this.app.flyControl.turnLeft(this.yawLeft);
				//this.app.flyControl.update(1.0); 
			}			
		}	
		if(this.elevationState !='elevationCero'){
			if(this.elevationState =='elevationUp'){
				this.pitchUp += 0.003;
				if(this.pitchUp>1.0){
					this.pitchUp = 1.0;
				}	
				this.app.flyControl.elevationUp(this.pitchUp);
			}
			else {
				this.pitchDown += 0.003;
				if(this.pitchDown>1.0){
					this.pitchDown = 1.0;
				}				
				this.app.flyControl.elevationDown(this.pitchDown);			
			}
		}			
		if(!this.modeCabina){
			if(this.turnState!='turnCero'){			
				let percentCalc = XF_Math.getPercent(this.velocityMax,this.velocity);
				let angleCalc =  XF_Math.getValuePercent(XF_Math.RADIAN * this.rollValueMax,percentCalc);			
				if(this.turnState=='turnRight'){ 
					this.wglCabina.rotateZ(angleCalc *(-1));
				}
				else {
					this.wglCabina.rotateZ(angleCalc);
				}			
			}										
		}					
	}//end function
			
	//.......................................................................................................
	//gamepads actions speed
	//.......................................................................................................
	speedCero(){
		this.acelerationState = 'speedCero';
	}//end function
		
	speedUp(){
		this.acelerationState = 'speedUp';		
	}//end function
	
	speedDown(){
		this.acelerationState = 'speedDown';		
	}//end function	
	
	incrementVelocity(){
		if(this.velocity==this.velocityMax){
			return;
		}
		let potVelocity = this.velocity + this.velocityInc;
		console.log(potVelocity);
		if(potVelocity<=this.velocityMax){			
			this.velocity = potVelocity;
			this.app.flyControl.movementSpeed = this.velocity;
		}		
	}//end function
		
	decrementVelocity(){
		if(this.velocity==this.velocityMin){
			return;
		}
		let potVelocity = this.velocity - this.velocityInc;
		if(potVelocity>=this.velocityMin){
			this.velocity = potVelocity;
			this.app.flyControl.movementSpeed = this.velocity;
		}		
	}//end function
			
	//.......................................................................................................
	//gamepads actions fly
	//.......................................................................................................	
	turnCero(){
		this.yawLeft = 0;
		this.yawRight = 0;
		this.turnState = 'turnCero';
		this.app.flyControl.turnCero();
	}//end function	
		
	turnLeft(){
		this.yawRight = 0;
		this.turnState = 'turnLeft';
		this.app.flyControl.turnLeft(this.yawLeft);
	}//end function	
		
	turnRight(){
		this.yawLeft = 0;
		this.turnState = 'turnRight';
		this.app.flyControl.turnRight(this.yawRight);
	}//end function	
			
	elevationCero(){
		this.pitchUp = 0;
		this.pitchDown = 0;
		this.elevationState ='elevationCero';
		this.app.flyControl.elevationCero();
	}//end function	
			
	elevationUp(){
		this.pitchDown = 0;
		this.elevationState ='elevationUp';
		//this.app.flyControl.elevationUp(this.pitchUp);
	}//end function	
			
	elevationDown(){
		this.pitchUp = 0;
		this.elevationState ='elevationDown';
		//this.app.flyControl.elevationDown(this.pitchDown);
	}//end function	
				
	warpCero(){
		this.app.flyControl.warpCero();
	}//end function	
						
	warpLeft(){
		//console.log('warpLeft');
		this.app.flyControl.warpLeft();
	}//end function	
	
	warpRight(){
		//console.log('warpRIght');
		this.app.flyControl.warpRight();
	}//end		
			
	/*
	checkCollisions(THREE,scene){
			
		if(this.checkCollisionsByRadius(scene)){return true};
		return false;
		
		let existCollision = false;	
		
		//vector front
		let frontVectorStart = new THREE.Vector3(this.shipCenter[0],this.shipCenter[1],this.shipCenter[2]); 
		let frontVectorEnd = this.boundsSpheres[0].position.clone();
		let frontRaycaster = new THREE.Raycaster();
		frontRaycaster.set(frontVectorStart,frontVectorEnd);
		
		let intersects = frontRaycaster.intersectObjects(scene.children );		
		for (let i=0;i< intersects.length;i++) {			
			if(!this.gameScene.isExcludeObjectByName(intersects[i].object.name)){								
				if(intersects[i].distance<this.boundRadius){
					//console.log(intersects[i].object.name);	
					existCollision = true;	
					break;		
					//intersects[i].object.material.color.set( 0xff0000 );
				}
			}			
		}		

		if(existCollision ){return true;}
		
		
		//vector right
		let rightVectorStart = new THREE.Vector3(this.shipCenter[0],this.shipCenter[1],this.shipCenter[2]); 
		let rightVectorEnd = this.boundsSpheres[1].position.clone();
		let rightRaycaster = new THREE.Raycaster();
		rightRaycaster.set(rightVectorStart,rightVectorEnd);
		let rightIntersects = rightRaycaster.intersectObjects(scene.children );		
		for (let i=0;i< rightIntersects.length;i++) {			
			if(!this.gameScene.isExcludeObjectByName(rightIntersects[i].object.name)){		
				//console.log(rightIntersects[i].distance);											
				if(rightIntersects[i].distance<30){//this.boundRadius
					//console.log('rightRaycaster');
					existCollision = true;	
					break;		
				}
			}			
		}			
		
		if(existCollision ){
			return true;
		}
		
		
		//vector left
		let leftVectorStart = new THREE.Vector3(this.shipCenter[0],this.shipCenter[1],this.shipCenter[2]); 
		let leftVectorEnd = this.boundsSpheres[2].position.clone();
		let leftRaycaster = new THREE.Raycaster();
		leftRaycaster.set(leftVectorStart,leftVectorEnd);
		let leftIntersects = leftRaycaster.intersectObjects(scene.children );		
		for (let i=0;i< leftIntersects.length;i++) {			
			if(!this.gameScene.isExcludeObjectByName(leftIntersects[i].object.name)){	
				//console.log(leftIntersects[i].distance);							
				if(leftIntersects[i].distance<30){						
					//console.log('leftRaycaster');
					existCollision = true;	
					break;		
					//intersects[i].object.material.color.set( 0xff0000 );
				}
			}			
		}			
		return existCollision;
		
	}//end function
	
	checkCollisionsByRadius(scene){
		//console.log('checkCollisionsByRadius');
		let existCollision = false;

		for (let idx=0;idx<scene.children.length;idx++) {
			if(scene.children[idx].name.length>0){
				let childName = scene.children[idx].name;			
				let isExcludeObject = this.gameScene.isExcludeObjectByName(childName);
				if(!isExcludeObject){					
					let distCoords = WebGL_threeUtil.getVector3Coords(scene.children[idx].position);
					let distToObject = XF_Math3dUtil.getDistance3d(this.shipCenter,distCoords);
					if(distToObject<this.boundRadius){ 
						//console.log(childName);
						existCollision = true;
						break;
					}
				}				
			}
			else {
				//let item = scene.children[idx].toJSON();
				//console.log(item.object.type);
			}
		}//end for
		return existCollision;	
	}//end function	
	*/
		//light position	
		//........................................................................	
		/*	
		this.light = new THREE.PointLight(0xffffff,1,100,1 );
		scene.add(this.light);		
		let ligthVector = new THREE.Vector3(); 
		wglCamera.getWorldDirection(ligthVector);			
		ligthVector.multiplyScalar(25);
		this.light.position.x = wglCamera.position.x+ ligthVector.x;
		this.light.position.y = wglCamera.position.y+ ligthVector.y;
		this.light.position.z = wglCamera.position.z+ ligthVector.z;		
		this.light.rotation.x = this.rotation.x;
		this.light.rotation.y = this.rotation.y;
		this.light.rotation.z = this.rotation.z;	
		this.light.translateY(this.distCabinaToCameraY * (-1));
		*/
		//........................................................................		
			
}//end class

//....................................................................................
//class GamepadTimer
//....................................................................................
class PlayerTimer{
	
	constructor(objListener,interval) {
		this.objListener = objListener;
		this.interval = interval;
		this.tid = null;
	}
	
	run() {
		this.tid = setInterval(executeTimerCode, this.interval)
		var objAlert = this.objListener;
		function executeTimerCode() {		
			objAlert.onAlert();		
		}
	}

	abort() {
		clearTimeout(this.tid);	 	
	}

} //End class XfTimer