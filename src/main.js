// Modules to control application life and create native browser window
const {app, BrowserWindow,Menu,globalShortcut,ipcMain} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 60,
    webPreferences: {
      preload: path.join(__dirname, '/script/preload.js')
    },
    frame: false,
    darkTheme:true,
    transparent: false,
    center:true,
    resizable:false,
    alwaysOnTop: true,
    skipTaskbar: false,
    icon: path.join(__dirname, '../assets/timestamp.ico')
  })

  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, '../assets/timestamp.png'));
  }
  
  // and load the index.html of the app.
  mainWindow.loadFile('./src/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('blur',()=>{
    if (mainWindow.isVisible()){
      mainWindow.hide()
    }
  })

  mainWindow.on('show',()=>{
    mainWindow.webContents.send('show')
  })

  ipcMain.on('esc',(event,message)=>{
    if (mainWindow.isVisible()){
      app.dock.hide()
      mainWindow.hide()
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // app.dock.hide()

  createWindow()

  // gloabl shortcut
  globalShortcut.register('Alt+Space', () => {
    if (!mainWindow.isVisible()){
      mainWindow.show()
    }
  })
  // require('update-electron-app')()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// hide menus
// Menu.setApplicationMenu(null)


//  auto update
// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Restart', 'Later'],
//     title: 'Application Update',
//     message: process.platform === 'win32' ? releaseNotes : releaseName,
//     detail: 'A new version has been downloaded. Restart the application to apply the updates.'
//   }

//   dialog.showMessageBox(dialogOpts, (response) => {
//     if (response === 0) autoUpdater.quitAndInstall()
//   })
// })

// autoUpdater.on('error', message => {
//   console.error('There was a problem updating the application')
//   console.error(message)
// })