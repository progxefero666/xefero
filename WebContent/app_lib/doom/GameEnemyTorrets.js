/**
 * class GameEnemyTorrets
 */

class  GameEnemyTorrets {        

	static TYPE_SINGLE 	 = 'single';
	static TYPE_COMPOUND = 'group';
	static TYPE_MORPH 	 = 'morph';

	static TORRET_A = 'torretaA';
	static TORRET_A_PATH = 'data/doom/enemy/torretas/torretaA/';
	
	//constructor	
	constructor() {};//end constructor
	
}//end class


/**
 * class GameEnemySoldiers
 */

class  GameEnemyTorret {        

	//constructor	
	constructor(app,modelReference,position) {
		this.app =app;
		this.modelReference = modelReference;
		this.position 	= position;
		this.rotationY  = 0;
		this.configure();
	};//end constructor
	
	configure(){
		this.targetAlcanzeMax 	= 1000;
		this.firesDistToPivot = 40.0;
		this.firesAlturaToPivot = 0.0;
				
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
	}//end function
		
	
	generate(THREE,scene,fbxLoader,txtLoader){
		this.charged = false;
		
		let modelFilePath = null;
		switch(this.modelReference){
			case GameEnemyTorrets.TORRET_A:
				modelFilePath = GameEnemyTorrets.TORRET_A_PATH;
				break;			
		}//end switch	
		
		this.model = new WebGL_groupdtos(this,modelFilePath,GameEnemyTorrets.TORRET_A,'torretA');
		
		this.model.loadWglObjects(THREE,scene,fbxLoader,txtLoader,this.position);					
		//this.positionEsphere =  WebGL_threeGenObjects.createObjectSphere(THREE,5,16,[0,0,1],this.position);
		//scene.add(this.positionEsphere);
	}//end function	
			
	alertAllDtosCharged(id){
		console.log(this.model.grdto.name);
		console.log(this.model.grdto.children[0].name);
		//this.model.grdto.children[0].rotateX(XF_Math.RADIAN * 15 );
		this.model.grdto.children[0].rotateY(XF_Math.RADIAN * 90 *(-1));
		
	}//end function	
	
	
}//end class
	