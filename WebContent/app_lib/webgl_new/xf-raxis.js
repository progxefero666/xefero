/**
 * class XF_RAxis.getAxisRotation
 */
class  XF_RAxis {        
    
	constructor(axis_vertex_0,axis_vertex_1) {//[],[]
		this.axis_vertex_0 = axis_vertex_0;			
		this.axis_vertex_1 = axis_vertex_1;			
		
		// axis rotation vectors
		this.rot_vector_axis_0 = null;
		this.rot_vector_axis_1 = null;
		this.rot_vector_axis_2 = null;
		this.rot_vector_d1 = null;
		this.rot_vector_d2 = null;
		
		//Vectors
		this.vectorDirecction =null;
		this.vectorPosition =null;
		
		this.update();
		
	}//end constructor

	
	move_3d(translation){ //[]
		XF_Geolocator.translateVertex3d(this.axis_vertex_0,translation);
		XF_Geolocator.translateVertex3d(this.axis_vertex_1,translation);
		this.update();
	}//end
	
	update() {  
		var translation = XF_Math3dUtil.getTranslation3d(this.axis_vertex_0,this.axis_vertex_1);		

		// int direction and position vectors
		//......................................................................
		this.vectorPosition   = new XF_Veztor(XF_Math3dUtil.getCloneOfArray(this.axis_vertex_0));		
		this.vectorDirecction = XF_Math3dUtil.getVectorUnit(new XF_Veztor(translation));		
		
		//......................................................................
		// init basic rotation vectors
		//......................................................................
		this.rot_vector_axis_0 = this.axis_vertex_1[0] - 
								 this.axis_vertex_0[0];		
		
		this.rot_vector_axis_1 = this.axis_vertex_1[1] - 
								 this.axis_vertex_0[1];
		
		this.rot_vector_axis_2 = this.axis_vertex_1[2] - 
								 this.axis_vertex_0[2];	
		
		//......................................................................
		// 						!!! MUY IMPORTANTE !!!
		// Hay que comprobar que ninguno de los valores de los vectores base es
		// exactamente cero porque si no la matriz resultado de las 
		// transformaciones podria tener valor cero en una de las coordenadas
		//......................................................................
		
		if(this.rot_vector_axis_0==0.0) {
			this.rot_vector_axis_0=AXIS_CORRECTION_VECTOR_MIN_VALUE;
		}

		if(this.rot_vector_axis_1==0.0) {
			this.rot_vector_axis_1=AXIS_CORRECTION_VECTOR_MIN_VALUE;
		}

		if(this.rot_vector_axis_2==0.0) {
			this.rot_vector_axis_2=AXIS_CORRECTION_VECTOR_MIN_VALUE;
		}

		//......................................................................
		// una vez realizado los chequeos apropiados y ajustes necesarios se 
		// continua calculando los 2 ultimos vectoes de calculo d1 y d2
		//......................................................................		
		var value_base_d1 = (this.rot_vector_axis_1 * this.rot_vector_axis_1) + 
						 (this.rot_vector_axis_2 * this.rot_vector_axis_2);
		this.rot_vector_d1 = Math.sqrt(value_base_d1);

		var value_base_d2 = (this.rot_vector_axis_0 * this.rot_vector_axis_0) + (this.rot_vector_d1*this.rot_vector_d1);
		this.rot_vector_d2 = Math.sqrt(value_base_d2);
	}//end 

	
	getmx_rot_axis_traslation_to_center() {
		var m_elem = []; //[4][4]
		m_elem[0]= [];
		m_elem[1]= [];
		m_elem[2]= [];
		m_elem[3]= [];
		
		m_elem[0][0]=1.0;	m_elem[0][1]=0.0;	m_elem[0][2]=0.0;	m_elem[0][3]=0.0;		
		m_elem[1][0]=0.0; 	m_elem[1][1]=1.0;	m_elem[1][2]=0.0;	m_elem[1][3]=0.0;		
		m_elem[2][0]=0.0; 	m_elem[2][1]=0.0;	m_elem[2][2]=1.0;	m_elem[2][3]=0.0;		
		
		m_elem[3][0]=this.axis_vertex_0[0] * (-1.0); 	
		m_elem[3][1]=this.axis_vertex_0[1] * (-1.0);	
		m_elem[3][2]=this.axis_vertex_0[2] * (-1.0);	
		m_elem[3][3]=1.0;
		return new XF_Matrix4x4(m_elem);	
	}//end
	
