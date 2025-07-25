/**
 *  class WebGLObject_fireContact.(scene,position,size)
 */
 class  WebGLObject_fireContact {        
	
	//constructor	
	//..........................................................................
	constructor(parent,scene,position,size) {
		this.parent = parent;
		this.scene 	  = scene;
		this.position = position;	
		this.size     = size;		
		this.active	  = true;
		this.configure();		
	}//end constructor

	configure(){
		this.countGroups = 3;
		this.groupIndex = 0;
		this.intervalLiveFrame = 5;
		this.indexLiveFrame = -1;
		this.countLiveFrames = 30;		
		this.countGroupItems = 20;	
		this.countRemoveInAction = 8;
		this.frameIndex = -1;	
		this.countLiveItems = this.countGroups * this.countGroupItems;
		this.lines = [];
		this.lineIndex = 0;
	}//end function
	
	generate(THREE){
		let spheresCountSides = 16;
		let radioInt = 0.2;
		let radioExt = 15; //
	
		let sphereIntVertex = XF_Math3dUtil.getSphereAllVertex(this.position,radioInt,spheresCountSides);
		let sphereExtVertex = XF_Math3dUtil.getSphereAllVertex(this.position,radioExt,spheresCountSides);
		
		let intCoord = [];
		let extCoord = [];
		
		for(let idx=0;idx<this.countGroupItems;idx++){
			let aleatValueI = XF_Math.getAleatoryValue(sphereIntVertex.length)-1;
			intCoord[idx] = sphereIntVertex[aleatValueI];	
			extCoord[idx] = sphereExtVertex[aleatValueI];						
		}//end for	
			
		let material = new THREE.LineBasicMaterial({
			color: 0xff0000
		});
		for(let idx=0;idx<this.countGroupItems;idx++){
			if( (intCoord[idx]!=null) && (extCoord[idx]!=null) ){
				let pointStart = new THREE.Vector3(intCoord[idx][0],intCoord[idx][1],intCoord[idx][2]);
				let pointEnd = new THREE.Vector3(extCoord[idx][0],extCoord[idx][1],extCoord[idx][2]);
				let points = [];
				points.push(pointStart);
				points.push(pointEnd);
				let geometry = new THREE.BufferGeometry().setFromPoints(points);
				this.lines[this.lineIndex] = new THREE.Line(geometry,material);
				this.scene.add(this.lines[this.lineIndex]);	
				this.lineIndex++;								
			}
		}//end for		
		
	}//end function
	
	destroy(THREE){		
		for(let idx=0;idx<this.countRemoveInAction;idx++){
			this.scene.remove(this.lines[0]);
			this.lines.shift();
			this.countLiveItems= this.countLiveItems -1;			
		}
	}//end function
	
	dinamic(THREE){
		this.frameIndex++;
		if(this.frameIndex<this.countLiveFrames){
			if(this.groupIndex<(this.countGroups-1)){
				this.indexLiveFrame++;
				if(this.indexLiveFrame<this.intervalLiveFrame){
					if(this.indexLiveFrame==0){
						this.generate(THREE);
					}
				}
				else{
					this.indexLiveFrame = -1;
					this.groupIndex++;
				}				
			}
		}
		else {
			if(this.countLiveItems>0){
				this.destroy(THREE);
			}
			else {
				this.active	  = false;
				this.parent.onFireContactFinish();
			}			
		}
	}//end function
	
}//end class