const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const { execFile, execFileSync } = require("child_process");
const { readdirSync, rmSync } = require("fs");

const slash = process.platform === "win32" ? "\\" : "/";

// gross to be using globals, but whatever
let loadingSteps = 0;
let currentLoadingSteps = 0;
let win;

function main() {
  const createWindow = () => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        // holy shit this is so insecure
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    win.loadFile("public/index.html");
    win.removeMenu()
  };

  app.whenReady().then(() => {
    createWindow();

    // weird workaround for MacOS
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  // really gross hack for selecting a directory because the `webkitdirectory` attribute doesn't work
  ipcMain.on("select-dirs", async (e, name) => {
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
    win.webContents.send("selected-dirs", name, result.filePaths);
    //console.log("directories selected", result.filePaths);
  });

  ipcMain.on("build", async (e, sbFP, modFPs, runAfter) => {
    //console.log("sbFP: " + sbFP + ", modFPs[0]: " + modFPs[0]);
    // build mods + [load game + cleanup mods] + end = total number of steps
    loadingSteps = modFPs.length + (runAfter ? 1 + modFPs.length : 0) + 1
    currentLoadingSteps = 0

    buildAll(sbFP, modFPs, runAfter);

    // run the game if we wanna
    if (runAfter) {
      let file;
      if (process.platform === "linux") {
        file = [sbFP, "linux", "run-client.sh"].join(slash);
      } else if (process.platform === "win32") {
        file = [sbFP, "win64", "starbound.exe"].join(slash);
      } else if (process.platform === "darwin") {
        // lmao idk what to do here
      }

      console.log("start : Running the game...")
      win.webContents.send("loading-update", norm(++currentLoadingSteps), "start : Running the game...")
      execFile(file, [], {}, (err, stdout, stderr) => {
        // clean up temp files afterwards
        const modsFolder = sbFP + slash + "mods"
        const mods = readdirSync(modsFolder)
        for (const mod of mods) {
          if (mod.endsWith(".tmp.pak")) {
            const modFP = modsFolder + slash + mod
            rmSync(modFP)
            console.log(`cleanup : Successfully cleaned up ${modFP}`)
            win.webContents.send("loading-update", norm(++currentLoadingSteps), `cleanup : Successfully cleaned up ${modFP}`)
          }
        }
        console.log(`finish : All done!`)
        win.webContents.send("loading-update", norm(++currentLoadingSteps), `finish : All done!`)
      });
    } else {

    console.log(`finish : All done!`)
    win.webContents.send("loading-update", norm(++currentLoadingSteps), `finish : All done!`)
    }
  });
}

function norm(currentStep) {
  return currentStep / loadingSteps * 100
}

/**
 * Builds a set of mods, then sends them to Starbound (optionally)
 * @param {String} sbFP - The filepath to the Starbound root
 * @param {Array<String>} modFPs - An Array containing filepaths to the folders of the mods to build
 * @param {Boolean} sendToMods - Defines whether or not we should send the mods to the "mods" folder for Starbound
 */
function buildAll(sbFP, modFPs, sendToMods) {
  const targetFP = sendToMods ? sbFP + slash + "mods" : process.cwd();
  for (const modFP of modFPs) {
    try {
      buildOne(sbFP, modFP, targetFP);
    } catch (e) {
      win.webContents.send("loading-update", norm(++currentLoadingSteps), e.message)
      console.error(e.message);
    }
  }
}

/**
 * Builds a singular mod, then sends it to Starbound
 * @param {String} sbFP - The filepath to the Starbound root
 * @param {String} modFP - The filepath to the folder of the mod to build
 * @param {String} targetFP - The filepath to the target folder in which to place the built mod
 * @throws {Error} if a required portion of mod is not found
 */
function buildOne(sbFP, modFP, targetFP) {
  // pretty sure this it isn't sbFP/darwin/asset_packer on Mac (it might be macos), but I don't have the time
  // to download the Macos version and check
  const packerFP = [
    sbFP,
    process.platform,
    "asset_packer" + (process.platform === "win32" ? ".exe" : ""),
  ].join(slash);
  // get the folder name from the modFP
  const folderName = modFP.slice(modFP.search(/(?<=\\|\/)(?:.(?!\\|\/))+$/));

  //console.log(`packerFP: ${packerFP}`);
  //console.log(`folderName: ${folderName}`)

  // check that folder has necessary contents, throw error if needed
  const contents = readdirSync(modFP);
  if (contents.length === 0) {
    throw Error(`mod_build : ${modFP} : Folder is empty`);
  }
  if (!contents.includes("_metadata")) {
    throw Error(`mod_build : ${modFP} : Does not contain necessary file "_metadata"`);
  }
  if (!contents.includes("pak.modinfo")) {
    throw Error(`mod_build : ${modFP} : Does not contain necessary file "pak.modinfo"`);
  }

  // now actually build
  // format is `./asset_packer [mod_folder] [target_folder]`
  // must run in shell because of how we're handling odd file names; very unsanitized and insecure
  execFileSync(`"${packerFP}" "${modFP}" "${targetFP + slash + folderName + ".tmp.pak"}"`, [], {shell: true});

  win.webContents.send("loading-update", norm(++currentLoadingSteps), `mod_build : ${modFP} : Successfully built`)
  console.log(`mod_build : ${modFP} : Successfully built`);
}

main();
