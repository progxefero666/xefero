/**
 * 
 */

 var thisObj = null;
var controls = null;

class  WebGLAppCuartel {        
	
	//constructor	
	//..........................................................................
	constructor(objCanvas,monitorWidth,monitorHeight,THREE,FBXLoader,FlyControls,OrbitControls) {

		this.monitorWidth = monitorWidth;
		this.monitorHeight = monitorHeight;
	
		//charge Three WebGlMonitor
		//.....................................................................		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( monitorWidth, monitorHeight);				
		objCanvas.appendChild( this.renderer.domElement );	
		
		//..........................................................................
		this.boundingClientRect = this.renderer.domElement.getBoundingClientRect();
		//console.log('top:');console.log(this.boundingClientRect.top);
		//console.log('bottom:');console.log(this.boundingClientRect.bottom);		
		//console.log('left:');console.log(this.boundingClientRect.left);			
		//console.log('right:');console.log(this.boundingClientRect.right);				
		//..........................................................................
		
		
		this.active = false;
		this.textLoader = new THREE.TextureLoader();
		this.fbxLoader 	= new FBXLoader();
		
		//create scene
		//.....................................................................
		this.scene = new THREE.Scene();		
		//this.scene.background = new THREE.Color("rgb(250,250,250)");					
		//this.scene.background = this.textLoader.load( './data/cielo/cieloestrellas_ft.jpg' );
				
		this.chargeLights(THREE);
		this.init(THREE,OrbitControls);
		
	}//end constructor

	init(THREE,OrbitControls) {
		
		this.mousePointer = new THREE.Vector2();
		this.mousePointer.x = -1;
		this.mousePointer.y = -1;
		this.raycaster = new THREE.Raycaster();
		
		//cuartel
		//this.cuartelItems = new WebGL_listdtos(this,'data/cuartel/','cuartel');
		//this.cuartelItems.loadWglObjects(THREE,this.scene,this.fbxLoader,this.textLoader,[0,-60,0]);
						
		//this.impshuttle = new WebGL_groupdtos(this,'data/game/ship/impshuttle/','impshuttle');
		//this.impshuttle.loadWglObjects(THREE,this.scene,this.fbxLoader,this.textLoader,null);
		
		this.xwing = new WebGL_groupdtos(this,'data/game/ship/xwing/','xwing');
		this.xwing.loadWglObjects(THREE,this.scene,this.fbxLoader,this.textLoader,null);
	
		//this.impdestroyer = new WebGL_groupdtos(this,'data/game/ship/impdestroyer/','impdestroyer');
		//this.impdestroyer.loadWglObjects(THREE,this.scene,this.fbxLoader,this.textLoader,null);
		
		//this.tie = new WebGL_groupdtos(this,'data/game/ship/tie/','tie');
		//this.tie.loadWglObjects(THREE,this.scene,this.fbxLoader,this.textLoader,null);
		
		this.dinObj = null;
		
		//this.loadTestObjects(THREE);					
		//this.fireContact = new WebGLObject_fireContact(this,this.scene,[0,0,0],1);
						
		//front camera 
		//.....................................................................
		this.camera = new THREE.PerspectiveCamera( 50, this.monitorWidth / this.monitorHeight, 0.1, 10000);
		this.camera.position.x = 0;
		this.camera.position.y = 0;	
		this.camera.position.z = 20;
			
		
		//ortho camera
		//this.camera = new THREE.PerspectiveCamera( 55, this.monitorWidth / this.monitorHeight,1, 8000);
		//this.camera.position.x = 0;	
		//this.camera.position.y = 2000;
		//this.camera.position.z = 0;		
		//this.camera.rotation.x = RADIAN * 270;
		
			//this.tie.grdto.rotation.y = XF_Math.RADIAN * 90;	
	//this.tie.grdto.position.z = -200;
	//this.tie.grdto.position.y = 0;							
	//let pointStart = [200,0,-200];
	//let pointEnd = [-200,0,200];
	//this.dinObj = new WebGLObjectRuteLine3d(this,'tie',this.tie.grdto,1,pointStart,pointEnd);
	
		/*
		//map = THREE.ImageUtils.loadTexture( "disc.png" );
		let spriteMap = new THREE.TextureLoader().load( 'data/sprites/ball.png' );		
		let spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap} );
		let sprite = new THREE.Sprite( spriteMaterial );		
		sprite.position.set(5,0,0);			
		this.scene.add( sprite );			
		//load floor
		//.....................................................................
		let textureC = this.textLoader.load('data/pruebas/pantalla_1.jpg');
		let cubeGeometry = new THREE.BoxGeometry(3,3,3);
		let cubeMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } );
		cubeMaterial.map = textureC;
		
		let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
		cube.position.z = -10
		this.scene.add(cube);	
								
		
		let planeGeometry = new THREE.PlaneGeometry(10,10);		
		let textureP = this.textLoader.load('data/pruebas/shipframe.png');
		let texturePA = this.textLoader.load('data/pruebas/shipframealpha.jpg');
		let planeMaterial = new THREE.MeshStandardMaterial(); 						
		planeMaterial.transparent =true;	
		planeMaterial.map = textureP;		
		planeMaterial.alphaMap = texturePA;	
		planeMaterial.needsUpdate = true
		
		//planeMaterial.transparent =true;
		//planeMaterial.opacity= 0.5;
		//planeMaterial.needsUpdate = true
		
		this.plane = new THREE.Mesh( planeGeometry, planeMaterial );					
		this.scene.add(this.plane);	
		*/
		let cfTexture = this.textLoader.load('data/pruebas/pantalla_1.jpg');
		let cfGeometry = new THREE.CircleGeometry(5, 32 ); 
		let cfMaterial = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
		cfMaterial.map = cfTexture;		 
		let cf = new THREE.Mesh(cfGeometry,cfMaterial); 
		this.scene.add(cf); 
							
		this.gameScene = new WebGL_scene([0,0,0],1000,0);
		this.din_xwing = null;		
		this.controls = new OrbitControls( this.camera, this.renderer.domElement );	
		this.start(THREE);

	}//end function
		
