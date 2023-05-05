import React, { useState } from "react";
import FolderInput from "./FolderInput";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { DataContext } from "../DataContext";

const { homedir, platform } = window.require("os");
const { ipcRenderer } = window.require("electron");

const STARBOUND_FOLDER_DEFAULTS = {
  win32: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Starbound",
  darwin: `${homedir()}/Library/Application Support/Steam/steamapps/common/Starbound`,
  linux: `${homedir()}/.steam/steam/steamapps/common/Starbound`,
};

export default function App() {
  // certain things to put in here; top-to-bottom
  // (check) Starbound folder link (folder button?); should be prefilled based on OS
  // (check) project folder link (folder button?); should have an example
  // (check, now for functionality) build button on the same layer as a build-and-run button
  // terminal output

  // use a State within a Context to get value state from the forms
  const [data, setData] = useState({ folderPath: STARBOUND_FOLDER_DEFAULTS[platform()], modPaths: [] });
  const val = { data, setData };

  const buildAndRun = (e) => {
    ipcRenderer.send("build", data.folderPath, data.modPaths, true);
  };

  const build = (e) => {
    ipcRenderer.send("build", data.folderPath, data.modPaths, false);
  }

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h3">Starbound Mod Tester</Typography>
      </Grid>
      <DataContext.Provider value={val}>
        <FolderInput
          name="Starbound Folder"
          type="sbFolder"
          defaultValue={STARBOUND_FOLDER_DEFAULTS[platform()]}
          hint="The location of the root of your Starbound folder"
        />
        <FolderInput name="Mod to Build" type="mod" idx={0} />
      </DataContext.Provider>
      {/* Can't figure out how to center this correctly, so guess what? I'm not gonna. 
          Also, it would be really fun to have a progressbar here, but I don't have time for that.*/}
      <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={buildAndRun}>
            Build and Run
          </Button>
          <Button variant="outlined" onClick={build}>
            Build
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
