/**
 * class XfPoly2d
 */

 class  XfPoly2d {        
	
	//constructor	
	//..........................................................................
	constructor(points) { //[3][3]
		this.points = points;	
		this.postConstructor();	
	}//end constructor	
	
	postConstructor(){
    	this.minX = 10000;
    	this.maxX = -10000;
    	this.minY = 10000;
    	this.maxY = -10000;    	
     	for(let ptIndex = 0;ptIndex< this.points.length;ptIndex++){
			 
			if(this.points[ptIndex][0]<this.minX){
				this.minX = this.points[ptIndex][0];
			}
			if(this.points[ptIndex][0]>this.maxX){
				this.maxX = this.points[ptIndex][0];
			}	
			if(this.points[ptIndex][1]<this.minY){
				this.minY = this.points[ptIndex][1];
			}
			if(this.points[ptIndex][1]>this.maxY){
				this.maxY = this.points[ptIndex][1];
			}						
		}
	}//end function
	
	isPointIntoBoundingBox(point2d){
		if(point2d[0]<this.minX){return false;}
		if(point2d[0]>this.maxX){return false;}
		if(point2d[1]<this.minY){return false;}
		if(point2d[1]>this.maxY){return false;}
		return true;
	}//end function
	
	
	isPointIntoTriangle(point2d){
		//let intoBox = this.isPointIntoBoundingBox(point2d);
		//if(!intoBox){return false;}
		
		let inside = false;
		
		let j = this.points.length-1;
		for ( let i = 0; i < this.points.length; j = i++ ){
			 if ( ( this.points[ i ][1] > point2d[1] ) != ( this.points[j][1] > point2d[1] ) && 
			 	   point2d[0] < ( this.points[j][0] - this.points[i][0] ) * ( point2d[1] - this.points[i][1] )
			 	    / ( this.points[j][1] - this.points[i][1] ) + this.points[i][0] )
             {
				 inside = !inside;
			 }
		}
		  
		return inside;
	}//end function
	
	/*
 IsPointInPolygon( Point p, Point[] polygon )

    for ( int i = 0, j = polygon.Length - 1 ; i < polygon.Length ; j = i++ )
    {
        if ( ( polygon[ i ].Y > p.Y ) != ( polygon[ j ].Y > p.Y ) &&
             p.X < ( polygon[ j ].X - polygon[ i ].X ) * ( p.Y - polygon[ i ].Y ) / ( polygon[ j ].Y - polygon[ i ].Y ) + polygon[ i ].X )
        {
            
        }
    }
	*/
		
}//end class