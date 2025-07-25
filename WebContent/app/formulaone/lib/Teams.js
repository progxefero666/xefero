/**
 * class Teams
 */
class TeamsControl{
	
	static DATA_PATH = 'gamecar/championship/teams.json'
	
	constructor(){
		let jsonTeams =  WebGL_util.readJSonObject(TeamsControl.DATA_PATH);
	};
	
}//end class

/**
 * class Teams
 */
class Team{        
       
	//constructor	
	constructor(name,member1, member2) {
		this.name = name;
		this.member1 = member1;
		this.member2 = member2;
	}
		
}//end class

class Driver{        
       
	//constructor	
	constructor(name) {
		this.name = name;
	}
		
}//end class