	executeTest(){
		let textureB = this.textLoader.load('data/pruebas/panelB.jpg');
		
		this.plane.material.map = textureB;	
		
		console.log(this.plane.material);
		
	}//end function	
	
	onPointerMove(event){
		let coordX = ( ( event.clientX - this.boundingClientRect.left ) / 
					 ( this.boundingClientRect.right - this.boundingClientRect.left ) ) * 2 - 1;
		let coordY =  - ( ( event.clientY - this.boundingClientRect.top ) /
					 ( this.boundingClientRect.bottom - this.boundingClientRect.top) ) * 2 + 1;
		this.mousePointer.x = coordX;
		this.mousePointer.y = coordY;
	}//end function	

	onRouteEnd(THREE,id){
		console.log('onRouteEnd:');console.log(id);
		switch (id) {
	 		case 'pruebas':
				 WebGL_threeUtil.removeObject3D(THREE,this.destroyerModel.wglObjects[0].sceneObj);
	    		break;	    		
		 	default:
	    }//end switch
	    				 
	}//end function
	
	onFireContactFinish(){
		console.log('onFireContactFinish');
		this.fireContact = null;
	}//end function
	
	alertAllDtosCharged(id){
		switch (id) {
			case 'impshuttle':
				console.log('impshuttle loaded');
				break;
			case 'cuartel':
				console.log('cuartel loaded');
				break				
			case 'impdestroyer':
				console.log('impdestroyer loaded');
				
				this.impdestroyer.grdto.rotation.y = XF_Math.RADIAN * 235;
				//this.dinDestroyer = new WebGL_dinamicgroup
				//	(this,'destroyer',this.destroyerModel.wglObjects[0].sceneObj,1,this.rutePlaneY);					
				break;
			case 'tie':
				console.log('tie loaded');
				this.tie.grdto.rotation.y = XF_Math.RADIAN * 45;	
				this.tie.grdto.position.x = -3;
				this.tie.grdto.position.y = 3;
							
				//let pointStart = [200,0,-200];
				//let pointEnd = [-200,0,200];
				//this.dinObj = new WebGLObjectRuteLine3d(this,'tie',this.tie.grdto,1,pointStart,pointEnd);
				break;				
	 		case 'xwing':
				console.log('xwing loaded');		
	    		break;	    		
		 	default:
	    }//end switch		
	}//end function	
			
	alertGroupCharged(scene,webglGroup,id){		

		scene.add(webglGroup);
	}//end function

	start(THREE) {
		this.active = true;
		thisObj = this;				
		function animate() {
			if(thisObj.active){
				requestAnimationFrame( animate );
				
				/*
				if(thisObj.tie.ring!=null){										
					thisObj.tie.ring.lookAt (thisObj.camera.position);					
					thisObj.tie.rotation = thisObj.camera.rotation.clone();								
					//thisObj.tie.ring.rotateZ(Math.PI/4);
				}
				*/
				/*
				if(thisObj.din_xwing!=null){
					thisObj.din_xwing.dinamic();
				}				
				*/
				/*
				thisObj.raycaster.setFromCamera( thisObj.mousePointer, thisObj.camera );	
				let intersects = thisObj.raycaster.intersectObjects( thisObj.scene.children );

				for ( let i = 0; i < intersects.length; i ++ ) {
					intersects[ i ].object.material.color.set( 0xff0000 );
				}
				*/	
				/*		
				if(thisObj.dinObj!=null){
					thisObj.dinObj.dinamic(THREE);
				}
				
				
				if(thisObj.fireContact!=null){
					thisObj.fireContact.dinamic(THREE);
				}
				*/
								
				thisObj.renderer.render( thisObj.scene,thisObj.camera );				
			}
			else {
				//console.log('active false');
				thisObj.renderer.setAnimationLoop(null);	
			}
		}
		animate();	
	}//end function
	
