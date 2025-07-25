/**
 * class GameTerrain
 */
class  GameTerrain{        
    
	constructor(){
		this.postConstructor();
	}//end constructor
	
	postConstructor(){
		let path = 	'./data/doom/terrain/terrainvertex.json';
		let jsonObj =  readJSonObject(path);	
		let arrayVertex = jsonObj.vertices;
		this.polys = XfMeshUtil.getMeshPolys3d(arrayVertex);
		
	}//end function

	isPointIntoTerrain(pointCoord3d){
		let terrainPolyIndex = this.getFaceIndexInPosition3d(pointCoord3d);	
		if(terrainPolyIndex>=0){
			return true;
		}
		return false;
	}//end function
		
	getFaceIndexInPosition3d(point3d){
		let indexReturn = -1;
		let testPoint 	=  [point3d[0],point3d[2]];
				
		for(let polyIndex=0;polyIndex<this.polys.length;polyIndex++){
			let insideBoxPoly2d = this.polys[polyIndex].poly2d.isPointIntoBoundingBox(testPoint);
			if(insideBoxPoly2d){
				let insideTriangle = this.polys[polyIndex].poly2d.isPointIntoTriangle(testPoint);
				if(insideTriangle){
					indexReturn = polyIndex;
					//console.log('insideTriangle');
					break;
				}
				else{
					//console.log('outsideTriangle');
				}
			}
			else {
				//console.log('outside Box Poly2d');
			}
		}		
		return indexReturn;
	}//end function
	
	getFaceCenterInPosition3d(point3d){
		let polyIndex = this.getFaceIndexInPosition3d(point3d);
		if(polyIndex<0){
			return null;
		}
		return this.polys[polyIndex].center;		
	}//end function	
	
  		
}//end class