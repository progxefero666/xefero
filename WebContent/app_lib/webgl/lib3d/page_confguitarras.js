//global variables

var stlcont_id ="stl_cont";
var activeMember = 'fenderstudioline';
var stlMonitorOn = false;

var activeColor = 'undefined';
var activeStlColor = '#000000';
var instrComponents = [];
var instrColors = [];
var selectIndex = -1;
var selectComponent = '';
var selectColor = '';
var selectId = '';
var selectColorIndex = 0;

function page_init() {
	storeActivePage('confguitarras');		
	//..............................................................
	/*if(localStorage.getItem('activeMember')!=null){
		activeMember = localStorage.getItem('activeMember');		
	}*/
	
	
	
	activeMember='fenderstudioline';	
	//..............................................................
	
	prepareControlBarProducts();

	$('#custom-select').on('selected.bselect', function(e,params){
		selectIndex = $('#custom-select').bselect("getSelected");
		selectId = parseInt(selectIndex) + 1;		
		selectComponent = instrComponents[selectIndex];
		activeStlColor = instrColors[selectIndex];
		selectColorIndex = getStlColorIndex(instrColors[selectIndex]);
		activeColor = getStlColorAlias(selectColorIndex);
		actualizeTableColors();		
	});
	
};//end function


function prepareByPlatform() {
	var vwidth = $(window).width();	
    if(vwidth< 600) {    	    	    	
        $('.layout_common').css('width', '96%');
    	$('.layout_mobile').css('width', '0%');
    	$('.container_not_mobile').css('display', 'none');
    	$('.container_mobile').css('display', 'block');
    }    			
    else{    	
        $('.layout_common').css('width', '70%');
    	$('.layout_mobile').css('width', '26%');
    	$('.container_not_mobile').css('display', 'block');
    	$('.container_mobile').css('display', 'none');
    }    
    
    var lyMonitorWidth = $('#stl_cont').width();    
    var lyCanvasWidth = Math.round(lyMonitorWidth);
    var cssMonitorHeight = lyCanvasWidth.toString().concat('px');    
    $('#stl_cont').css('height',cssMonitorHeight);    
    
    $('#custom-select-bselect').css('width', '90%');
    
    actualizeProductFile();
    
};//end function 