	loadTestObjects(THREE){

		let countItem = 14;
		
		let sphereIntVertex = XF_Math3dUtil.getSphereAllVertex([0,0,0],0.2,16);
		let sphereExtVertex = XF_Math3dUtil.getSphereAllVertex([0,0,0],2.0,16);
		
		let intCoord = [];
		let extCoord = [];
		for(let idx=0;idx<countItem;idx++){
			let aleatValueI = XF_Math.getAleatoryValue(sphereIntVertex.length)-1;
			intCoord[idx] = sphereIntVertex[aleatValueI];	
			extCoord[idx] = sphereExtVertex[aleatValueI];						
		}//end for
		
		let material = new THREE.LineBasicMaterial({
			color: 0xff0000
		});

		for(let idx=0;idx<countItem;idx++){
			let pointStart = new THREE.Vector3(intCoord[idx][0],intCoord[idx][1],intCoord[idx][2]);
			let pointEnd = new THREE.Vector3(extCoord[idx][0],extCoord[idx][1],extCoord[idx][2]);
			let points = [];
			points.push(pointStart);
			points.push(pointEnd);

			let geometry = new THREE.BufferGeometry().setFromPoints(points);
			let line = new THREE.Line(geometry,material);

			this.scene.add(line);
		}//end for
				
	}//end function
	
	loadTestObjectsExplosion(THREE){
		/*
		let cntTestObj = 100;
		for(let idx=0;idx<cntTestObj;idx++) {
			let boxTest = WebGL_threeGenObjects.createObjectBoxInAleatoryPosition(THREE,[0,0,0],1000,200,10,[1,1,0])		
 			this.scene.add(boxTest); 									
		}
		*/
		
		/*
		let sphereVertex = XF_Math3dUtil.getSphereAllVertex([0,0,0],6,16);
		for(let idx=0;idx<sphereVertex.length;idx++){
			let sphereColor = [1,0.7,0];
			let sphereItem = WebGL_threeGenObjects.createObjectSphere(THREE,0.5,16,sphereColor,sphereVertex[idx]);
			this.scene.add(sphereItem);
		}*/
		//createObjectSphereColor(THREE,radius,whSegments,threeColor,position)
		//XF_Math.getAleatoryValue(maxValor)
		
		let countColors = 5;
		let colors = [];
		colors[0] = new THREE.Color("rgb(176,2,2)"); //rojo
		colors[1] = new THREE.Color("rgb(255,72,0)"); //naranja
		colors[2] = new THREE.Color("rgb(255,234,0)"); //amarillo
		colors[3] = new THREE.Color("rgb(255,168,0)"); //oro
		
		colors[4] = new THREE.Color("rgb(76,76,76)"); //gris claro
		colors[5] = new THREE.Color("rgb(40,40,40)"); //gris oscuro
		
		
		let radioMin = 50;
		let radioMax = 75;
		let countItem = 14;
		
		let sphereIntVertex = XF_Math3dUtil.getSphereAllVertex([0,0,0],0.8,16);
		let intSpheres = [];
		for(let idx=0;idx<countItem;idx++){
			let aleatValueG = XF_Math.getAleatoryValue(6);
			
			let aleatValueC = XF_Math.getAleatoryValue(6);
			let itemColor = colors[aleatValueC];
			let aleatValueR = XF_Math.getAleatoryValueMin(radioMin,radioMax);
			let itemRadius = aleatValueR / 100;
			
			let aleatValueI = XF_Math.getAleatoryValue(sphereIntVertex.length)-1;
			let itemPosition = sphereIntVertex[aleatValueI];			
			intSpheres[idx] = WebGL_threeGenObjects.createObjectSphereColor(THREE,itemRadius,16,itemColor,itemPosition);
			
		}//end for
		
		for(let idx=0;idx<countItem;idx++){
			this.scene.add(intSpheres[idx]);
		}//end for
		
	}//end function			
	
	chargeLights(THREE) {
	    this.scene.add( new THREE.AmbientLight( 0xeeeeee));    
	    
	    
	    const lightF = new THREE.PointLight( 0xffeeee, 1, 300 );
		lightF.position.set(10, 0,30  );
		this.scene.add( lightF );
		
	    //const lightB = new THREE.PointLight( 0xffeeee, 1, 300 );
		//lightF.position.set(-100, 0,0  );
		//this.scene.add( lightB );		
		
	}//end function
		
	/*
		//this.xwing = new WebGL_dto(this,'data/cuartel/','xwing');
		//this.xwing.loadWglObject(THREE,this.scene,this.fbxLoader,this.textLoader,null);	
		
	let boxTest = WebGL_threeGenObjects.createObjectBox(THREE,5,[1,0,0],[0,0,0]);	
	let cubeGeometry = new THREE.BoxGeometry(5,5,5 );
	let cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	this.cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
	this.cube.name = 'cuboA';
	this.cube.position.x = 0;
	this.cube.position.y = 0;	
	this.cube.position.z = 0;		
	this.scene.add(this.cube);
	*/		
					
}//end class