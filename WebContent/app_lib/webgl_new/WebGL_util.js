
/**
 * remove object from three scene
 */
 function removeObject3D(THREE,object3D) {
    if (!(object3D instanceof THREE.Object3D)) return false;

    // for better memory management and performance
    if (object3D.geometry) object3D.geometry.dispose();

    if (object3D.material) {
        if (object3D.material instanceof Array) {
            // for better memory management and performance
            object3D.material.forEach(material => material.dispose());
        } else {
            // for better memory management and performance
            object3D.material.dispose();
        }
    }
    object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
    return true;
}//end function

function getColorRGBA(colorInt) {   
	var porcentaje_r = XF_Math.getPercent(1.0,colorInt[0]);
	var porcentaje_g = XF_Math.getPercent(1.0,colorInt[1]);
	var porcentaje_b = XF_Math.getPercent(1.0,colorInt[2]);
	var porcentaje_a = XF_Math.getPercent(1.0,colorInt[3]);
		
	var valor_r = Math.floor(XF_Math.getValuePercent(255,porcentaje_r));
	var valor_g = Math.floor(XF_Math.getValuePercent(255,porcentaje_g));
	var valor_b = Math.floor(XF_Math.getValuePercent(255,porcentaje_b));
	var valor_a = Math.floor(XF_Math.getValuePercent(255,porcentaje_a));
					
	return [valor_r,valor_g,valor_b,valor_a];	
}
	
	
function createImageDataFromColor(ctx,imgWidth,imgHeight,colorInt){
	var imgData = ctx.createImageData(imgWidth,imgHeight);
	var colorRGBA = getColorRGBA(colorInt);
	var i;
	for (i = 0; i < imgData.data.length; i += 4) {				
  		imgData.data[i + 0] = colorRGBA[0];
  		imgData.data[i + 1] = colorRGBA[1];
  		imgData.data[i + 2] = colorRGBA[2];
  		imgData.data[i + 3] = 255; //colorRGBA[3];
	}	 	
	return imgData;
}//end function

function createImageFromColor(imgWidth,imgHeight,colorInt){
	
	//var canvas = document.getElementById('trCanvas');
	
	let canvas = document.createElement('canvas');
	
	var ctx = canvas.getContext("2d");		
	var imgData = createImageDataFromColor(ctx,imgWidth,imgHeight,colorInt);
 	ctx.putImageData(imgData,0,0);
 	        
    var image=new Image();
    image.onload=function(){
       ctx.drawImage(image,0,0);
    }
    image.src=canvas.toDataURL();    	
    return image;
    	
}//end function


