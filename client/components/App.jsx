import React from "react";
import FolderInput from "./FolderInput";
import { Button, Grid, Stack, Typography } from "@mui/material";

const { homedir, platform } = window.require("os")

const STARBOUND_FOLDER_DEFAULTS = {
  win32 : "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Starbound",
  darwin : `${homedir()}/Library/Application Support/Steam/steamapps/common/Starbound`,
  linux : `${homedir()}/.steam/steam/steamapps/common/Starbound`
}

export default function App() {
  // certain things to put in here; top-to-bottom
  // (check) Starbound folder link (folder button?); should be prefilled based on OS
  // (check) project folder link (folder button?); should have an example
  // build button on the same layer as a build-and-run button
  // terminal output

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h3">
          Starbound Mod Tester
        </Typography>
      </Grid>
      <FolderInput name="Starbound Folder" defaultValue={STARBOUND_FOLDER_DEFAULTS[platform()]} hint="The location of the root of your Starbound folder" />
      <FolderInput name="Mod to Build" />
      {/* Can't figure out how to center this correctly, so guess what? I'm not gonna. */}
      <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained">Build and Run</Button>
          <Button variant="outlined">Build</Button>
        </Stack>
      </Grid>
    </Grid>
  )
}