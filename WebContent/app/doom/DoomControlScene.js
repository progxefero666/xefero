
/**
 * class DoomPlayer(app,wglPlayer)
 */
class DoomControlScene {        
       
          
	//constructor	
	constructor(app,floorDtos,sceneDtos) {			
		this.app = app;
		this.floorDtos = floorDtos;
		this.sceneDtos = sceneDtos;
		console.log(this.sceneDtos.length);		
	}//end constructor
	
	getFloorHeightAtPosition3d(THREE,point3d){

		let origin	= new THREE.Vector3(point3d[0],point3d[1]+1,point3d[2]);
		let direction = new THREE.Vector3(0,-1,0);	
		let raycaster = new THREE.Raycaster();
		raycaster.set(origin,direction);				
		let intersects = raycaster.intersectObjects(this.floorDtos);
		let heightResult = 0;
		if(intersects.length>0){
			heightResult= intersects[0].point.y;	
			//console.log('instersect ok');			
		}	
		else {
			//console.log('instersect failed');
		}	
		return heightResult;						
	}//end function
	
	processElementsCollisions(THREE,player){
		
		if(player.moveForward || player.moveBackward){
			if(player.moveForward){				
				let existCollFrontLeft = false;
				let existCollFrontRight = false;				
				let existCollFront = this.existElementCollisionsPoint(THREE,player,0,1.0);
				if(!existCollFront){
					existCollFrontLeft = this.existElementCollisionsPoint(THREE,player,7,0.5);
					if(!existCollFrontLeft){
						existCollFrontRight = this.existElementCollisionsPoint(THREE,player,1,0.5);
					}						
				}								
				if(existCollFront || existCollFrontLeft || existCollFrontRight ){
					if(player.state == "walking"){
						console.log('coll front')
						//player.moveZeroFB();
						player.velocity = 0;
					}					
				}
				else{
					player.velocity = DoomPlayerConfig.WALK_VELOCITY;
				}
			}
			else {			
				let existCollBack = this.existElementCollisionsPoint(THREE,player,2,player.boundRadius);
				if(existCollBack){
					if(player.state == "walking"){
						console.log('coll back')
						player.moveZeroFB();
					}					
				}					
			}
		}
		else {
			
		}	
	}//end function
	
	existElementCollisionsPoint(THREE,player,pointIndex,distanceMax){
		
		let origin	= new THREE.Vector3(player.position[0],
										player.position[1]+player.boundsCenterY,
										player.position[2]);		 
		
		let camera	= new THREE.PerspectiveCamera(35, 1, 0.0001, 10000);			
		camera.position.x = player.position[0];
		camera.position.y = player.position[1]+player.boundsCenterY;
		camera.position.z = player.position[2];
			
		let view =  new THREE.Vector3(player.boundsCoords[pointIndex][0],
									  player.boundsCoords[pointIndex][1],  
									  player.boundsCoords[pointIndex][2]);	
		camera.lookAt(view);
		let cameraVector = new THREE.Vector3(); 
		camera.getWorldDirection(cameraVector);	
		let existCollision = false;
		let raycaster = new THREE.Raycaster();	
		raycaster.set(origin,cameraVector);	
		raycaster.far = 20;
		let intersects = raycaster.intersectObjects(this.sceneDtos);	
			
		if(intersects.length>0){			
			if(intersects[0].distance<distanceMax){
				console.log('exist collision');
				existCollision = true;
			}
		}			
		return existCollision;													  				
	}//end function
	
	getCollisionsDistance(THREE,player,pointIndex){
		
	}//end function
		
}//end class