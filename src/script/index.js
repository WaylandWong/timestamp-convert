'use-strict';
window.ipcRenderer.on('show', (event, message) => {
  if (document.activeElement.id != 'output') {
    input.focus();
    if (input.value.length==0) {
      input.value = Date.now();
    }
    select();
  }
});


/**
 *
 */
function onFocus() {
  if (input.value.length==0) {
    input.value = Date.now();
  }
  select();
  valueChange();
}

/**
 *
 */
function select() {
  input.select();
}

/**
 *
 */
function valueChange() {
  value = input.value;
  if (value.length == 10) {
    try {
      const timstamp = Number(value);
      output.value=getTimeStr(timstamp*1000);
    } catch (err) {
    }
  } else if (value.length == 13) {
    try {
      const timstamp = Number(value);
      output.value=getTimeStr(timstamp);
    } catch (err) {
    }
  } else {
    output.value='';
  }
}

/**
 *
 * @param {*} ev
 */
function keyUp(ev) {
  let currKey=0;
  const e=ev||event;
  currKey=e.keyCode||e.which||e.charCode;

  if (currKey == 27) {
    if (input.value.length>0 && document.activeElement.id == 'input') {
      input.value ='';
      output.value='';
    } else {
      window.ipcRenderer.send('esc');
      return;
    }
  }
}


/**
 *
 * get time as string
 * @param {*} timestamp
 * @return {void}
 */
function getTimeStr(timestamp) {
  const unixTimestamp = new Date(timestamp);
  return unixTimestamp.toISOString();
}

document.onkeyup = keyUp;
input = document.getElementById('input');
input.onfocus = onFocus();
output = document.getElementById('output');
input.oninput= valueChange;
