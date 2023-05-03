const { app, BrowserWindow } = require("electron");

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })
  
    win.loadFile('public/index.html')
}

app.whenReady().then(() => {
    createWindow()

    // weird workaround for MacOS
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})