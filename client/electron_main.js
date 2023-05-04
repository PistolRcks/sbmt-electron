const { app, BrowserWindow, dialog, ipcMain } = require("electron");

let win;
const createWindow = () => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        // holy shit this is so insecure
        nodeIntegration: true,
        contextIsolation: false,
      }
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

// really gross hack for selecting a directory because the `webkitdirectory` attribute doesn't work
ipcMain.on('select-dirs', async (e, name) => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  })
  win.webContents.send("selected-dirs", name, result.filePaths)
  console.log('directories selected', result.filePaths)
})
