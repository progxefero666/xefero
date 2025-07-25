/**
 * class GamePlayerArm
 */
 class GamePlayerArm {        
    
	constructor(app) {
		this.app = app;
		this.configure();
		this.update([0,0,0],this.app.playerShip.targetCoord3d);
	}//end constructor
	
	configure(){
		this.listBullets = [];
		this.firesVelocity 		= 10;
		this.nextWeaponActive = 'right';
	}//end function
		
	update(cameraRotation,targetCoord3d){
		this.targetCoord3d  = targetCoord3d;
		if(this.listBullets.length>0){
			for(let bulletIndex=0;bulletIndex<this.listBullets.length;bulletIndex++){
				this.listBullets[bulletIndex].dinamic(cameraRotation);
			}		
		}
	}//end function
	
	executeFire(firePositionR,firePositionL){
		//this.lineDirectionR = new XfLineDirection(firePositionR,this.targetCoord3d);
		//this.lineDirectionL = new XfLineDirection(firePositionL,this.targetCoord3d);		
		if(this.nextWeaponActive =='right'){
			let bullet = new ArmBullet(this,firePositionR,this.targetCoord3d);
			this.listBullets.push(bullet);
			this.nextWeaponActive = 'left';
		}
		else {
			
			let bullet = new ArmBullet(this,firePositionL,this.targetCoord3d);
			this.listBullets.push(bullet);		
			this.nextWeaponActive = 'right';	
		}
	}//end function
	
	removeBullet(){
		this.listBullets.shift();
	}//end function
	
	
}//end class	

/**
 * class ArmBullet
 */
 class ArmBullet {        
    
	constructor(control,positionStart,positionEnd) {
		this.control 		= control;
		this.positionStart 	= positionStart;
		this.positionEnd 	= positionEnd;
		this.lineDirection  = new XfLineDirection(this.positionStart,this.positionEnd);
		this.init(this.control.app.app_THREE);
	}//end constructor
	
	init(THREE){
		this.liveIndex		= 0;
		this.pointStartIndex= 0;		
		this.wglObject = new WebGL_object(
			null,
			"bullet.fbx",
			[0.588235, 1, 0, 1],
			[0, 0, 0],1,1,
			"data/bullets/",
			null,null,null
		) 
		var texture = getColorTexture(THREE,'trCanvas',this.wglObject.color);
		this.wglObject.loadWglColorObject(
			THREE,
			this.control.app.scene,
			this.control.app.fbxLoader,
			texture);
	}//end function
	
	update(){	
		this.wglObject.sceneObj.position.x = this.lineDirection.points[this.pointStartIndex][0];
		this.wglObject.sceneObj.position.y = this.lineDirection.points[this.pointStartIndex][1];
		this.wglObject.sceneObj.position.z = this.lineDirection.points[this.pointStartIndex][2];
	}//end function
	
	dinamic(bulletRotation){
		let valueIndexStart = this.pointStartIndex + this.control.firesVelocity;
		if(valueIndexStart<this.lineDirection.len){
			this.pointStartIndex = this.pointStartIndex + this.control.firesVelocity;
			this.wglObject.sceneObj.rotation.x = bulletRotation.x;
			this.wglObject.sceneObj.rotation.y = bulletRotation.y;
			this.wglObject.sceneObj.rotation.z = bulletRotation.z;	
			this.update();
		}
		else {
        	this.control.app.scene.remove(this.wglObject.sceneObj);
			this.control.removeBullet();
		}
	}//end function
	
		
}//end class











