import { Grid, TextField, IconButton, InputAdornment } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import React, { useEffect, useState } from "react";

const { ipcRenderer } = window.require("electron");

/**
 * Renders a TextField with a file input button adornment at the end.
 * @prop name - The name of the input
 * @prop hint - The hint that displays at the bottom of the TextField (also called helperText)
 * @prop placeholder - The placeholder text which will be in the TextField
 * @returns the component
 */
export default function FileInput({ name, hint, placeholder }) {
  const [inputVal, setInputVal] = useState("");

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
        placeholder={placeholder}
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
