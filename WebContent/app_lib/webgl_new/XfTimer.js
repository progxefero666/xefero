
var exeIndex= 0;

//....................................................................................
//class XfTimer
//....................................................................................
class XfTimer{
	
	constructor(objListener,interval,id) {
		this.objListener = objListener;
		this.interval = interval;
		this.id = id;
		this.tid = null;
		this.exeIndex=0;						
	}
	
	run() {
		this.exeIndex= 1;
		this.tid = setInterval(executeTimerCode, this.interval)
		
		var objAlert = this.objListener;
		var thisObj = this;
		function executeTimerCode() {		
			objAlert.onAlert(thisObj.exeIndex,thisObj.id);	
			thisObj.exeIndex++;
			if(thisObj.exeIndex>1000){
				thisObj.exeIndex = 0;
			}			
		}
	}

	abort() {
		clearTimeout(this.tid);	 	
	}

} //End class XfTimer

