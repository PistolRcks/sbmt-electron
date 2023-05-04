import React from "react";
import FileInput from "./FileInput";

const STARBOUND_FOLDER_DEFAULTS = {
  win32 : "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Starbound",
  darwin : `${sys.homedir}/Library/Application Support/Steam/steamapps/common/Starbound`,
  linux : `${sys.homedir}/.steam/steam/steamapps/common/Starbound`
}

export default function App() {
  // certain things to put in here; top-to-bottom
  // Starbound folder link (folder button?); should be prefilled based on OS
  // project folder link (folder button?); should have an example
  // build button on the same layer as a build-and-run button
  // terminal output
  console.log(sys)

  return (
    <div>
      {/* Should be a container or some actual Grid type object here */}
      <h1>
        Here is my Electron app!
      </h1>
      <FileInput name="Starbound Folder" placeholder={STARBOUND_FOLDER_DEFAULTS[sys.platform]} hint="The location of the root of your Starbound folder" />
      <FileInput name="Mod to Build" placeholder="" hint="" />
    </div>
  )
}