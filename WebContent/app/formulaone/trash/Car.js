41/**
 * class Car
 */
class Car{        
       
	//constructor	
	constructor(parent,modelId,initPosition) {
		this.parent 	= parent;
		this.modelId = modelId;	
		this.position = initPosition;
		this.init(this.parent.app.app_THREE);
	}//end constructor
	
	init(THREE){						
		let path = 'data/gamecar/cars/'.concat(this.modelId).concat('/');
		this.machine = new WebGL_groupdtos(this,path,this.modelId,this.modelId);
		//debugger;
		this.machine.loadWglObjects(THREE,this.parent.app.scene,this.parent.app.fbxLoader,this.parent.app.txtLoader,this.position);
		//this.machine.boundRadius		
	}//end function	
	
	alertAllDtosCharged(id){
		this.parent.addCarMachine(this.machine.grdto);
	    this.update();
	}//end function		
		
	update(){
		this.machine.grdto.position.x = this.position[0];
		this.machine.grdto.position.y = this.position[1];
		this.machine.grdto.position.z = this.position[2];
		this.machine.grdto.rotation.x = 0;
		this.machine.grdto.rotation.z = 0;	
		this.machine.grdto.rotation.y = 0; 
		//this.machine.grdto.rotateY(currentStep.rotationY);			

	}//end function		
	
	
}//end class	


       