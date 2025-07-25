/**
 * class XfBipedBone
 */

 class  XfBipedBone {        
	
	//constructor	
	//..........................................................................
	constructor(biped,parentId,id,position,childrens) {
		this.biped = biped;
		this.parentId 	  	= parentId;
		this.id 	  		= id;
		this.position 	  	= position;
		// @ts-ignore
		this.pivot 			= new XF_Pivot();
		this.pivot.movePivot(this.position);
		this.childrens 		= childrens;
	}//end constructor

	init(){
		this.childrensPosition 		= [];
		if(this.childrens!=null){
			for (var soonIdx=0;soonIdx<this.childrens.length;soonIdx++){
				this.childrensPosition[soonIdx]=this.biped.bipedBones[this.childrens[soonIdx]].position;
			}
		}
	}
	
	update(){
		for (var soonIdx=0;soonIdx<this.childrens.length;soonIdx++){
			// @ts-ignore
			this.childrensPosition[soonIdx]=this.biped.bipedBones[this.childrens[soonIdx]].position;
		}
	}//end function
	
	rotate(axisIndex,rotation_angle){	
		if(this.childrens!=null){
			if(axisIndex==0){
				for (var soonIdx=0;soonIdx<this.childrens.length;soonIdx++){
					// @ts-ignore
					this.pivot.rotateVertex([rotation_angle,0.0,0.0],this.childrensPosition[soonIdx]);
				}				
			}
			if(axisIndex==1){
				for (var soonIdx=0;soonIdx<this.childrens.length;soonIdx++){
					// @ts-ignore
					this.pivot.rotateVertex([0.0,rotation_angle,0.0],this.childrensPosition[soonIdx]);
				}				
			}
			if(axisIndex==2){
				for (var soonIdx=0;soonIdx<this.childrens.length;soonIdx++){
					// @ts-ignore
					this.pivot.rotateVertex([0.0,0.0,rotation_angle],this.childrensPosition[soonIdx]);
				}				
			}						
		}
		this.pivot.rotatePivot(axisIndex,rotation_angle);
	}//end function
			
	movePivot(newPosition) {//[]
	
		// @ts-ignore
		let trans3d = XF_Math3dUtil.getTranslation3d(this.pivot.position,newPosition);
	
		this.pivot.movePivot(newPosition);
		
		if(this.childrens!=null){
			for (var soonIdx=0;soonIdx<this.childrens.length;soonIdx++){
				// @ts-ignore
				XF_Geolocator.translateVertex3d(this.childrensPosition[soonIdx],trans3d )
			}
		}
		
	}//end function
	
	/*
	rotatePivot(rotation_axis,rotation_angle){
		this.pivot.rotatePivot(rotation_axis,rotation_angle);
	}//end function
	*/
	/*
	init(THREE){
		//create wglLine
		//.............................................................
		let pointStart = new THREE.Vector3( 
			this.parentPosition[0], 
			this.parentPosition[1],
			this.parentPosition[2]
		);
		let pointEnd = new THREE.Vector3( 
			this.position[0], 
			this.position[1],
			this.position[2]
		);		
		const points = [];
		points.push(pointStart);
		points.push(pointEnd);
		
		const geometry = new THREE.BufferGeometry().setFromPoints( points );
		const material = new THREE.LineBasicMaterial({color: 0xff0000});
		geometry.attributes.position.needsUpdate = true;
		this.wglLine =  new THREE.Line( geometry, material );
	}//end function
	*/		
}//end clas	