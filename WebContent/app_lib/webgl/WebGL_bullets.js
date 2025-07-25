
/**
 * class ArmBullet
 */
 class ArmBullet {        
    
	constructor(control,gunId,positionStart,positionEnd,bulletRotation,bulletModel,velocity ) {
		this.control 		= control;
		this.gunId 			= gunId;
		this.positionStart 	= positionStart;
		this.positionEnd 	= positionEnd;
		this.bulletRotation = bulletRotation;
		this.bulletModel 	= bulletModel;
		this.velocity		= velocity;
		this.lineDirection  = new XfLineDirection(this.positionStart,this.positionEnd);
		this.direction = null;
		this.init(this.control.app.app_THREE);
	}//end constructor
	
	init(THREE){
		this.gunsDistX 		= 6;
		this.liveIndex		= 0;
		this.pointStartIndex= 0;		
		this.pointEndIndex  = 0;
		
		this.wglObject = this.bulletModel.getObjectClone();
		var texture = getColorTexture(THREE,'trCanvas',this.wglObject.color);
		this.wglObject.loadWglColorObject(
			THREE,
			this.control.app.scene,
			this.control.app.fbxLoader,
			texture);
		
	}//end function
	
	update(THREE){
		
		/*
		let pointStartCoord = this.lineDirection.points[this.pointStartIndex];
		let pointEndCoord = this.lineDirection.points[this.pointEndIndex];
				
		let material = new THREE.LineBasicMaterial({
			color: 0x0000ff
		});
		let lineStart = new THREE.Vector3(pointStartCoord[0],pointStartCoord[1],pointStartCoord[2]);
		let lineEnd   = new THREE.Vector3(pointEndCoord[0],pointEndCoord[1],pointEndCoord[2]);
		
		let points = [];
		points.push(lineStart);
		points.push(lineEnd);
		
		let geometry = new THREE.BufferGeometry().setFromPoints(points);
		this.line = new THREE.Line(geometry,material);
		*/
		
		let coordX 		= this.lineDirection.direction.elements[0];
		let coordY 		= this.lineDirection.direction.elements[1];
		let coordZ		= this.lineDirection.direction.elements[2];
		this.direction	= new THREE.Vector3(coordX,coordY,coordZ);
				
		this.wglObject.sceneObj.position.x = this.lineDirection.points[this.pointStartIndex][0];
		this.wglObject.sceneObj.position.y = this.lineDirection.points[this.pointStartIndex][1];
		this.wglObject.sceneObj.position.z = this.lineDirection.points[this.pointStartIndex][2];
		
		this.control.onLiveBullet(this.control.app.app_THREE,this);
	}//end function
	
	dinamic(){
		let valueIndexStart = this.pointStartIndex + this.velocity;
		if(valueIndexStart<this.lineDirection.len){
			this.pointStartIndex = this.pointStartIndex + this.velocity;
			
			if(this.pointStartIndex<(this.lineDirection.len-1)){
				this.pointEndIndex = this.pointStartIndex + 1;
			}
			else {
				this.pointEndIndex = this.positionEnd
			}
			
			if(this.wglObject.sceneObj != null) {
				this.wglObject.sceneObj.rotation.x = this.bulletRotation[0];			
				this.wglObject.sceneObj.rotation.y = this.bulletRotation[1];
				this.wglObject.sceneObj.rotation.z = this.bulletRotation[2];		
				this.update(this.control.app.app_THREE);
			}
		}
		else {
        	this.control.app.scene.remove(this.wglObject.sceneObj);
			this.control.removeBullet(this.gunId);
			this.wglObject = null;
			this.direction	= null;
		}
	}//end function
	
		
}//end class

