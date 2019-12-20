'use-strict';
window.ipcRenderer.on('show', (event, message) => {
  if (document.activeElement.id != 'output') {
    if (input.value.length==0) {
      input.value = Date.now();
    }
    input.focus();
    onFocus();
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
 * @param {*} timstamp
 */
function setOutputValue(timstamp) {
  value = getTimeStr(timstamp);
  output.value = value;
  input.title = value;
}
/**
 *
 */
function inputValueChange() {
  value = input.value;
  if (value.length == 10) {
    try {
      const timstamp = Number(value);
      setOutputValue(timstamp*1000);
    } catch (err) {}
  } else if (value.length == 13) {
    try {
      const timestamp = Number(value);
      setOutputValue(timestamp);
    } catch (err) {}
  } else {
    output.value='';
  }
}


/**
 *
 */
function outputValueChange() {
  value = output.value;
  try {
    const unixTimeZero = Date.parse(value);
    if (!Number.isNaN(unixTimeZero)) {
      input.value = unixTimeZero;
      input.title = value;
    }
  } catch (err) {}
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
output = document.getElementById('output');

input.onfocus = onFocus();
input.oninput= inputValueChange;

output.oninput = outputValueChange;

