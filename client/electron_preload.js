const { contextBridge } = require("electron");
const os = require("os");

// We can't use node functions in the client thread, but we *can* pass it forward from the renderer to the client
contextBridge.exposeInMainWorld("sys", {
  homedir: os.homedir(),
  platform: os.platform()  
});