/**
 * class GunBullet
 */
 class GunBullet {        
    
	constructor(control,positionStart,positionEnd,bulletRotation,bulletModel ) {
		this.control 		= control;
		this.positionStart 	= positionStart;
		this.positionEnd 	= positionEnd;
		this.bulletRotation = bulletRotation;
		this.bulletModel 	= bulletModel;
		this.lineDirection  = new XfLineDirection(this.positionStart,this.positionEnd);
		this.init(this.control.app.app_THREE);
	}//end constructor
	
	init(THREE){
		this.gunsDistX 		= 6;
		this.liveIndex		= 0;
		this.pointStartIndex= 0;		
		
		this.wglObject = this.bulletModel.getObjectClone();
		var texture = getColorTexture(THREE,'trCanvas',this.wglObject.color);
		this.wglObject.loadWglColorObject(
			THREE,
			this.control.app.scene,
			this.control.app.fbxLoader,
			texture);
		this.configured = false;
	}//end function
	
	update(THREE){	
		let coordX 		= this.lineDirection.direction.elements[0];
		let coordY 		= this.lineDirection.direction.elements[1];
		let coordZ		= this.lineDirection.direction.elements[2];
		this.direction	= new THREE.Vector3(coordX,coordY,coordZ);
				
		this.wglObject.sceneObj.position.x = this.lineDirection.points[this.pointStartIndex][0];
		this.wglObject.sceneObj.position.y = this.lineDirection.points[this.pointStartIndex][1];
		this.wglObject.sceneObj.position.z = this.lineDirection.points[this.pointStartIndex][2];		
		this.control.onLiveBullet(this.control.app.app_THREE,this);
		
	}//end function
	
	dinamic(){
		if(!this.configured ){
			if(this.wglObject.sceneObj != null) {
				this.wglObject.sceneObj.name = 'bullet';	
				this.wglObject.sceneObj.layers.set(1);
				this.configured = true;				
			}
		}
		
		let valueIndexStart = this.pointStartIndex + this.control.firesVelocity;
		if(valueIndexStart<this.lineDirection.len){
			this.pointStartIndex = this.pointStartIndex + this.control.firesVelocity;
			
			if(this.wglObject.sceneObj != null) {
				this.wglObject.sceneObj.rotation.x = this.bulletRotation.x;			
				this.wglObject.sceneObj.rotation.y = this.bulletRotation.y;
				this.wglObject.sceneObj.rotation.z = this.bulletRotation.z;		
				this.update(this.control.app.app_THREE);
			}
		}
		else {
        	this.control.app.scene.remove(this.wglObject.sceneObj);
			this.control.removeBullet();
			this.wglObject = null;
		}
	}//end function
	
		
}//end class


/**
 * class ArmBullet
 */
 class ArmLineBullet {        
    
	constructor(control,gunId,positionStart,positionEnd,velocity ) {
		this.control 		= control;
		this.gunId 			= gunId;
		this.positionStart 	= positionStart;
		this.positionEnd 	= positionEnd;
		this.velocity		= velocity;
		this.lineDirection  = new XfLineDirection(this.positionStart,this.positionEnd);					
		this.direction = null;
		this.init(this.control.app.app_THREE);
	}//end constructor
	
	init(THREE){
		this.material = new THREE.LineBasicMaterial({color: 0x0000ff});
		this.liveIndex		= 0;
		this.pointStartIndex= 0;		
		this.pointEndIndex = this.pointStartIndex + this.velocity;
		
		let pointStartCoord = this.lineDirection.points[this.pointStartIndex];
		let pointEndCoord = this.lineDirection.points[this.pointEndIndex];
				
		let lineStart 	= new THREE.Vector3(pointStartCoord[0],pointStartCoord[1],pointStartCoord[2]);
		let lineEnd   	= new THREE.Vector3(pointEndCoord[0],pointEndCoord[1],pointEndCoord[2]);		
		let points 		= [lineStart,lineEnd];
		
		let geometry = new THREE.BufferGeometry().setFromPoints(points);
		this.line = new THREE.Line(geometry,this.material);		
		this.control.app.scene.add(this.line);
	}//end function
	
	update(THREE){		
						
		let pointStartCoord = this.lineDirection.points[this.pointStartIndex];
		let pointEndCoord 	= this.lineDirection.points[this.pointEndIndex];						
		let lineStart 		= new THREE.Vector3(pointStartCoord[0],pointStartCoord[1],pointStartCoord[2]);
		let lineEnd   		= new THREE.Vector3(pointEndCoord[0],pointEndCoord[1],pointEndCoord[2]);		
		let points 			= [lineStart,lineEnd];		
		let geometry 		= new THREE.BufferGeometry().setFromPoints(points);
		geometry.verticesNeedUpdate = true;
		this.control.app.scene.remove(this.line);
		this.line = new THREE.Line(geometry,this.material);
		this.control.app.scene.add(this.line);
		this.control.onLiveBullet(this.control.app.app_THREE,this);
	}//end function
	
	dinamic(){
		this.pointStartIndex = this.pointEndIndex;				
		if(this.pointStartIndex<(this.lineDirection.len)){			
			this.pointEndIndex += this.velocity;			
			if(this.pointEndIndex>=this.lineDirection.len){	
				this.pointEndIndex = this.pointStartIndex;
			}
			this.update(this.control.app.app_THREE);			
		}
		else {
        	this.control.app.scene.remove(this.line);
			this.control.removeBullet(this.gunId);
		}
	}//end function
	
		
}//end class


