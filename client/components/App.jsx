import React from "react";
import FileInput from "./FileInput";
import { Grid, Typography } from "@mui/material";

const { homedir, platform } = window.require("os")

const STARBOUND_FOLDER_DEFAULTS = {
  win32 : "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Starbound",
  darwin : `${homedir()}/Library/Application Support/Steam/steamapps/common/Starbound`,
  linux : `${homedir()}/.steam/steam/steamapps/common/Starbound`
}

export default function App() {
  // certain things to put in here; top-to-bottom
  // Starbound folder link (folder button?); should be prefilled based on OS
  // project folder link (folder button?); should have an example
  // build button on the same layer as a build-and-run button
  // terminal output

  return (
    <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3">
            Starbound Mod Tester
          </Typography>
        </Grid>
        <FileInput name="Starbound Folder" defaultValue={STARBOUND_FOLDER_DEFAULTS[platform()]} hint="The location of the root of your Starbound folder" />
        <FileInput name="Mod to Build" />
    </Grid>
  )
}