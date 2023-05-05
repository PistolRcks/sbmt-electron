import { LinearProgress, Typography, Grid, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";

const { ipcRenderer } = window.require("electron");

export default function LoaderProgressBar() {
  const [progress, setProgress] = useState(0.0);
  const [text, setText] = useState("");

  const handleLoadingUpdate = (e, _progress, _text) => {
    setProgress(_progress);
    setText(_text);
  };

  useEffect(() => {
    ipcRenderer.on("loading-update", handleLoadingUpdate);
    return () => {
      ipcRenderer.removeListener("loading-update", handleLoadingUpdate);
    };
  }, []);

  return (
    <Grid item xs={12}>
      <Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
        />
        <Typography variant="overline" color="info" gutterBottom>
          {text}
        </Typography>
      </Stack>
    </Grid>
  );
}
