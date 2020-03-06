'use-strict';
function padding(length, num){
   return (Array(length).join("0") + num).slice(-length);
}
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}        


window.ipcRenderer.on('show', (event, message) => {
    if (document.activeElement.id !== 'output') {
        if (input.value.length === 0) {
            input.value = Date.now();
        }
        input.focus();
        onFocus();
    }
});

window.ipcRenderer.on('uuid', (event, message) => {
    setOutputValue(message);
});


/**
 *
 */
function onFocus() {
    if (input.value.length === 0) {
        input.value = Date.now();
    }
    select();
    inputValueChange();
}

/**
 *
 */
function select() {
    input.select();
}

/**
 *
 * @param {*} value
 */
function setOutputValue(value) {
    output.value = value;
    input.title = value;
}

/**
 *
 */
function inputValueChange() {
    const uuidPattern = /^uuid.+v1|4/;
    const value = input.value;
    switch (value.length) {
        case 4:
            // uuid v4
            if (value === "uuid") {
                const outValue = uuid('v4');
                setOutputValue(outValue);
            }
            break;
        case 7:
            //uuid v1 or v4
            const index = value.search(uuidPattern);
            if (index >= 0) {
                if (value.includes("v4")) {
                    const outValue = uuid('v4');
                    setOutputValue(outValue);
                } else if (value.includes("v1")) {
                    const outValue = uuid('v1');
                    setOutputValue(outValue);
                }
            }
            break;
        case 10:
            try {
                const timestamp = Number(value);
                const inValue = getTimeStr(timestamp * 1000);
                setOutputValue(inValue);
            } catch (err) {
            }
            break;
        case 13:
            try {
                const timestamp = Number(value);
                const inValue = getTimeStr(timestamp);
                setOutputValue(inValue);
            } catch (err) {
            }
            break;
        default:
            output.value = '';
    }
}


/**
 *
 */
function outputValueChange() {
    const value = output.value;
    try {
        const unixTimeZero = Date.parse(value);
        if (!Number.isNaN(unixTimeZero)) {
            input.value = unixTimeZero;
            input.title = value;
        }
    } catch (err) {
    }
}

/**
 *
 * @param {*} ev
 */
function keyUp(ev) {
    let currKey = 0;
    const e = ev || event;
    currKey = e.keyCode || e.which || e.charCode;

    if (currKey === 27) {
        if (input.value.length > 0 && document.activeElement.id === 'input') {
            input.value = '';
            output.value = '';
        } else {
            window.ipcRenderer.send('esc');
        }
    }
}

/**
 * generate uuid
 */
function uuid(version) {
    window.ipcRenderer.send('uuid', version);
}

/**
 *
 * get time as string
 * @param {*} timestamp
 * @return string
 */
function getTimeStr(timestamp) {
    const unixTimestamp = new Date(timestamp);
    return unixTimestamp.format("yyyy-MM-dd hh:mm:ss")
}

document.onkeyup = keyUp;
input = document.getElementById('input');
output = document.getElementById('output');

input.onfocus = onFocus();
input.oninput = inputValueChange;

output.oninput = outputValueChange;
