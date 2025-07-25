41/**
 * class GamePlayerShip
 */

var thisDoomPlayer = null;

class DoomPlayer {        
    

	//constructor	
	constructor(app,wglGun) {
		this.app 	  = app;
		this.wglGun= wglGun;
		thisDoomPlayer = this;
		this.configure();
						
	}//end constructor	
	
	configure(){
		this.distPivotToFloor = 54.0;
		this.distGunToPivot = 140;
		this.distGunX = 12;
		this.distGunToCamera = 20;
		this.rotationPlaneY = 0;
		this.pivotPosition = [0,0,0];
		this.velocity = 3.0;
		this.targetPosition= [0,0,0];
		this.moveForward = false; 
		this.moveBackward = false; 
		this.moveLeft = false;
		this.moveRight = false;		
		this.moveRight = false;
		this.pitchUp = false;
		this.pitchDown = false;
		this.turnLeft = false;
		this.turnRight = false;
		this.checkCollisions = true
		//this.position = new THREE.Vector3(0,0,0);
	}//end function

	
	dinamic(THREE,wglCamera,targetCoord3d){
		
		this.rotation = wglCamera.rotation.clone();
		
	
		//moveForward moveBackward
		//..................................................................................
		let validPosition = null;
		let potencialPosition = null;
		
		if(this.moveForward || this.moveBackward){
			potencialPosition = this.calculateNextPositionFB(wglCamera,targetCoord3d,this.velocity);				
			//validPosition     = this.checkNextPosition(THREE,this.position,potencialPosition);			
			validPosition = this.app.gameScene.getCoord3dIntoTerrain(potencialPosition);
			//console.log(validPosition);
			if(validPosition!=null){
				this.targetPosition= potencialPosition;	
				//!!! change camera position front back !!!
				wglCamera.position.x = this.targetPosition[0];	
				wglCamera.position.y = this.targetPosition[1];
				wglCamera.position.z = this.targetPosition[2];				
			}		
		}//end if		

		if(this.moveLeft || this.moveRight){
			potencialPosition = this.calculateNextPositionLR(wglCamera,targetCoord3d,this.velocity);
			//validPosition     = this.checkNextPosition(THREE,this.position,potencialPosition);	
			validPosition = this.app.gameScene.getCoord3dIntoTerrain(potencialPosition);
			//console.log(validPosition);				
			if(validPosition!=null){
				this.targetPosition= potencialPosition;				
				//!!! change camera position left right !!!
				wglCamera.position.x = this.targetPosition[0];	
				wglCamera.position.y = this.targetPosition[1];
				wglCamera.position.z = this.targetPosition[2];
			}
		}//end if
		
		if(validPosition!=null){
			if(this.moveForward || this.moveBackward || this.moveLeft || this.moveRight){
				WebGL_threeUtil.setObjectStateToCameraView(THREE,wglCamera,this.app.playerGun.sight.dto,2);
				WebGL_threeUtil.setObjectStateToCameraView(THREE,wglCamera,this.app.playerGun.target.dto,this.app.playerGun.targetAlcanzeMax);			
			}//end if		
		}	
		
		
		//..................................................................................
		
		if(validPosition!=null){
			if(this.position!=null){
				this.pivotPosition[0] = this.position.x; 
				//this.pivotPosition[1] = this.app.gameScene.getPositionTerrainHeight(THREE,this.position.x,this.position.z);
				this.pivotPosition[1] = validPosition[1];
				this.pivotPosition[2] = this.position.z;	
				wglCamera.position.y = 	this.pivotPosition[1] + this.distGunToPivot;
			}
		}
		
		//..................................................................................
			
		//.................................................................................		
		//calculate gun position translated x
		//..................................................................................
		let cameraVector = new THREE.Vector3(); 
		wglCamera.getWorldDirection(cameraVector);			  		
		cameraVector.multiplyScalar(this.distGunToCamera);
		wglCamera.translateX(this.distGunX);
		this.position = new THREE.Vector3(); 
		this.position.x = wglCamera.position.x+ cameraVector.x;
		this.position.y = wglCamera.position.y+ cameraVector.y;
		this.position.z = wglCamera.position.z+ cameraVector.z;		
		wglCamera.translateX(this.distGunX * (-1));
		//..................................................................................

		
		//update wgl player state
		//..................................................................................								
		this.updateWglState();
		/*			
		let distCalc = XF_Math3dUtil.getDistance3d(
			WebGL_threeUtil.getVector3Coords(wglCamera.position),
			WebGL_threeUtil.getVector3Coords(this.position));
		console.log(distCalc);
		*/						
	}//end function
	
