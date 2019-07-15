import React, { Component } from "react";
import "./App.css";
import Toolbar from "./Components/ToolBar/ToolBar";
import Folder from "./Components/Dir/Folder/Folder";
import File from "./Components/Dir/File/File";
const ipcRenderer = window.require("electron").ipcRenderer;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dir: [],
      dirs: []
    };
  }

  componentDidMount() {
    this.navigate("C:");
    ipcRenderer.on("new-dir", (e, dirs) => {
      this.setState({
        dirs,
        loading: false
      });
    });
  }

  jumpTo = dir => {
    this.setState({ dir, loading: true }, () => {
      ipcRenderer.send("get-dirs", this.state.dir);
    });
  };

  navigate = dir => {
    let newDir = [...this.state.dir];
    newDir.push(dir + "\\");
    this.jumpTo(newDir);
  };

  openFile = file => {
    let fullPath = this.state.dir.join("") + file;
    ipcRenderer.send("open-file", fullPath);
  };

  goBack = () => {
    let dir = [...this.state.dir];
    dir.pop();
    this.setState({ dir }, () => {
      ipcRenderer.send("get-dirs", this.state.dir);
    });
  };

  render() {
    return (
      <div className="app-container">
        <div className="controls-window-container">
          <Toolbar
            goBack={this.goBack}
            dir={this.state.dir}
            jumpTo={this.jumpTo}
          />
        </div>
        <div className="nav-window-container">
          {this.state.loading ? (
            <LoadingWheel />
          ) : (
            <div className="nav-window">
              {this.state.dirs.map(dir =>
                dir.type === "Dir" ? (
                  <Folder navigate={this.navigate} dir={dir.name} />
                ) : (
                  <File openFile={this.openFile} file={dir.name} />
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const LoadingWheel = () => {
  return (
    <div className="loading-wheel-container">
      <div className="loading-wheel" />
    </div>
  );
};