function prepareControlBarProducts() {
	
	$('#showproduct_fenderstudioline').click(function(){
		activeMember='fenderstudioline';		
		actualizeProductFile();
	});	
	$('#showproduct_fenderstratocaster').click(function(){
		activeMember='fenderstratocaster';
		actualizeProductFile();
	});	
	$('#showproduct_ibanezjem').click(function()  {
		activeMember='ibanezjem';
		actualizeProductFile();
	});	
	$('#showproduct_gibsonlespaul').click(function() {
		activeMember='gibsonlespaul';					
		actualizeProductFile();
	});	
	$('#showproduct_gibsonsg').click(function() {
		activeMember='gibsonsg';						
		actualizeProductFile();
	});		

	
	$('#color_negro').click(function(){
		activeColor='negro';console.log(activeColor);
		instrColors[selectIndex] = '#141414';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	
	$('#color_blanco').click(function(){'#FFFFFF'		
		activeColor='blanco';console.log(activeColor);
		instrColors[selectIndex] = '#FFFFFF';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	
	$('#color_plateado').click(function(){
		activeColor='plateado';console.log(activeColor);
		instrColors[selectIndex] = '#c4c3c3';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	
	$('#color_dorado').click(function(){
		activeColor='dorado';console.log(activeColor);
		instrColors[selectIndex] = '#f3c802';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	
	$('#color_bronce').click(function(){
		activeColor='bronce';console.log(activeColor);
		instrColors[selectIndex] = '#ef4e0e';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	

	$('#color_rojo').click(function(){
		activeColor='rojo';console.log(activeColor);
		instrColors[selectIndex] = '#FF0000';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	
	$('#color_cereza').click(function(){
		activeColor='cereza';console.log(activeColor);
		instrColors[selectIndex] = '#590817';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	
	$('#color_verde').click(function(){
		activeColor='verde';console.log(activeColor);
		instrColors[selectIndex] = '#02cc3b';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	
	$('#color_azul').click(function(){
		activeColor='azul';console.log(activeColor);
		instrColors[selectIndex] = '#0c79e9';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	
	$('#color_amarillo').click(function(){
		activeColor='amarillo';console.log(activeColor);	
		instrColors[selectIndex] = '#f5f801';
		stl_viewer.set_color(selectId, instrColors[selectIndex]);
		actualizeTableColors();
	});	
	
	
};//end function

function actualizeProductFile() {	
	
	//actualizeToolbarProducts(); 	
	///$('#prod_name').html(''.concat(capitalize(activeMember)));	
    
	if(!stlMonitorOn){
    	stlMonitorOn = true;
    	loadStlModelComplete();
    }
    else {
    	reloadStlModelComplete();	
    }    
};//end function


/*.........................................................................
stl code tablePiezes
.........................................................................*/
function readStlCatalogMember(member) {
	var fileCat = 'catalog_'.concat(member).concat('.json'); 
	var file_path = document.URL.substring(0,document.URL.lastIndexOf('/'))
		.concat('/guitarras/').concat(fileCat);			
	console.log(file_path);
	return readJSonObject(file_path);	
};//end function

function loadStlModelComplete(){
	var catalogObj = readStlCatalogMember(activeMember);
	
	instrComponents = getInstComponents(catalogObj);
	instrColors 	= getModelsColors(catalogObj.models);
	
	$('#custom-select').bselect({
		  data : instrComponents
		});
	stl_viewer = createHomeStlViewer(stlcont_id,catalogObj.models);
	
};//end function

function reloadStlModelComplete() {	
	var catalogObj = readStlCatalogMember(activeMember);
	instrComponents = getInstComponents(catalogObj);
	instrColors 	= getModelsColors(catalogObj.models);	
	$('#custom-select').bselect({
		  data : instrComponents
		});	
	stl_viewer.clean();
	stl_viewer.add_models(catalogObj.models);	
};//end function

function getFilterModels(arrayModels){
	var arrayModelsRes = [];
	for(var idx=0;idx<arrayModels.length;idx++){
		var elemId =arrayModels[idx].id;		
		if(tablePiezes.includes(elemId)){
			arrayModelsRes.push(arrayModels[idx]);
		}
	}
	return arrayModelsRes;
};//end function

function actualizeTableColors(){

	if($('#color_negro').hasClass('container_color_selected')) {
		$('#color_negro').removeClass('container_color_selected');
		$('#color_negro').addClass('container_color');	
	}

	if($('#color_blanco').hasClass('container_color_selected')) {
		$('#color_blanco').removeClass('container_color_selected');
		$('#color_blanco').addClass('container_color');	
	}
	if($('#color_plateado').hasClass('container_color_selected')) {
		$('#color_plateado').removeClass('container_color_selected');
		$('#color_plateado').addClass('container_color');	
	}
	if($('#color_dorado').hasClass('container_color_selected')) {
		$('#color_dorado').removeClass('container_color_selected');
		$('#color_dorado').addClass('container_color');	
	}
	if($('#color_bronce').hasClass('container_color_selected')) {
		$('#color_bronce').removeClass('container_color_selected');
		$('#color_bronce').addClass('container_color');	
	}
	if($('#color_rojo').hasClass('container_color_selected')) {
		$('#color_rojo').removeClass('container_color_selected');
		$('#color_rojo').addClass('container_color');	
	}
	if($('#color_cereza').hasClass('container_color_selected')) {
		$('#color_cereza').removeClass('container_color_selected');
		$('#color_cereza').addClass('container_color');	
	}
	if($('#color_verde').hasClass('container_color_selected')) {
		$('#color_verde').removeClass('container_color_selected');
		$('#color_verde').addClass('container_color');	
	}
	if($('#color_azul').hasClass('container_color_selected')) {
		$('#color_azul').removeClass('container_color_selected');
		$('#color_azul').addClass('container_color');	
	}
	if($('#color_amarillo').hasClass('container_color_selected')) {
		$('#color_amarillo').removeClass('container_color_selected');
		$('#color_amarillo').addClass('container_color');	
	}

	switch(activeColor) {	
	  case 'negro':
		  $('#color_negro').addClass('container_color_selected');break;	    
	  case 'blanco': 
		  $('#color_blanco').addClass('container_color_selected');break;  
	  case 'plateado':	 
		  $('#color_plateado').addClass('container_color_selected');break;   		
	  case 'dorado':	 
		  $('#color_dorado').addClass('container_color_selected');break;
	  case 'bronce':  
		  $('#color_bronce').addClass('container_color_selected');break;

	  case 'rojo':  
		  $('#color_rojo').addClass('container_color_selected');break;
	  case 'cereza':  
		  $('#color_cereza').addClass('container_color_selected');break;
	  case 'verde':  
		  $('#color_verde').addClass('container_color_selected');break;
	  case 'azul':  
		  $('#color_azul').addClass('container_color_selected');break;
	  case 'amarillo':  
		  $('#color_amarillo').addClass('container_color_selected');break;
		  
	  default: break;    
	}//end switch	
		
};//end function

function actualizeToolbarProducts() {
	
	if($('#showproduct_fenderstudioline').hasClass('container_pres_mini_img_active')) {
		$('#showproduct_fenderstudioline').removeClass('container_pres_mini_img_active');
		$('#showproduct_fenderstudioline').addClass('container_pres_mini_img');	
	}
	if($('#showproduct_fenderstratocaster').hasClass('container_pres_mini_img_active')) {
		$('#showproduct_fenderstratocaster').removeClass('container_pres_mini_img_active');
		$('#showproduct_fenderstratocaster').addClass('container_pres_mini_img');
	}
	if($('#showproduct_ibanezjem').hasClass('container_pres_mini_img_active')) {
		$('#showproduct_ibanezjem').removeClass('container_pres_mini_img_active');
		$('#showproduct_ibanezjem').addClass('container_pres_mini_img');
	}
	if($('#showproduct_gibsonlespaul').hasClass('container_pres_mini_img_active')) {
		$('#showproduct_gibsonlespaul').removeClass('container_pres_mini_img_active');		
		$('#showproduct_gibsonlespaul').addClass('container_pres_mini_img');
	}
	if($('#showproduct_gibsonsg').hasClass('container_pres_mini_img_active')) {
		$('#showproduct_gibsonsg').removeClass('container_pres_mini_img_active');		
		$('#showproduct_gibsonsg').addClass('container_pres_mini_img');
	}
	
	switch(activeMember) {	
	  case 'fenderstudioline':
		  $('#showproduct_fenderstudioline').addClass('container_pres_mini_img_active');break;	    
	  case 'fenderstratocaster': 
		  $('#showproduct_fenderstratocaster').addClass('container_pres_mini_img_active');break;  
	  case 'ibanezjem':	 
		  $('#showproduct_ibanezjem').addClass('container_pres_mini_img_active');break;   		
	  case 'gibsonlespaul':	 
		  $('#showproduct_gibsonlespaul').addClass('container_pres_mini_img_active');break;
	  case 'gibsonsg':  
		  $('#showproduct_gibsonsg').addClass('container_pres_mini_img_active');break;
	  default: break;    
	}//end switch	
	
};//end function


/*
$('#custom-select').bselect({

  // enable/disable live search
  search : true,

  // the width of the dropdown
  width : "200px",

  // custom placeholder text
  defaultText : "Select me",

  // additional CSS classes
  className : "",

  // input name
  inputName : "bselect-input",

  // selected index on init
  selected : 0,

  // open the dropdown on init
  opened : false,

  // close the dropdown after an options is selected
  closeOnSelect : true,

  // render dropdown list above the select element if dropdown will not be in view
  checkInView : true,

  // enable multiple select
  multiple : false,

  // close on select
  closeOnSelect : true,

  // enable/disable ellipsis
  elipsis : true,

  // in ms
  focusDelay : 100,

  // in ms
  doneTypingInterval : 180

});
 */

/*
 
 $('#custom-select').on('open.bselect', function(e,params){
  // on open
});

$('#custom-select').on('opened.bselect', function(e,params){
  // after open
});

$('#custom-select').on('close.bselect', function(e,params){
  // on close
});

$('#custom-select').on('closed.bselect', function(e,params){
  // after close
});

$('#custom-select').on('toggle.bselect', function(e,params){
  // on toggle
});

$('#custom-select').on('toggled.bselect', function(e,params){
  // after toggle
});

$('#custom-select').on('select.bselect', function(e,params){
  // start selecting options
});


$('#custom-select').on('up<a href="https://www.jqueryscript.net/time-clock/">date</a>d.bselect', function(e,params){
  // after the dropdown is updated
});

$('#custom-select').on('unselected.bselect', function(e,params){
  // after an item is unselected
});

 API methods.
// open the dropdown
$('#custom-select').bselect("open");

// close the dropdown
$('#custom-select').bselect("close");

// toggle the dropdown
$('#custom-select').bselect("toggle");

// select an option by ID
$('#custom-select').bselect("selectById", 2);

// get the selected option
$('#custom-select').bselect("getSelected");

// append a new option
$('#custom-select').bselect("append", 4, "HTML5");

// prepend an option
$('#custom-select').bselect("prepend", 5, "CSS3");

// get disabled
$('#select-box').bselect("getDisabled");

// disable all elements
$('#select-box').bselect("disableAll");

// disable an option
$('#select-box').bselect("disable", 8);

// enable an option
$('#select-box').bselect("enable", 8);

// enable all options
$('#select-box').bselect("enableAll");

// is selected option
$('#select-box').bselect("selected", 8);

// is disabled option
$('#select-box').bselect("disabled", 8);

// select all
$('#select-box').bselect("selectAll")

// deselect all
$('#select-box').bselect("deselectAll")

// deselect item  
 
 
 */