	//calculateNext camera position front back
	//.........................................................................................................
	calculateNextPositionFB(wglCamera,targetCoord3d,velocity){		
		let currentPosition = WebGL_threeUtil.getVector3Coords(this.position);
		let rotPlaneY 		= XF_Math3dUtil.getTwoVertexAngle_Y(currentPosition,targetCoord3d);
		let pivot 			= new XF_Pivot();
		pivot.movePivot([wglCamera.position.x,wglCamera.position.y,wglCamera.position.z]);						
		pivot.rotatePivot(1,rotPlaneY);	
		let targetDistance = velocity;			
		let nextPosition = [currentPosition[0],currentPosition[1],currentPosition[2]];	
		if(this.moveForward){
			nextPosition = pivot.getDirecctionVertex(0,targetDistance);
		}
		else {
			nextPosition= pivot.getDirecctionVertexInverse(0,targetDistance);
		}
		return nextPosition;
			
	}//end function
	
	//calculateNext camera position left right
	//.........................................................................................................
	calculateNextPositionLR(wglCamera,targetCoord3d,velocity){
		let currentPosition = WebGL_threeUtil.getVector3Coords(this.position);
		let rotPlaneY 		= XF_Math3dUtil.getTwoVertexAngle_Y(currentPosition,targetCoord3d);
		let pivot 			= new XF_Pivot();
		pivot.movePivot([wglCamera.position.x,wglCamera.position.y,wglCamera.position.z]);		
		let angleCalc= 0;
		if(this.moveLeft){
			angleCalc= XF_Math.getAngleInc(rotPlaneY,(Math.PI/2));		
		}
		else {
			angleCalc= XF_Math.getAngleDec(rotPlaneY,(Math.PI/2));
				
		}
		pivot.rotatePivot(1,angleCalc);
		
		let targetDistance = velocity;
		let nextPosition = pivot.getDirecctionVertex(0,targetDistance);
		return nextPosition;
	}//end function
	
	//check next camera position
	//.........................................................................................................
	checkNextPosition(THREE,vectorStart,coord3d){	
		if(!this.checkCollisions){
			return true;
		}
		let check = true;
		let vectorCoord = new THREE.Vector3(coord3d[0],coord3d[1],coord3d[2]); 
		let raycaster = new THREE.Raycaster(vectorStart,vectorCoord,0,100);
		//raycaster.layers.set(0);
		let intersects = raycaster.intersectObjects(this.app.scene.children);
		for (let i=0;i< intersects.length;i++) {	
			if(intersects[i].distance<60){				
				if(intersects[i].object.name.length>0){
					if(!this.app.gameScene.isExcludeObjectByName(intersects[i].object.name)){
						//console.log(intersects[i].distance);	
						check = false;
						break;
					}		
				}				
				else {
					//console.log(intersects[i].object.id);
				}
			}
		}//end for
		return check;
	}//end function
		
	updateWglState(){
		this.wglGun.position.x = this.position.x;
		this.wglGun.position.y = this.position.y;
		this.wglGun.position.z = this.position.z;
		this.wglGun.rotation.x = this.rotation.x;		
		this.wglGun.rotation.y = this.rotation.y;		
		this.wglGun.rotation.z = this.rotation.z;		
	}//end function
	
	//game pad commands
	//..................................................................................................	
	moveZeroFB(){
		this.moveForward  = false;
		this.moveBackward = false
	}//end function
		
	moveFront(){
		this.moveForward = true;	
		this.moveBackward = false;				
	}//end function
	
	moveBack(){
		this.moveBackward = true;	
		this.moveForward = false;			
	}//end function	
	
	moveZeroLR(){
		this.moveLeft  = false;
		this.moveRight = false
	}//end function
		
	moveIzquierda(){
		this.moveLeft = true;
		this.moveRight = false;	
	}//end function
		
	moveDerecha(){
		this.moveRight = true;		
		this.moveLeft = false;		
	}//end function
			
	viewUp(){
		this.pitchUp = true;
		this.pitchDown = false;	
		let pitchValue = 1.5;
		this.app.firstPersonControls.pitchUp(pitchValue);
	}//end function
			
	viewDown(){
		this.pitchDown = true;	
		this.pitchUp = false;	
		let pitchValue = 1.5;
		this.app.firstPersonControls.pitchDown(pitchValue);
	}//end function
		
	viewZero(){
		this.pitchUp = false;
		this.pitchDown = false;		
		this.app.firstPersonControls.pitchCero();
	}//end function
					
	girarIzquierda(){
		this.turnLeft = true;
		this.turnRight = false;
		let turnValue = 1.5;		
		this.app.firstPersonControls.turnLeft(turnValue);
	}//end function
	
	girarDerecha(){
		this.turnRight = true;
		this.turnLeft  = false;
		let turnValue = 1.5;
		this.app.firstPersonControls.turnRight(turnValue);
	}//end function	
				
	girarZero(){
		this.turnLeft  = false;
		this.turnRight = false;
		this.app.firstPersonControls.turnCero();
	}//end function	
			
}//end class

//let distCalc = XF_Math3dUtil.getDistance3d(WebGL_threeUtil.getVector3Coords(this.position),targetCoord3d);
//console.log(distCalc);	
			
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