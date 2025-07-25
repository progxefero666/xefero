/**
 *   class  XfBipedModel
 */

class  XfBipedModel {        
	
	//constructor	
	//..........................................................................
	constructor(id,position,objects,dataDirectory) {		
		this.id 		= id;
		this.position	= position;
		this.objects 	= objects;
		this.dataDirectory = dataDirectory;	
		this.wglObjects = [];
		this.bones = [];
		this.postConstructor();
	}//end constructor
	
	postConstructor() {
		
		let hipPositionY = this.objects[0].position[1];
		for (var i=0;i<this.objects.length;i++){
			//!!!change coord Y!!!
			this.objects[i].position[1] = this.objects[i].position[1]-hipPositionY;
			
			this.wglObjects[i] = new XfBipedModelObject(
				this.objects[i].parent_id,
				this.objects[i].id,
				this.objects[i].color,
				this.objects[i].position,			
				this.objects[i].textures,
				this.objects[i].textures,
				null
			);
		}
		
		this.wglObjects[0].parentTranslation = [0,0,0];
		for (var i=1;i<this.objects.length;i++){
			let parIndex = this.getObjectIndexById(this.wglObjects[i].parentId);
			
			let objParentPositionX = this.wglObjects[parIndex].position[0];
			let objParentPositionY = this.wglObjects[parIndex].position[1];
			let objParentPositionZ = this.wglObjects[parIndex].position[2];	
			
			let transX = this.wglObjects[i].position[0] - objParentPositionX;
			let transY = this.wglObjects[i].position[1] - objParentPositionY;
			let transZ = this.wglObjects[i].position[2] - objParentPositionZ;
			
			this.wglObjects[i].parentIndex = parIndex;
			this.wglObjects[i].parentTranslation = [transX,transY,transZ];			
		}
		
		//generate biped bones
		this.bones = [];
		this.bones[0] = new XfBipedBone(-1,[0,0,0],'hip',[0,0,0]);
		for (let idx=1;idx<this.wglObjects.length;idx++){
			
			let parIndex = this.wglObjects[idx].parentIndex;
			let parentPosition =[
				this.wglObjects[parIndex].position[0],
				this.wglObjects[parIndex].position[1],
				this.wglObjects[parIndex].position[2],
			];
			let bonePosition =[
				this.wglObjects[idx].position[0],
				this.wglObjects[idx].position[1],
				this.wglObjects[idx].position[2]
			];
			this.bones[idx] = new XfBipedBone(parIndex,parentPosition,this.wglObjects[idx].id,bonePosition);			
		}
			
	}//end function
			
	initBones(THREE){
		for (let idx=0;idx<this.bones.length;idx++){
			//this.bones[idx].init(THREE);
		}
	}//end function
	
	getObjectIndexById(objectId){
		let indexReturn = -1;
		for (var i=0;i<this.objects.length;i++){
			if(this.wglObjects[i].id == objectId ){
				indexReturn = i;
				break;
			}
		}
		return indexReturn;
	}//end function
	
	/*
	for (var i=0;i<this.objects.length;i++){
		console.log('.................................');
		console.log('index');
		console.log(i);
		console.log('id');
		console.log(this.wglObjects[i].id);
	}
	*/
	
	
}//end class