	getmx_rot_axis_traslation_to_pivot() {//return XF_Matrix4x4
		var m_elem = []; //[4][4]	
		m_elem[0]= [];
		m_elem[1]= [];
		m_elem[2]= [];
		m_elem[3]= [];
		
		m_elem[0][0]=1.0;	m_elem[0][1]=0.0;	m_elem[0][2]=0.0;	m_elem[0][3]=0.0;		
		m_elem[1][0]=0.0; 	m_elem[1][1]=1.0;	m_elem[1][2]=0.0;	m_elem[1][3]=0.0;		
		m_elem[2][0]=0.0; 	m_elem[2][1]=0.0;	m_elem[2][2]=1.0;	m_elem[2][3]=0.0;	
		
		m_elem[3][0]=this.axis_vertex_0[0]; 	
		m_elem[3][1]=this.axis_vertex_0[1];	
		m_elem[3][2]=this.axis_vertex_0[2];	
		m_elem[3][3]=1.0;
		return new XF_Matrix4x4(m_elem);
	}//end
	

	
	getRotationMatrix(rotation_angle){//return XF_Matrix4x4	
		//----------------------------------------------------------------------
		// STEP - ROTATION AXIS 0
		//----------------------------------------------------------------------				
		var mm_rot_0_step2 = []; //[][]
		mm_rot_0_step2[0] = [];
		mm_rot_0_step2[0][0]=1.0; 
		mm_rot_0_step2[0][1]=0.0;
		mm_rot_0_step2[0][2]=0.0;
		mm_rot_0_step2[0][3]=0.0;

		mm_rot_0_step2[1] = [];
		mm_rot_0_step2[1][0]=0.0; 
		mm_rot_0_step2[1][1]= (this.rot_vector_axis_2/this.rot_vector_d1);		
		mm_rot_0_step2[1][2]= (this.rot_vector_axis_1/this.rot_vector_d1);	
		mm_rot_0_step2[1][3]=0.0;
		
		mm_rot_0_step2[2] = [];
		mm_rot_0_step2[2][0]=0.0; 
		mm_rot_0_step2[2][1]=(-1.0) * (this.rot_vector_axis_1/this.rot_vector_d1);	
		mm_rot_0_step2[2][2]= (this.rot_vector_axis_2/this.rot_vector_d1);	
		mm_rot_0_step2[2][3]=0.0;
		
		mm_rot_0_step2[3] = [];
		mm_rot_0_step2[3][0]=0.0; 
		mm_rot_0_step2[3][1]=0.0;
		mm_rot_0_step2[3][2]=0.0;
		mm_rot_0_step2[3][3]=1.0;				
		//----------------------------------------------------------------------
		
		//----------------------------------------------------------------------
		// STEP - ROTATION AXIS 0 INVERSE
		//----------------------------------------------------------------------		
		var mm_rot_axis_0_inverse_step6 = []; //[][]		
		
		mm_rot_axis_0_inverse_step6[0]=[]; 
		mm_rot_axis_0_inverse_step6[0][0]=1.0; 
		mm_rot_axis_0_inverse_step6[0][1]=0.0;
		mm_rot_axis_0_inverse_step6[0][2]=0.0;
		mm_rot_axis_0_inverse_step6[0][3]=0.0;
		
		mm_rot_axis_0_inverse_step6[1]=[]; 
		mm_rot_axis_0_inverse_step6[1][0]=0.0; 
		mm_rot_axis_0_inverse_step6[1][1]= (this.rot_vector_axis_2/this.rot_vector_d1);		
		mm_rot_axis_0_inverse_step6[1][2]= (-1.0) * (this.rot_vector_axis_1/this.rot_vector_d1);	
		mm_rot_axis_0_inverse_step6[1][3]=0.0;
		
		mm_rot_axis_0_inverse_step6[2]=[]; 
		mm_rot_axis_0_inverse_step6[2][0]=0.0; 
		mm_rot_axis_0_inverse_step6[2][1]= (this.rot_vector_axis_1/this.rot_vector_d1);
		mm_rot_axis_0_inverse_step6[2][2]= (this.rot_vector_axis_2/this.rot_vector_d1);	
		mm_rot_axis_0_inverse_step6[2][3]=0.0;
		
		mm_rot_axis_0_inverse_step6[3]=[]; 
		mm_rot_axis_0_inverse_step6[3][0]=0.0; 
		mm_rot_axis_0_inverse_step6[3][1]=0.0;
		mm_rot_axis_0_inverse_step6[3][2]=0.0;
		mm_rot_axis_0_inverse_step6[3][3]=1.0;							
		//----------------------------------------------------------------------
		
		//----------------------------------------------------------------------
		// STEP - ROTATION AXIS 1
		//----------------------------------------------------------------------						
		var mm_rot_axis_1_step3 = []; //[][]	
		
		mm_rot_axis_1_step3[0]=[]; 
		mm_rot_axis_1_step3[0][0]= (this.rot_vector_d1/this.rot_vector_d2);
		mm_rot_axis_1_step3[0][1]= 0.0;
		mm_rot_axis_1_step3[0][2]= (this.rot_vector_axis_0/this.rot_vector_d2);
		mm_rot_axis_1_step3[0][3]= 0.0;
		
		mm_rot_axis_1_step3[1]=[];
		mm_rot_axis_1_step3[1][0]= 0.0;
		mm_rot_axis_1_step3[1][1]= 1.0;
		mm_rot_axis_1_step3[1][2]= 0.0;
		mm_rot_axis_1_step3[1][3]= 0.0;		
		
		mm_rot_axis_1_step3[2]=[];
		mm_rot_axis_1_step3[2][0]= (-1.0) * (this.rot_vector_axis_0/this.rot_vector_d2);
		mm_rot_axis_1_step3[2][1]= 0.0;
		mm_rot_axis_1_step3[2][2]= (this.rot_vector_d1/this.rot_vector_d2);
		mm_rot_axis_1_step3[2][3]= 0.0;
		
		mm_rot_axis_1_step3[3]=[];
		mm_rot_axis_1_step3[3][0]= 0.0;
		mm_rot_axis_1_step3[3][1]= 0.0;
		mm_rot_axis_1_step3[3][2]= 0.0;
		mm_rot_axis_1_step3[3][3]= 1.0;
		//----------------------------------------------------------------------
						
		
		//----------------------------------------------------------------------
		// STEP 5 - ROTATION AXIS 1 INVERSE
		//----------------------------------------------------------------------				
		var mm_rot_axis1_inverse_step5 = []; //[][]
		
		mm_rot_axis1_inverse_step5[0]=[];
		mm_rot_axis1_inverse_step5[0][0]= (this.rot_vector_d1/this.rot_vector_d2);
		mm_rot_axis1_inverse_step5[0][1]= 0.0;
		mm_rot_axis1_inverse_step5[0][2]= (-1.0)*(this.rot_vector_axis_0/this.rot_vector_d2);
		mm_rot_axis1_inverse_step5[0][3]= 0.0;

		mm_rot_axis1_inverse_step5[1]=[];
		mm_rot_axis1_inverse_step5[1][0]= 0.0;
		mm_rot_axis1_inverse_step5[1][1]= 1.0;
		mm_rot_axis1_inverse_step5[1][2]= 0.0;
		mm_rot_axis1_inverse_step5[1][3]= 0.0;
		
		mm_rot_axis1_inverse_step5[2]=[];
		mm_rot_axis1_inverse_step5[2][0]= (this.rot_vector_axis_0/this.rot_vector_d2);
		mm_rot_axis1_inverse_step5[2][1]= 0.0;
		mm_rot_axis1_inverse_step5[2][2]= (this.rot_vector_d1/this.rot_vector_d2);
		mm_rot_axis1_inverse_step5[2][3]= 0.0;
						
		mm_rot_axis1_inverse_step5[3]=[];
		mm_rot_axis1_inverse_step5[3][0]= 0.0;
		mm_rot_axis1_inverse_step5[3][1]= 0.0;
		mm_rot_axis1_inverse_step5[3][2]= 0.0;
		mm_rot_axis1_inverse_step5[3][3]= 1.0;								
		//----------------------------------------------------------------------
		
		//----------------------------------------------------------------------
		// STEP 8 - CALCULATE NEW COORDINATES - PROCCES MATRIXS
		//----------------------------------------------------------------------	
				
		var xmatrix_step1_tr 	= this.getmx_rot_axis_traslation_to_center(); //Matrix4x4
		var xmatrix_step2_rot_0 = new XF_Matrix4x4(mm_rot_0_step2); //Matrix4x4
		var xmatrix_step3_rot_1 = new XF_Matrix4x4(mm_rot_axis_1_step3);//Matrix4x4		
		
		var xmatrix_step4_rot_2 		= XF_RAxis.get_axisxyz_matrix_rot_axis_2(rotation_angle);		
		var xmatrix_step5_rot_1_inverse	= new XF_Matrix4x4(mm_rot_axis1_inverse_step5);		
		var xmatrix_step6_rot_0_inverse	= new XF_Matrix4x4(mm_rot_axis_0_inverse_step6);		
		var xmatrix_step7_tr_inverse= this.getmx_rot_axis_traslation_to_pivot();		
				
		var xm_step1_step2 = XF_Math3dUtil.get_mmatrix_mult(xmatrix_step1_tr,xmatrix_step2_rot_0);
		var xm_step2_step3 = XF_Math3dUtil.get_mmatrix_mult(xm_step1_step2,xmatrix_step3_rot_1);
		var xm_step3_step4 = XF_Math3dUtil.get_mmatrix_mult(xm_step2_step3,xmatrix_step4_rot_2);
		var xm_step4_step5 = XF_Math3dUtil.get_mmatrix_mult(xm_step3_step4,xmatrix_step5_rot_1_inverse);
		var xm_step5_step6 = XF_Math3dUtil.get_mmatrix_mult(xm_step4_step5,xmatrix_step6_rot_0_inverse);
		//......................................................................
		
		var xm_result = XF_Math3dUtil.get_mmatrix_mult(xm_step5_step6,xmatrix_step7_tr_inverse);
		return xm_result;
	}//end
	

