/**
 * class XF_Veztor
 */
class  XF_Veztor {        
    
	constructor(elements) {//[]
		this.elements = elements;
		
	}//end constructor
	
	constructorB (elem_axis_0,elem_axis_1,elem_axis_2){
		this.elements = [elem_axis_0,elem_axis_1,elem_axis_2];		
	}//end
	
	
	getCoord4(){		
		return [this.elements[0],this.elements[1],this.elements[2],1.0];		
	}//end

	getClone(){		
		return new XF_Veztor([this.elements[0],this.elements[1],	this.elements[2]]);
	}//end
	
	multiplyByScalar(factorMult){
		for(var axisIndex=0;axisIndex<this.elements.length;axisIndex++){
			this.elements[axisIndex] *= factorMult;
		}							
	}//end
	
	translate(vectorR_b){ //XF_Veztor
		var values= [];// [vectorR_b.elements.length];
		for(var axisIndex=0;axisIndex<vectorR_b.elements.length;axisIndex++){
			values[axisIndex] = this.elements[axisIndex] + vectorR_b.elements[axisIndex];
		}
		this.elements = values;
	}//end
	
	translate_neg(vectorR_b){ //XF_Veztor
		var values= [];// [vectorR_b.elements.length];
		for(var axisIndex=0;axisIndex<vectorR_b.elements.length;axisIndex++){
			values[axisIndex] = this.elements[axisIndex] - vectorR_b.elements[axisIndex];
		}
		this.elements = values;		
	}//end
	
	//..............................dot.........................................
	// Returns the scalar product of the vector with the argument
	// Both vectors must have equal dimensionality
    // dot product is equal to inner product 
	dot(vectorDot){ //XF_Veztor				
		var V 		 = vectorDot.elements;
		var num_elements = this.elements.length;
		
	    if (num_elements != V.length) { 
	    	return 0.0; 
	    }
	    
	    var valueReturn = 0.0;
	    var valueInc	= 0.0;
	    do {
	    	valueInc = this.elements[num_elements-1] * V[num_elements-1];
	    	valueReturn = valueReturn + valueInc;
	    	num_elements--;
	    } while(num_elements>0);
	    
		return valueReturn;		
	}//end
	
	// modulus
	modulus(){
		var dotValue 		= this.dot(this);
		var modulusValue	=  Math.sqrt(dotValue);
		return modulusValue;
	}//end

	toUnitVector(){
		var mod = this.modulus();
		var values= [];
		for(var axisIndex=0;axisIndex<this.elements.length;axisIndex++){
			values[axisIndex] = this.elements[axisIndex] / mod;
		}
		this.elements = values;	
	}//end


	// static methods...........................................................
	static zero(numElements){
		var els = [];
		for(var idxElem =0 ;idxElem<numElements;idxElem++){
			els[idxElem] = 0.0;
		}
		return new XF_Veztor(els);
	}//end
	
	static create(vec){
		var els = [];
		for(var idxElem =0 ;idxElem<3;idxElem++){
			els[idxElem] = vec.elements[idxElem];
		}
		return new XF_Veztor(els);
	}//end
	
	static dot(vector_a,vector_b){		
		var value_coord;
		var dot_return = 0.0; 		
		for(var elem_index=0;elem_index<3;elem_index++){
			value_coord = vector_a.elements[elem_index] * vector_b.elements[elem_index];
			dot_return = dot_return + value_coord;
		}		
		return dot_return;
	}//end
	
	static getVectorInverse(vector){
		var vectorReturn = vector.getClone();	
		for(var elemIndex=0;elemIndex<vectorReturn.elements.length;elemIndex++){			
			vectorReturn.elements[elemIndex] = vectorReturn.elements[elemIndex] * (-1.0); 
		}		
		return vectorReturn;		
	}//end
	
}//end class