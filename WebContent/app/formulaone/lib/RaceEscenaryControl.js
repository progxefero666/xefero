/**
 * RaceEscenaryControl
 */
 class  RaceEscenaryControl {        
	
	//constructor	
	constructor(app,circuitId) {
		this.app 	= app;
		this.circuitId = circuitId;
		this.terrain = null;
		this.init(this.app.app_THREE);
	}//end constructor
	
	init(THREE){
		
		this.dataPath = RaceRoadControl.CIRCUITS_PATH.concat(this.circuitId).concat('/');
		
		this.skybox = WebGL_sceneUtil.createSkyBox(THREE,this.dataPath.concat('skybox/'),'skybox',3000);
		this.app.scene.add(this.skybox);
		
		this.terrain = new WebGL_groupdtos(this,this.dataPath.concat('terrain/'),'terrain');
		this.terrain.loadWglObjects(THREE,this.app.scene,this.app.fbxLoader,this.app.txtLoader,null);	
				
	}//end function
		
	alertAllDtosCharged(id){
		switch (id) {	    	 
			//case 'buildings':break;	
			case 'terrain':
				this.terrain.grdto.children[0].layers.set(1);
				console.log('terrain loaded');
				break;					
		 	default:
	    }//end switch
	}//end function	
			
	dinamic(){
		
		//skybox
		//...............................................................................
		if(this.app.player.position!=null){
			this.skybox.position.x = this.app.player.position.x;
			this.skybox.position.y = this.app.player.position.y;
			this.skybox.position.z = this.app.player.position.z;
		}
				
	}//end function	
				
}//end class