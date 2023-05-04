import { Grid, TextField, IconButton, InputAdornment } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import React, { useEffect, useState } from "react";

const { ipcRenderer } = window.require("electron");

/**
 * Renders a TextField with a folder input button adornment at the end.
 * @prop name - The name of the input
 * @prop hint - The hint that displays at the bottom of the TextField (also called helperText)
 * @prop defaultValue - The default value of the TextField
 * @returns the component
 */
export default function FolderInput({ name, hint, defaultValue }) {
  const [inputVal, setInputVal] = useState(defaultValue);

  const handleDirUpdate = (e, sentName, dirs) => {
    // make sure that we were the one sending this
    if (sentName === name) {
      setInputVal(dirs[0]);
    }
  };

  useEffect(() => {
    ipcRenderer.on("selected-dirs", handleDirUpdate);
    return () => {
      ipcRenderer.removeListener("selected-dirs", handleDirUpdate);
    };
  }, []);

  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        label={name}
        helperText={hint}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment>
                <IconButton
                  color="primary"
                  component="label"
                  onClick={() => {
                    // really gross hack because electron doesn't let you select directories
                    ipcRenderer.send("select-dirs", name);
                  }}
                >
                <FolderOutlinedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
}
