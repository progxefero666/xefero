/**
 * class HousePlayer
 */
class HousePlayer{
		
    //constructor	
	constructor(app,viewH) {	
		this.app   = app;
		this.viewH = viewH;
		this.init(this.app.app_THREE);
	}//end constructor

	init(THREE){
		this.position = [0,0,0];
		this.moveForward 	= false;
		this.moveBackward 	= false;
		this.moveLeft 		= false;
		this.moveRight 		= false;		
		this.velocity 		= new THREE.Vector3();
		this.direction 		= new THREE.Vector3();
	}//end function
	
	dinamic(delta){
		this.velocity.x -= this.velocity.x * 10.0 * delta;
		this.velocity.z -= this.velocity.z * 10.0 * delta;
		//this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
		this.velocity.y = 0;
				
		this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
		this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
		this.direction.normalize(); // thisAppHouseWgl ensures consistent movements in all directions
					
		if ( this.moveForward || this.moveBackward ) {
			this.velocity.z -= this.direction.z * HouseManager.PLAYER_VELOCITYFACTOR * delta;
		}	
		if ( this.moveLeft || this.moveRight ) {
			this.velocity.x -= this.direction.x * HouseManager.PLAYER_VELOCITYFACTOR * delta;
		}		
	}//end function
	
	setPosition(vector3){
		this.position[0] = vector3.x;
		this.position[1] = vector3.y - this.viewH;
		this.position[2] = vector3.z;

	}//end function
	
}//end  class