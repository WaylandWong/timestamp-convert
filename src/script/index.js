'use-strict';
window.ipcRenderer.on('show', (event, message) => {
	if(document.activeElement.id != 'output'){
		input.focus()
		select()
	}
})

function select(){
	input.select()
}

function valueChange(){
	value = input.value
	if(value.length == 10){
		try{
			const timstamp = Number(value);
		  output.value=getTimeStr(timstamp*1000)
		}catch(err){
		}
	}
	else if(value.length == 13){
		try{
			const timstamp = Number(value);
			output.value=getTimeStr(timstamp)
		}catch(err){
		}
	}
	else{
		output.value=''
	}
}

function keyUp(e) { 
	var currKey=0,e=e||event; 
	currKey=e.keyCode||e.which||e.charCode; 
	
	if(currKey == 27){
		if(input.value.length>0 && document.activeElement.id == 'input'){
		  input.value =''
			output.value=''
		}else{
			window.ipcRenderer.send('esc')
			return
		}
	}
} 

function getTimeStr(timestamp){
		const unixTimestamp = new Date(timestamp) 
		return unixTimestamp.toLocaleString()
}

document.onkeyup = keyUp;
input = document.getElementById('input')
input.onfocus = select()
output = document.getElementById('output')
input.oninput= valueChange;