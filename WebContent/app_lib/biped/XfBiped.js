/**
 * class XfBiped
 */
 class XfBiped {        
    
   
    
	constructor(app,id) {
		this.app = app;
		this.id = id;
		this.position = [0,0,0];
		this.wglBones = [];
		this.chargedFinish = false;
	}//end constructor
	
	init(THREE,scene,fbxLoader,loaderTextures){
		// @ts-ignore
		this.model = XfBipedUtil.readBiped3DfromPath(this.id,this.position);
		this.model.position[1] = this.position[1]
		
		//......................................................................
		// load body items
		//......................................................................
		for (var objIdx=0;objIdx<this.model.wglObjects.length;objIdx++){
			this.loadWglBone(THREE,scene,fbxLoader,loaderTextures,
							 this.model.dataDirectory,
							 this.model.wglObjects[objIdx],
							 this.model.wglObjects.length,
							 objIdx,
							 this.app);
		}
		//......................................................................
		
		
		//......................................................................
		//create skeleton bones
		//......................................................................
		this.bipedBones = [];
		for (var objIdx=0;objIdx<this.model.wglObjects.length;objIdx++){
			
			let childrens= null;			
			if(objIdx<this.model.wglObjects.length-1){
				childrens= [];
				let childIndex =0;
				for (var soonIdx=objIdx;soonIdx<this.model.wglObjects.length;soonIdx++){
					if(this.model.wglObjects[soonIdx].parentId==this.model.wglObjects[objIdx].id){
						childrens[childIndex] = soonIdx;
						childIndex++;
					}
				}
			}
			// @ts-ignore
			this.bipedBones[objIdx] = new XfBipedBone(
				this,
				this.model.wglObjects[objIdx].parentId,
				this.model.wglObjects[objIdx].id,
				this.model.wglObjects[objIdx].position,
				childrens);
		}		
		for (var boneIdx=0;boneIdx<this.bipedBones.length;boneIdx++){
			this.bipedBones[boneIdx].init();
		}		
		//......................................................................
		
	}//end function
	

	executePose() {
		//console.log('executeAnimation start');	

		//this.inclinarBodySuperior(0,XfBipedUtil.toRadians(45));
		
		//this.rotarCodoDerecho(0,XfBipedUtil.bipedAngle(-30)); 
		//this.rotarCodoDerecho(1,XfBipedUtil.bipedAngle(-15)); 		
		// @ts-ignore
		this.rotarCodoDerecho(2,XfBipedUtil.bipedAngle(-14)); 
		// @ts-ignore
		this.rotarHombroDerecho(2,XfBipedUtil.bipedAngle(-14)); 	
		
		//this.rotarCodoIzquierdo(0, XfBipedUtil.bipedAngle(-30));
		//this.rotarCodoIzquierdo(1, XfBipedUtil.bipedAngle(-15));	 
		// @ts-ignore
		this.rotarCodoIzquierdo(2, XfBipedUtil.bipedAngle(14));	 
		// @ts-ignore
		this.rotarHombroIzquierdo(2,XfBipedUtil.bipedAngle(14));
		
		//this.girarBodySuperior(XfBipedUtil.bipedAngle(15));
		

	}//end function
		
	updateSkeleton(){
		// @ts-ignore
		for (var boneIdx=0;boneIdx<this.bipedBones.length;boneIdx++){
			// @ts-ignore
			this.bipedBones[boneIdx].update();
		}			
	}//end function
			
	// axis y
	girarBodySuperior(rotationAngle){
		//soon 0 -> head
		//soon 1 -> armupright
		//soon 2 -> armupleft
		let axis = 1;
		
		let bodySuperiorIndex = this.model.getObjectIndexById('bodyup');
		// @ts-ignore
		this.bipedBones[bodySuperiorIndex].rotate(axis,rotationAngle);
		
		let headIndex = this.model.getObjectIndexById('head');
		// @ts-ignore
		this.bipedBones[headIndex].movePivot(this.bipedBones[bodySuperiorIndex].childrensPosition[0]);
		// @ts-ignore
		this.bipedBones[headIndex].rotate(axis,rotationAngle);
		
		let armuprightIndex = this.model.getObjectIndexById('armupright');
		// @ts-ignore
		this.bipedBones[armuprightIndex].movePivot(this.bipedBones[bodySuperiorIndex].childrensPosition[1]);
		// @ts-ignore
		this.bipedBones[armuprightIndex].rotate(axis,rotationAngle);
		
		let armdownrightIndex = this.model.getObjectIndexById('armdownright');
		// @ts-ignore
		this.bipedBones[armdownrightIndex].movePivot(this.bipedBones[armuprightIndex].childrensPosition[0]);		
		// @ts-ignore
		this.bipedBones[armdownrightIndex].rotate(axis,rotationAngle);
		
		let armupleftIndex = this.model.getObjectIndexById('armupleft');
		// @ts-ignore
		this.bipedBones[armupleftIndex].movePivot(this.bipedBones[bodySuperiorIndex].childrensPosition[2]);
		// @ts-ignore
		this.bipedBones[armupleftIndex].rotate(axis,rotationAngle);
		
		let armdownleftIndex = this.model.getObjectIndexById('armdownleft');
		// @ts-ignore
		this.bipedBones[armdownleftIndex].movePivot(this.bipedBones[armupleftIndex].childrensPosition[0]);
		// @ts-ignore
		this.bipedBones[armdownleftIndex].rotate(axis,rotationAngle);
			
		this.updateWglBoneRotation(bodySuperiorIndex);
		
		this.updateWglBonePosition(headIndex);
		this.updateWglBoneRotation(headIndex);
		
		this.updateWglBonePosition(armuprightIndex);
		this.updateWglBoneRotation(armuprightIndex);
		
		this.updateWglBonePosition(armdownrightIndex);
		this.updateWglBoneRotation(armdownrightIndex);
		
		this.updateWglBonePosition(armupleftIndex);
		this.updateWglBoneRotation(armupleftIndex);
		
		this.updateWglBonePosition(armdownleftIndex);
		this.updateWglBoneRotation(armdownleftIndex);
		
	}//end function
					
	inclinarBodySuperior(axis,rotationAngle){
		//soon 0 -> head
		//soon 1 -> armupright
		//soon 2 -> armupleft
		
		let bodySuperiorIndex = this.model.getObjectIndexById('bodyup');
		// @ts-ignore
		this.bipedBones[bodySuperiorIndex].rotate(axis,rotationAngle);
		
		let headIndex = this.model.getObjectIndexById('head');
		// @ts-ignore
		this.bipedBones[headIndex].movePivot(this.bipedBones[bodySuperiorIndex].childrensPosition[0]);
		
		let armuprightIndex = this.model.getObjectIndexById('armupright');
		// @ts-ignore
		this.bipedBones[armuprightIndex].movePivot(this.bipedBones[bodySuperiorIndex].childrensPosition[1]);
		
		let armdownrightIndex = this.model.getObjectIndexById('armdownright');
		// @ts-ignore
		this.bipedBones[armdownrightIndex].movePivot(this.bipedBones[armuprightIndex].childrensPosition[0]);
	
		let armupleftIndex = this.model.getObjectIndexById('armupleft');
		// @ts-ignore
		this.bipedBones[armupleftIndex].movePivot(this.bipedBones[bodySuperiorIndex].childrensPosition[2]);
		
		let armdownleftIndex = this.model.getObjectIndexById('armdownleft');
		// @ts-ignore
		this.bipedBones[armdownleftIndex].movePivot(this.bipedBones[armupleftIndex].childrensPosition[0]);
				
		this.updateWglBoneRotation(bodySuperiorIndex);
		this.updateWglBonePosition(headIndex);
		this.updateWglBonePosition(armuprightIndex);
		this.updateWglBonePosition(armdownrightIndex);
	
		this.updateWglBonePosition(armupleftIndex);
		this.updateWglBonePosition(armdownleftIndex);
		
	}//end function
			
	rotarHombroDerecho(axis,rotationAngle){
		let hombroIndex = this.model.getObjectIndexById('armupright');
		// @ts-ignore
		this.bipedBones[hombroIndex].rotate(axis,rotationAngle);
		
		let codoIndex = this.model.getObjectIndexById('armdownright');
		// @ts-ignore
		this.bipedBones[codoIndex].movePivot(this.bipedBones[hombroIndex].childrensPosition[0]);
		
		this.updateWglBoneRotation(hombroIndex);
		this.updateWglBonePosition(codoIndex);
	}//end function
	
	rotarCodoDerecho(axis,rotationAngle){
		let codoIndex = this.model.getObjectIndexById('armdownright');
		// @ts-ignore
		this.bipedBones[codoIndex].rotate(axis,rotationAngle);		
		this.updateWglBoneRotation(codoIndex);
	}//end functio
			
	rotarHombroIzquierdo(axis,rotationAngle){
		let hombroIndex = this.model.getObjectIndexById('armupleft');
		// @ts-ignore
		this.bipedBones[hombroIndex].rotate(axis,rotationAngle);
		
		let codoIndex = this.model.getObjectIndexById('armdownleft');
		// @ts-ignore
		this.bipedBones[codoIndex].movePivot(this.bipedBones[hombroIndex].childrensPosition[0]);
	
		this.updateWglBoneRotation(hombroIndex);
		this.updateWglBonePosition(codoIndex);
	}//end function
	
	rotarCodoIzquierdo(axis,rotationAngle){
		let codoIndex = this.model.getObjectIndexById('armdownleft');
		// @ts-ignore
		this.bipedBones[codoIndex].rotate(axis,rotationAngle);	
		
		this.updateWglBoneRotation(codoIndex);
	}//end function
	
	updateWglBonePosition(boneIndex){
		// @ts-ignore
		this.wglBones[boneIndex].position.x = this.bipedBones[boneIndex].pivot.position[0];
		// @ts-ignore
		this.wglBones[boneIndex].position.y = this.bipedBones[boneIndex].pivot.position[1];
		// @ts-ignore
		this.wglBones[boneIndex].position.z = this.bipedBones[boneIndex].pivot.position[2];		
	}//end function
	
	updateWglBoneRotation(boneIndex){
		// @ts-ignore
		this.wglBones[boneIndex].rotation.x = this.bipedBones[boneIndex].pivot.rotation[0];
		// @ts-ignore
		this.wglBones[boneIndex].rotation.y = this.bipedBones[boneIndex].pivot.rotation[1];
		// @ts-ignore
		this.wglBones[boneIndex].rotation.z = this.bipedBones[boneIndex].pivot.rotation[2];		
	}//end function
		
	loadWglBone(THREE,scene,fbxLoader,loaderTextures,dataDirectory,objectModel,countObjects,objectIndex,listener) {	
		
		var textureMapPath 	= dataDirectory.concat(objectModel.mapFileName);
		var  objMaterial	 = new THREE.MeshPhongMaterial(); 
		objMaterial.map		= loaderTextures.load(textureMapPath);			
		objMaterial.bumpMap	= loaderTextures.load(textureMapPath);		
		//objMaterial.normalMap= loaderTextures.load(textureMapPath);
		
		var objThis =  this;			
		let fbxFileName = objectModel.id.concat('.fbx');	
	 	fbxLoader.load(
		  	dataDirectory.concat(fbxFileName),
		    (object) => {
		         object.traverse(function (child) {
		             if(child.isMesh) {
		                 child.material = objMaterial;
		                 child.material.transparent = false;
		            }
		        }) 
				object.position.x = objectModel.position[0];
				object.position.y = objectModel.position[1];
				object.position.z = objectModel.position[2];

				objThis.wglBones[objectIndex] = object;			
				scene.add(objThis.wglBones[objectIndex]);
				if(objectIndex == (countObjects-1)){
					listener.onAllBonesCharged();
				}
		    },
		    // @ts-ignore
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    // @ts-ignore
		    (error) => {
		        //console.log(error);
		    }
		)
		
	}//end function

	/*
		//piernas
		//this.rotarMusloDerecho(0,XfBipedUtil.bipedAngle(345));
		//this.rotarRodillaDerecha(0,XFXfBipedUtil_Math.bipedAngle(30));
		//this.rotarMusloDerecho(2,XfBipedUtil.bipedAngle(345));		
		//this.rotarMusloIzquierdo(0,XfBipedUtil.bipedAngle(345));
		//this.rotarRodillaIzquierda(0,XfBipedUtil.bipedAngle(30));
		//this.rotarMusloIzquierdo(2,XfBipedUtil.bipedAngle(15));
		//console.log('executeAnimation end');	
	rotarMusloDerecho(axis,rotationAngle){
			
		let leguprightIndex = this.model.getObjectIndexById('legupright');
		this.bipedBones[leguprightIndex].rotate(axis,rotationAngle);
		
		let legdownrightIndex = this.model.getObjectIndexById('legdownright');
		this.bipedBones[legdownrightIndex].movePivot(this.bipedBones[leguprightIndex].childrensPosition[0]);
		if(axis==2){
			//this.bipedBones[legdownrightIndex].rotate(axis,rotationAngle);
		}
		
		let footrightIndex = this.model.getObjectIndexById('footright');
		this.bipedBones[footrightIndex].movePivot(this.bipedBones[legdownrightIndex].childrensPosition[0]);
		if(axis==2){
			//this.bipedBones[footrightIndex].rotate(axis,rotationAngle);
		}		
		
		this.updateWglBoneRotation(leguprightIndex);
		this.updateWglBonePosition(legdownrightIndex);
		//this.updateWglBoneRotation(legdownrightIndex);
		this.updateWglBonePosition(footrightIndex);
		//this.updateWglBoneRotation(footrightIndex);
		
	}//end function
	
	//pensado para axis X only
	rotarRodillaDerecha(axis,rotationAngle){
		let legdownrightIndex = this.model.getObjectIndexById('legdownright');
		this.bipedBones[legdownrightIndex].rotate(axis,rotationAngle);
		
		let footrightIndex = this.model.getObjectIndexById('footright');
		this.bipedBones[footrightIndex].movePivot(this.bipedBones[legdownrightIndex].childrensPosition[0]);
		
		this.updateWglBoneRotation(legdownrightIndex);
		this.updateWglBonePosition(footrightIndex);
		
	}//end function
		
	rotarMusloIzquierdo(axis,rotationAngle){
			
		let legupleftIndex = this.model.getObjectIndexById('legupleft');
		this.bipedBones[legupleftIndex].rotate(axis,rotationAngle);
		
		let legdowleftIndex = this.model.getObjectIndexById('legdowleft');
		this.bipedBones[legdowleftIndex].movePivot(this.bipedBones[legupleftIndex].childrensPosition[0]);
		if(axis==2){
			//this.bipedBones[legdowleftIndex].rotate(axis,rotationAngle);
		}
		
		let footleftIndex = this.model.getObjectIndexById('footleft');
		this.bipedBones[footleftIndex].movePivot(this.bipedBones[legdowleftIndex].childrensPosition[0]);
		if(axis==2){
			//this.bipedBones[footrightIndex].rotate(axis,rotationAngle);
		}		
		
		this.updateWglBoneRotation(legupleftIndex);
		this.updateWglBonePosition(legdowleftIndex);
		this.updateWglBonePosition(footleftIndex);
		//this.updateWglBoneRotation(footleftIndex);
		
	}//end function
	
	//pensado para axis X only
	rotarRodillaIzquierda(axis,rotationAngle){
		
		let legdowleftIndex = this.model.getObjectIndexById('legdowleft');
		this.bipedBones[legdowleft].rotate(axis,rotationAngle);
		
		let footleftIndex = this.model.getObjectIndexById('footleft');
		this.bipedBones[footleftIndex].movePivot(this.bipedBones[legdowleftIndex].childrensPosition[0]);
		
		this.updateWglBoneRotation(legdowleftIndex);
		this.updateWglBonePosition(footleftIndex);
		
	}//end function
	*/
	
	/*
				//object.position.x= bones[objectIndex].wglLine.geometry.attributes.position.array[3];
				//object.position.y= bones[objectIndex].wglLine.geometry.attributes.position.array[4];
				//object.position.z= bones[objectIndex].wglLine.geometry.attributes.position.array[5];	
	*/

}//end class