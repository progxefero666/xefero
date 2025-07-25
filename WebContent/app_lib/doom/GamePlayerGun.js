/**
 * class GamePlayerGun
 */

 var thisPlayerGun = null;
 
 class GamePlayerGun {        
    
	constructor(app) {
		this.app = app;
		
		thisPlayerGun = this;
		this.configure();
		this.app.objCanvas.addEventListener("pointerdown",this.onPointerdown);
	}//end constructor
	
	configure(){
		this.gunsDistX 		= 10;
		this.gunsDistY 		= -60;
		this.targetAlcanzeMax = 500;
		this.targetCoord3d	= [0,0,0];
		this.firePosition  	= [0,0,0];
		
		this.fireRotation  	= null;	
		this.listBullets 	= [];
		this.firesVelocity	= 10;		
		this.bulletModelA	= new WebGL_object(
			null,
			"bullet.fbx",
			[0.588235, 1, 0, 1],
			[0, 0, 0],1,1,
			"data/bullets/",
			null,null,null
		);
		
	}//end function	
	
	init(THREE){
		
		this.target = new WebGL_dto(this,'data/doom/player/blaster/','target');
		this.target.loadWglObject(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null); 		
			
		this.sight = new WebGL_dto(this,'data/doom/player/blaster/','sight');
		this.sight.loadWglObject(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);
				
	}//end function	
	
	alertAllDtosCharged(id){
		switch (id) {
	 		case 'target':
				this.target.dto.layers.set(1);				 
				break;	  			
			case 'sight':
				this.sight.dto.layers.set(1);
				this.sight.dto.scale.set(0.15,0.15,0.15);
				break;			
		 	default:
	    }//end switch	
	    		
	}//end function	
		
	onPointerdown(event){
		if(event.button==0){
			thisPlayerGun.executeFire();
		}		  
	};
	
	executeFire(){
		//this.lineDirection = new XfLineDirection(this.firePosition,this.targetCoord3d);
		let bullet = new GunBullet(this,this.firePosition,this.targetCoord3d,this.fireRotation,this.bulletModelA);
		this.listBullets.push(bullet);
	}//end function
			
	dinamic(THREE,wglCamera){
		this.fireRotation = wglCamera.rotation.clone();
		this.targetCoord3d = WebGL_threeUtil.getCameraView3dCoords(THREE,wglCamera,this.targetAlcanzeMax);
								
		wglCamera.translateX(this.gunsDistX);//XF_Math.toRadians
		wglCamera.translateZ(this.gunsDistY);
		this.firePosition = WebGL_threeUtil.getCameraView3dCoords(THREE,wglCamera,null);
		wglCamera.translateZ(this.gunsDistY*(-1));
		wglCamera.translateX(this.gunsDistX*(-1));
				
		if(this.sight.dto!=null){
			WebGL_threeUtil.setObjectStateToCameraView(THREE,wglCamera,this.sight.dto,2);
		}
		if(this.target.dto!=null){
			WebGL_threeUtil.setObjectStateToCameraView(THREE,wglCamera,this.target.dto,this.targetAlcanzeMax);	
		}													
		if(this.listBullets.length>0){
			for(let bulletIndex=0;bulletIndex<this.listBullets.length;bulletIndex++){
				this.listBullets[bulletIndex].dinamic();		
			}		
		}
	}//end function
	
	onLiveBullet(THREE,bullet){
		
		let raycaster = new THREE.Raycaster(
			bullet.wglObject.sceneObj.position,
			bullet.direction,
			0,this.targetAlcanzeMax
		);
		//raycaster.layers.set(0);			
			
		let childrenTargets = this.app.gameScene.targets;
		
		let intersects = raycaster.intersectObjects(childrenTargets);
		let intersectObjectId = null;
		let intersectPoint = null;
		let existIntersect = false;
		for (let i=0;i< intersects.length;i++) {
			//console.log(intersects[i].object.name);
			intersectObjectId = intersects[i].object.id; 
			intersectPoint = intersects[i].point;
			existIntersect = true;	
			//intersects[i].object.material.color.set( 0xff0000 );
			break;
		}
		if(existIntersect){
			let contactCoords = [intersectPoint.x,intersectPoint.y,intersectPoint.z];
			this.app.onFireContact(intersectObjectId,contactCoords);
		}		
	}//end function
		
	removeBullet(){
		this.listBullets.shift();
	}//end function
		
			
	//..................................................................
	//filter children by layer manually
	/*let childrenTargets = [];
	for(let idx=0;idx<this.app.scene.children.length;idx++)	{
		//console.log('....................................');
		if(this.app.scene.children[idx].layers.mask != 2){
			//console.log('layers mask 2');
			childrenTargets.push(this.app.scene.children[idx]);
		}			
	}*/
	//..................................................................	
	
				
} //end class












