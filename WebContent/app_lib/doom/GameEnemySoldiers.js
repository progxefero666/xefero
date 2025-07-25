/**
 * class GameEnemySoldiers
 */

class  GameEnemySoldiers {        

	static TYPE_SINGLE 	 = 'single';
	static TYPE_COMPOUND = 'group';
	static TYPE_MORPH 	 = 'morph';

	static BATTLEDROID = 'battledroid';
	static BATTLEDROID_PATH = 'data/doom/enemy/soldier/battledroid/';
	
	//constructor	
	constructor() {};//end constructor
	
}//end class


/**
 * class GameEnemySoldiers
 */

class  GameEnemySoldier {        

	//constructor	
	constructor(app,modelReference,type,velocity,position) {
		this.app =app;
		this.modelReference = modelReference;
		this.type 		= type;
		this.position 	= position;
		this.velocity	= velocity;
		this.rotationY  = 0;//XF_Math.RADIAN*270
		this.configure();
		//this.generate(THREE,scene,fbxLoader,txtLoader);
	};//end constructor
	
	configure(){
		
		this.walkCycleDist =1.2;
		this.walkStepDist =this.walkCycleDist / 28; //this.model.countItems;
		this.targetAlcanzeMax 	= 500;
		this.firesDistToPivot = 60.0;
		this.firesAlturaToPivot = 114.0;
		this.firesAngleToPivot = XF_Math.RADIAN * 10;		
		this.listBullets = [];
		this.firesVelocity 	= 1;				
		this.bulletModelA = new WebGL_object(
			null,
			"bullet.fbx",
			[1.0,0,0,1],
			[0, 0, 0],1,1,
			"data/bullets/",
			null,null,null
		);	
		this.countStepFrames = 12-this.velocity;
		this.indexStepFrame = -1;
		this.ready = false;
		this.walking =true;	
	}//end function
	
	generate(THREE,scene,fbxLoader,txtLoader){
		this.charged = false;
		
		let modelFilePath = null;
		switch(this.modelReference){
			case GameEnemySoldiers.BATTLEDROID:
				modelFilePath = GameEnemySoldiers.BATTLEDROID_PATH;
				break;			
		}//end switch	
		
		//this.model = new WebGL_dto(this,modelFilePath,GameEnemySoldiers.BATTLEDROID);		
		//this.model = new WebGL_groupdtos(this,modelFilePath,GameEnemySoldiers.BATTLEDROID,'enemy_1');
		this.model = new WebGL_morphdto(this,modelFilePath,GameEnemySoldiers.BATTLEDROID,'enemy_1');
		
		
		this.model.loadWglObjects(THREE,scene,fbxLoader,txtLoader,this.position);					
		this.positionEsphere =  WebGL_threeGenObjects.createObjectSphere(THREE,5,16,[0,0,1],this.position);
		scene.add(this.positionEsphere);
	}//end function	
	
	alertAllDtosCharged(id){
		this.id = id;
		this.app.gameScene.addTargetSimple(this.model.dtos[0]);
		this.ready= true;
	}//end function	
		
	dinamic(){		
		if(this.ready){
			if(this.walking){
				this.indexStepFrame++;
				if(this.indexStepFrame==this.countStepFrames){
					this.model.dinamic(this.app.scene);
					this.indexStepFrame=-1;
				}				
			}
			
			if(this.listBullets.length>0){
				for(let bulletIndex=0;bulletIndex<this.listBullets.length;bulletIndex++){
					this.listBullets[bulletIndex].dinamic();	
				}		
			}		
			this.updateWglState();			
		}
	}//end function
		
	updateWglState(){
				
		// target Coord3d
		//..........................................................................
		this.targetCoord3d= XF_Math3dCf.getCf3dOneVertex(1,this.position,this.targetAlcanzeMax,this.rotationY);	
		this.targetCoord3d[1]+=this.firesAlturaToPivot;
		//..........................................................................
		// guns coord3d
		//..........................................................................
		let angleDec = XF_Math.getAngleDec(this.rotationY,this.firesAngleToPivot);
		this.firePosition = XF_Math3dCf.getCf3dOneVertex(1,this.position,this.firesDistToPivot,angleDec);
		this.firePosition[1]+=this.firesAlturaToPivot;
		//..........................................................................
				
	}//end function			
	
	executeFire(){
		let angleDec = XF_Math.getAngleDec(this.rotationY,Math.PI/2);
		let bulletRotation = [0,angleDec,0];
		let bullet = new ArmBullet(this,'right',this.firePosition,this.targetCoord3d,bulletRotation,this.bulletModelA,this.firesVelocity);
		this.listBullets.push(bullet);
	}//end function
	
	removeBullet(){		
		this.listBullets.shift();
	}//end function

		
	onLiveBullet(THREE,bullet){
		//console.log('onLiveBullet');
	}//end function
			
}//end class