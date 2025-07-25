/**
 * SistemaSolar3D
 */

  class  SistemaSolar3D {        
	
	//constructor	
	//..........................................................................
	constructor(dataDirectory) {
		this.dataDirectory = dataDirectory;
		this.position = [0,0,0];
		this.sunExtRadius = 10;
		this.systemRadius = 500;
		this.planetsDistance = 5;
				
		this.generarPlanetas();
	}//end constructor
	
	generarPlanetas() {				


		this.sol = new Sol3D(
			this,
			'sol.fbx',
			[0,0,0],4.0,
			'sol.jpg',null,null);


		let distances = [];
		let distCalc = this.sunExtRadius;		
		for(let i =0;i<9;i++){
			distances[i] = distCalc;
			distCalc+= this.planetsDistance;
		}
		
		this.planetas = [];
		
		//mercurio
		this.planetas[0] = new Planeta3D(this,
			'mercurio.fbx',0.39,[1,1,1],distances[0],
			88,58.666,
			'planeta.jpg',null,null);
			
			
		//venus
		this.planetas[1] = new Planeta3D(this,
			'venus.fbx',0.95,[1,1,1],distances[1],
			225,243,
			'planeta.jpg',null,null);
			
		
		//tierra
		this.planetas[2] = new Planeta3D(this,
			'tierra.fbx',1.0,[1,1,1],distances[2],
			365,1,
			'tierra.jpg',null,null);


		//marte
		this.planetas[3] = new Planeta3D(this,
			'marte.fbx',0.53,[1,1,1],distances[3],
			687,1.03,
			'planeta.jpg',null,null);

	/*
		//jupiter
		this.planetas[4] = new Planeta3D(this,
			'jupiter.fbx',11.2,[1,1,1],distances[4],
			4.335,0.414,
			'jupiter.jpg',null,null);

		//saturno
		this.planetas[5] = new Planeta3D(this,
			'saturno.fbx',9.41,[1,1,1],distances[5],
			10.760,0.426,
			'saturno.jpg',null,null);

		//urano
		this.planetas[6] = new Planeta3D(this,
			'urano.fbx',3.98,[1,1,1],distances[6],
			30.790,0.718,
			'urano.jpg',null,null);

		//neptuno
		this.planetas[7] = new Planeta3D(this,
			'neptuno.fbx',3.81,[1,1,1],distances[7],
			60.193,0.6745,
			'neptuno.jpg',null,null);

		//pluton
		this.planetas[8] = new Planeta3D(this,
			'pluton.fbx',0.02,[1,1,1],distances[8],
			90.217,6.39,
			'pluton.jpg',null,null);		
		*/
	}//end function

	loadInScene(THREE,scene,fbxLoader,loaderTextures,context) {
		//this.sol.loadInScene(THREE,scene,fbxLoader,loaderTextures);
		
		for(let i =0;i<this.planetas.length;i++){
			this.planetas[i].loadInScene(THREE,scene,fbxLoader,loaderTextures,context) ;
		}
	}//end function

	dinamic() {
		for(let i =0;i<this.planetas.length;i++){
			this.planetas[i].dinamic() ;
		}
	}//end function
				
}//end class	