/**
 * class WebGL_util.readTxtFileContent(file_path)
 */
 class  WebGL_util {        

	constructor(){}//end constructor
	/*
	   init: function () {
        $.ajax({
            url: "./seeds/Ag.txt",
            async: false,
            success: function (data){
                pageExecute.fileContents = data;
            }
        });
    */
    static readTxtFileContent(file_path) {    
    	var data = $.ajax({
		       	url: file_path,
		       	async: false
		}).responseText;				   	
		return data;	
    }
    
	static readJSonObject(file_path) {
		var json_object = $.parseJSON(
		   	$.ajax({
		       	url: file_path,
		       	async: false,
		       	dataType: 'json'
		   	}).responseText
		);		
		return json_object;	
	};//end function
	
	static getColorTexture(THREE,canvasId,color){
		//var itemColor = [0.0,0.0,0.0,1.0];
		let canvas = document.getElementById(canvasId);
		let ctx = canvas.getContext("2d");	
		let imgData = createImageDataFromColor(
			ctx,
			256,256,
			color);
		let texture = new THREE.DataTexture(imgData,256,256 );
		texture.needsUpdate = true;
		return texture;
	}//end function

	static loadTextureFromImageRotated(THREE,listener,imagePath,angle){
		let img = new Image();
		img.src = imagePath;
		img.onload = function() {
			let canvas = document.createElement('canvas');
    		canvas.width  = img.width;
    		canvas.height = img.height;			    		 
			let ctx = canvas.getContext("2d");     		
     		ctx.translate(img.width/2,img.height/2);
     		let rotationApply = XF_Math.getAngleDec(XF_Math.RADIANS_90,angle);
  			ctx.rotate(rotationApply);			
			ctx.drawImage(img,-img.width/2,-img.height/2) ; 
			let imgData = ctx.getImageData(1,1,img.width,img.height);	
			let texture = new THREE.DataTexture(imgData,img.width,img.height);
			texture.needsUpdate = true;	
			listener.onTextureCharged(texture);		
		}				
	}//end function
	
	//var image = new Image();
    //image.src = canvas.toDataURL();
    
	static loadTexturesFromImageRotated(THREE,listener,imagePath,velocityMax,angleUnit){
		
		let link = document.createElement('a');
  		link.download = 'speedometer.png';
  						
		let img = new Image();
		img.src = imagePath;
		img.onload = function() {
			let textures = [];
			let canvas = document.createElement('canvas');
    		canvas.width  = img.width;
    		canvas.height = img.height;			    		 
			let ctx = canvas.getContext("2d");

     		for(let idx=0;idx<velocityMax;idx++){
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.save();  
				ctx.translate(img.width/2,img.height/2); 
				let rotationApply = (idx * angleUnit) * (-1);										
				ctx.rotate(XF_Math.RADIANS_90);
				ctx.rotate(rotationApply);
				ctx.drawImage(img,-img.width/2,-img.height/2) ; 
  				//link.href = canvas.toDataURL(); 
 				//link.click();  				 
				let imgData = ctx.getImageData(1,1,img.width,img.height);				
				textures[idx] = new THREE.DataTexture(imgData,img.width,img.height);
				textures[idx].needsUpdate = true;					 
				ctx.restore();
			}		
			listener.onTexturesCharged(THREE,textures);	
		}			
	}//end function
		
	static captureImageData(listener,imagePath){		
		let img = new Image();
		img.src = imagePath;
		img.onload = function() {	
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext("2d");
			ctx.drawImage(img,0,0);
			let imgData = ctx.getImageData(1,1,img.width,img.height);		
			listener.onCaptureImageData(imgData);	
		}		
	}//end function
			
	static readModel3DfromPath(parent,ppath,modelId) {
		var modelFileName = modelId.concat('.json');
		var path = 	ppath.concat('/').concat(modelFileName); 
		
		var modelObj =  WebGL_util.readJSonObject(path);	
		
		var wglObject = new WebGL_grpobjects(
				parent,
				modelId,
				modelObj.position,
				modelObj.objects,
				modelObj.dataDirectory
		);					
		return wglObject;
	}//end function
		

	static loadWglPhysicalColorObject(THREE,scene,fbxLoader,parent,dataDirectory,fbxFileName,position,scale,color,opacity,textureMap) {				
		var  objMaterial = new THREE.MeshPhysicalMaterial();							
		objMaterial.color = new THREE.Color(color[0],color[1],color[2]);
		objMaterial.normalMap = textureMap;
		
		objMaterial.normalMap.encoding = THREE.sRGBEncoding;
		
		objMaterial.transparent =true;
		objMaterial.opacity= opacity;		
		objMaterial.roughness = 0.0;
								
		objMaterial.normalScale= new THREE.Vector2(0.5,0.5)
								
		//objMaterial.clearcoat = 1.0;
		//objMaterial.cleacoatRoughness= 0.1;		
		//let pos = fbxFileName.lastIndexOf('.');
		//let objName = fbxFileName.substring(0,pos);
						
		var  dtoMaterial = new THREE.MeshPhysicalMaterial(objMaterial);
						
		var objfbxPath = dataDirectory.concat(fbxFileName);	
	 	fbxLoader.load(
		  	objfbxPath,
		    (object) => {
				let lightIndex=-1;		
				for(let idx=0;idx<object.children.length;idx++){
					let child = object.children[idx];
					if(!child.isLight){
		                child.material = objMaterial;					
				        child.receiveShadow = true;			        					
					}
					else {
						lightIndex=idx;
					}
				}
				if(lightIndex>=0){
					object.remove(object.children[lightIndex]);
				}	       
				object.position.x = position[0];	
				object.position.y = position[1];	
				object.position.z = position[2];
				parent.alertItemCharged(scene,object);	
		    },
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    (error) => {
		        //console.log(error);
		    }
		)
	}//end function

	static loadWglPhysicalTextureObject(THREE,scene,fbxLoader,loaderTextures,parent,dataDirectory,fbxFileName,position,color,scale,opacity,
									   mapFileName,aoFileName,emissiveFileName,roughnessFileName,bumpFileName) {	
		
		let  objMaterial = new THREE.MeshStandardMaterial(); //MeshPhongMaterial 
		objMaterial.color = new THREE.Color(color[0],color[1],color[2]);
			
		let textureMapPath = dataDirectory.concat(mapFileName);
		objMaterial.map  = loaderTextures.load(textureMapPath);	
		objMaterial.map.encoding = THREE.sRGBEncoding;
		
		objMaterial.roughness = 0.0;
		
		if(emissiveFileName!=null){
			let texturEmissiveMapPath = dataDirectory.concat(emissiveFileName);		
			objMaterial.emissiveMap = loaderTextures.load(texturEmissiveMapPath);			
		}
				
		if(aoFileName!=null){
			let texturAoMapPath = dataDirectory.concat(aoFileName);		
			objMaterial.aoMap= loaderTextures.load(texturAoMapPath);			
		}
			
		if(roughnessFileName!=null){
			//objMaterial.roughness = 0.5;
			let roughnessMapPath = dataDirectory.concat(roughnessFileName);		
			objMaterial.roughnessMap = loaderTextures.load(roughnessMapPath);			
		}

		if(bumpFileName!=null){
			let bumpMapPath = dataDirectory.concat(bumpFileName);		
			objMaterial.bumpMap = loaderTextures.load(bumpMapPath);			
		}
		
		objMaterial.transparent =true;
		objMaterial.opacity= opacity;	
		//objMaterial.normalScale= new THREE.Vector2(0.5,0.5)		
		//objMaterial.clearcoat = 1.0;
		//objMaterial.cleacoatRoughness= 0.1;
					
		//add material setting		
		var  dtoMaterial = new THREE.MeshPhysicalMaterial(objMaterial);
					
	 	fbxLoader.load(
		  	dataDirectory.concat(fbxFileName),
		    (object) => {
				//debugger;		
				let lightIndex=-1;		
				for(let idx=0;idx<object.children.length;idx++){
					let child = object.children[idx];
					if(!child.isLight){
		                child.material = dtoMaterial;					
				        child.receiveShadow = true;			        					
					}
					else {
						lightIndex=idx;
					}
				}
				if(lightIndex>=0){
					object.remove(object.children[lightIndex]);
				}	       
				object.position.x = position[0];	
				object.position.y = position[1];	
				object.position.z = position[2];
				parent.alertItemCharged(scene,object);			                   		        		       
		    },
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    (error) => {
		        //console.log(error);
		    }   
		)										   
	}//end function
										   		
	static loadWglComplexTextureObject(THREE,scene,fbxLoader,loaderTextures,parent,dataDirectory,fbxFileName,position,color,scale,opacity,
									   mapFileName,aoFileName,emissiveFileName,roughnessFileName,bumpFileName,normalFileName) {	
		
		let  objMaterial = new THREE.MeshStandardMaterial(); 
		objMaterial.color = new THREE.Color(color[0],color[1],color[2]);

		objMaterial.transparent 		= true;
		objMaterial.opacity				= opacity;	
		objMaterial.emissiveIntensity 	= 0;
		objMaterial.roughness 			= 0.0;			
		//objMaterial.metalness			= 1;	
		objMaterial.normalScale		= new THREE.Vector2(2.5,2.5)		
		
		let textureMapPath = dataDirectory.concat(mapFileName);
		objMaterial.map  = loaderTextures.load(textureMapPath);	
		objMaterial.map.encoding = THREE.sRGBEncoding;
		
		if(emissiveFileName!=null){
			let texturEmissiveMapPath = dataDirectory.concat(emissiveFileName);		
			objMaterial.emissiveMap = loaderTextures.load(texturEmissiveMapPath);			
		}
				
		if(aoFileName!=null){
			let texturAoMapPath = dataDirectory.concat(aoFileName);		
			objMaterial.aoMap= loaderTextures.load(texturAoMapPath);	
			//objMaterial.metalnessMap= loaderTextures.load(texturAoMapPath);								
		}
			
		if(roughnessFileName!=null){
			objMaterial.roughness = 1.0;
			let roughnessMapPath = dataDirectory.concat(roughnessFileName);		
			objMaterial.roughnessMap = loaderTextures.load(roughnessMapPath);			
		}

		if(bumpFileName!=null){
			let bumpMapPath = dataDirectory.concat(bumpFileName);		
			objMaterial.bumpMap = loaderTextures.load(bumpMapPath);						
		}	
		if(normalFileName!=null){			
			let normalMapPath = dataDirectory.concat(normalFileName);		
			objMaterial.normalMap = loaderTextures.load(normalMapPath);				
		}					
	
	 	fbxLoader.load(
		  	dataDirectory.concat(fbxFileName),
		    (object) => {
				//debugger;		
				let lightIndex=-1;		
				for(let idx=0;idx<object.children.length;idx++){
					let child = object.children[idx];
					if(!child.isLight){
		                child.material = objMaterial;					
				        child.receiveShadow = true;		
				        child.castShadow = true;	        					
					}
					else {
						lightIndex=idx;
					}
				}
				if(lightIndex>=0){
					object.remove(object.children[lightIndex]);
				}	  
				object.name = fbxFileName;     
				object.position.x = position[0];	
				object.position.y = position[1];	
				object.position.z = position[2];
				parent.alertItemCharged(scene,object);			                   		        		       
		    },
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    (error) => {
		        //console.log(error);
		    }   
		)
	}//end function	
		
	static loadWglTextureAlphaObject(THREE,scene,fbxLoader,loaderTextures,parent,dataDirectory,fbxFileName,position,scale,opacity,mapFileName,alphaFileName) {	
						
		var textureMapPath = dataDirectory.concat(mapFileName);
		var alphaMapPath = dataDirectory.concat(alphaFileName);		
		
		//var textureBumpMapPath = dataDirectory.concat(bumpFileName);
		var  objMaterial = new THREE.MeshStandardMaterial(); 
		objMaterial.map= loaderTextures.load(textureMapPath);		
		objMaterial.alphaMap= loaderTextures.load(alphaMapPath);	
		objMaterial.transparent =true;
		objMaterial.opacity= opacity;
		objMaterial.roughness = 0.0;
		//let pos = fbxFileName.lastIndexOf('.');
		//let objName = fbxFileName.substring(0,pos);
			
	 	fbxLoader.load(
		  	dataDirectory.concat(fbxFileName),
		    (object) => {
		         object.traverse(function (child) {
		             if(child.isMesh) {
		                 child.material = objMaterial;
		            }
		         })		         
		         
		        object.receiveShadow = false;	
		      
	         	if(scale!=null){ object.scale.set(scale[0],scale[1],scale[2]);}
		      
				object.position.x = position[0];	
				object.position.y = position[1];	
				object.position.z = position[2];	
		         
		        /* 	 
		        if(parent.position!=null){
					object.position.x += parent.position[0];	
					object.position.y += parent.position[1];
					object.position.z += parent.position[2];  					
				}
				*/
				parent.alertItemCharged(scene,object);
		    },
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    (error) => {
		        //console.log(error);
		    }   
		)
	}//end function	
		
	
	static loadWglTerrainByTexture(THREE,scene,fbxLoader,loaderTextures,parent,dataDirectory,fbxFileName,position,color,opacity,
									   mapFileName,imageData) {	
		
		let  objMaterial = new THREE.MeshStandardMaterial(); 
		objMaterial.color = new THREE.Color(color[0],color[1],color[2]);

		objMaterial.emissiveIntensity = 0;
		let textureMapPath = dataDirectory.concat(mapFileName);
		objMaterial.map  = loaderTextures.load(textureMapPath);	
		objMaterial.map.encoding = THREE.sRGBEncoding;						
		objMaterial.transparent =true;
		objMaterial.opacity= opacity;	
		objMaterial.roughness = 0.0;	
		//objMaterial.normalScale= new THREE.Vector2(0.5,0.5)
		//objMaterial.clearcoat = 1.0;
		//objMaterial.cleacoatRoughness= 0.1;					
		
		let countRows = imageData.length;
		let countCols = imageData[0].length;
		
		let lenHalf  = countRows/2;
		let widthHalf = countCols/2;
				
		console.log(countRows); 
		console.log(countCols); 
		  
	 	fbxLoader.load(
		  	dataDirectory.concat(fbxFileName),
		    (object) => {
		         object.traverse(function (child) {
		             if(child.isMesh) {
		                child.material = objMaterial; 
		                //let arrayVertex= child.geometry.getAttribute('position').array;  
		                let arrayVertex= child.geometry.attributes.position.array;  		        
		                let countPoints = arrayVertex.length / 3;         
		                /*
		                //console.log(arrayVertex); 		                		 
		                //console.log(countPoints); 		 		                		            
		                //var decimal = n - Math.floor(n)		                 		                
		                for(let ptIndex=0;ptIndex<countPoints;ptIndex++){
							
							let firstElemIndex = (ptIndex * 3);
							let valueX = arrayVertex[firstElemIndex];
							let valueY = arrayVertex[firstElemIndex+1];
							
							//calcular row index
							let rowIndex = 0;
							if(valueY>=0) {
								let valueInt = Math.floor(valueY);
								let valueDec = valueY-valueInt;
								rowIndex = lenHalf + valueInt - 1;
								
								//if(valueDec>0.5){rowIndex+=1;}
													
							}	
							else{
								let valuePos= Math.abs(valueY);
								let valueInt = Math.floor(valuePos);
								let valueDec = valuePos-valueInt;
								rowIndex = lenHalf - valueInt;								
								//if(valueDec>0.5){rowIndex -= 1;}														
							}						
							//calcular column index
							let colIndex = 0;
							if(valueX>=0) {
								let valueInt = Math.floor(valueX);
								let valueDec = valueX-valueInt;
								colIndex = widthHalf + valueInt - 1;								
								//if(valueDec>0.5){colIndex+=1;}
								
							}
							else {
								let valuePos= Math.abs(valueX);
								let valueInt = Math.floor(valuePos);
								let valueDec = valuePos-valueInt;
								colIndex = widthHalf - valueInt;
								//if(valueDec>0.5){colIndex -= 1;}
								
							}
							if(rowIndex<0){
								console.log('error');
								debugger;
							}
							if(colIndex<0){
								console.log('error');
								debugger;
							}	
							if(rowIndex>499){
								console.log('error');
								debugger;
							}
							if(colIndex>499){
								console.log('error');
								debugger;
							}														
							if(ptIndex>1480000){
								//console.log(ptIndex);
							}
							arrayVertex[firstElemIndex+2] = imageData[rowIndex][colIndex];
							
						}//end for     
						*/
						console.log('END');
						
				        child.receiveShadow = true;			        
						child.position.x = position[0];	
						child.position.y = position[1];	
						child.position.z = position[2];
						parent.alertItemCharged(scene,child);		                       
		            }
		         })		         		        		       
		    },
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    (error) => {
		        //console.log(error);
		    }   
		)
	}//end function	
		
	/*			
	static loadWglTerrainByTexture(THREE,scene,fbxLoader,loaderTextures,parent,dataDirectory,fbxFileName,position,color,mapFileName) {	
		
		let  objMaterial = new THREE.MeshStandardMaterial(); 
		objMaterial.color = new THREE.Color(color[0],color[1],color[2]);

		objMaterial.emissiveIntensity = 0;
		let textureMapPath = dataDirectory.concat(mapFileName);
		objMaterial.map  = loaderTextures.load(textureMapPath);	
		objMaterial.map.encoding = THREE.sRGBEncoding;								
		objMaterial.transparent =true;
	 	fbxLoader.load(
		  	dataDirectory.concat(fbxFileName),
		    (object) => {
		         object.traverse(function (child) {
		             if(child.isMesh) {
						child.material = objMaterial;    
		                let arrayVertex= child.geometry.getAttribute( 'position').array;  		                 
		                console.log(arrayVertex.length/3); 
						if(scale!=null){ child.scale.set(scale[0],scale[1],scale[2]);}
				        child.receiveShadow = true;			        
						child.position.x = position[0];	
						child.position.y = position[1];	
						child.position.z = position[2];
						parent.alertItemCharged(scene,child);		                       
		            }
		         })		         		        		       
		    },
		    (xhr) => {
		        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
		    },
		    (error) => {
		        //console.log(error);
		    }   
		)
	}//end function	
	*/				
}//end class
	
/*
			
let strColor = 'rgb('.concat(color[0]).concat(',').concat(color[1]).concat(',').concat(color[2]).concat(')');
//objMaterial.color = new THREE.Color(strColor);
function loadSimpleObjects(THREE) {
	geometry = new THREE.BoxGeometry( 1, 1, 1 );
	material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( geometry, material );
}//end   
*/

/*
imgLoader.load(
	// resource URL
	'data/textures/rojo.jpg',

	// onLoad callback
	function ( image ) {
		// use the image, e.g. draw part of it on a canvas
		//const canvas = document.createElement( 'canvas' );
		//const context = canvas.getContext( '2d' );
		ctx.drawImage( image,0,0 );
		console.log( 'drawImage' );
	},	
	// onError callback
	function () {
		console.error( 'An error happened.' );
	}
);
*/