	static get_axisxyz_matrix_rot_axis_2(rotation_angle) {
		var m_elem = []; //[4][4]
		
		m_elem[0] = [];
		m_elem[1] = [];
		m_elem[2] = [];
		m_elem[3] = [];
		
		m_elem[0][0] = Math.cos(rotation_angle);
		m_elem[0][1] = Math.sin(rotation_angle);
		m_elem[0][2] = 0.0;
		m_elem[0][3] = 0.0;		
		
		m_elem[1][0] = Math.sin(rotation_angle)* (-1.0);
		m_elem[1][1] = Math.cos(rotation_angle);
		m_elem[1][2] = 0.0;
		m_elem[1][3] = 0.0;
		
		m_elem[2][0] = 0.0;
		m_elem[2][1] = 0.0;
		m_elem[2][2] = 1.0;
		m_elem[2][3] = 0.0;		
		
		m_elem[3][0] = 0.0;
		m_elem[3][1] = 0.0;
		m_elem[3][2] = 0.0;
		m_elem[3][3] = 1.0;		
		return new XF_Matrix4x4(m_elem);
	}//end
	
	static getAxisRotation(axisIndex) {  
		var axisPtEnd = [0.0,0.0,0.0];
		axisPtEnd[axisIndex] = 1.0;	
		return new XF_RAxis([0.0,0.0,0.0],axisPtEnd);
	}//end 
	
} //end constructor



