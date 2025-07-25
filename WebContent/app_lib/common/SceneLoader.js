
/**
 * class SceneLoader
 */
class  SceneLoader {       
	
	//constructor	
	//..........................................................................
	constructor(app,THREE,scene,fbxLoader,txtLoader,circuitId) {
		this.app 		= app;
		this.app_THREE 	= THREE;
		this.scene 		= scene;
		this.txtLoader 	= txtLoader;
		this.fbxLoader 	= fbxLoader;
		this.circuitId 	= circuitId;
		
		this.escenaryControlLoad=false;
		this.roadControlLoad	=false;	
		
		this.scenary = new RaceEscenaryControl(THREE,this,this.circuitId);
		this.road 	 = 	new RaceRoadControl(THREE,this,this.circuitId);				
	}//end constructor
		
	onControlReady(controlId){		
		if(controlId=='EscenaryControl'){	
			this.escenaryControlLoad=true;
		}		
		if(controlId=='F1Road'){	
			this.roadControlLoad=true;			
		}	
		if(this.escenaryControlLoad &&this.roadControlLoad){
			this.app.onLoaderSceneFinish();	
		}
	}//end function
	
	
}//end class		