import React, { useEffect, useState } from "react";
import "./App.css";
import Toolbar from "./Components/ToolBar/ToolBar";
import Folder from "./Components/Dir/Folder/Folder";
import File from "./Components/Dir/File/File";
const ipcRenderer = window.require("electron").ipcRenderer;

const navigate = (dirToNavigateTo, dirState, setDir, setLoading) => {
  let newDir = [...dirState];
  newDir.push(dirToNavigateTo + "\\");
  jumpTo(newDir, setDir, setLoading);
};

const jumpTo = (dir, setDir, setLoading) => {
  setDir(dir);
  setLoading(true);
  ipcRenderer.send("get-dirs", dir);
};

const openFile = (file, dirState) => {
  let fullPath = dirState.join("") + file;
  ipcRenderer.send("open-file", fullPath);
};

const goBack = (dirState, setDir) => {
  let dir = [...dirState];
  dir.pop();
  setDir(dir);
  ipcRenderer.send("get-dirs", dirState);
};

const LoadingWheel = () => {
  return (
    <div className="loading-wheel-container">
      <div className="loading-wheel" />
    </div>
  );
};

const setDirState = (dirs, setDirs, setLoading) => {
  setDirs(dirs);
  setLoading(false);
};

const newDirsEventHandler = (dirs, setDirs, setLoading) =>
  setDirState(dirs, setDirs, setLoading);

const App = () => {
  const [dirState, setDir] = useState([]);
  const [dirsState, setDirs] = useState([]);
  const [loadingState, setLoading] = useState(true);

  useEffect(() => {
    ipcRenderer.on("new-dir", (_e, dirs) =>
      newDirsEventHandler(dirs, setDirs, setLoading)
    );
    navigate("C:", [], setDir, setLoading);
    return ipcRenderer.removeListener("new-dir", newDirsEventHandler);
  }, []);

  return (
    <div className="app-container">
      <div className="controls-window-container">
        <Toolbar
          goBack={() => goBack(dirState, setDir)}
          dir={dirState}
          jumpTo={dir => jumpTo(dir, setDir, setLoading)}
        />
      </div>
      <div className="nav-window-container">
        {loadingState ? (
          <LoadingWheel />
        ) : (
          <div className="nav-window">
            {dirsState.map((dir, index) =>
              dir.type === "Dir" ? (
                <Folder
                  key={`dir-${index + 1}`}
                  navigate={dirToNavigateTo =>
                    navigate(dirToNavigateTo, dirState, setDir, setLoading)
                  }
                  dir={dir.name}
                />
              ) : (
                <File
                  key={`file-${index + 1}`}
                  openFile={file => openFile(file, dirState)}
                  file={dir.name}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
