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
      err: null,
      dirs: []
    };
  }

  componentDidMount() {
    this.navigate("C:\\");
    ipcRenderer.on("err", (e, err) => {
      this.setState({
        err
      });
    });
    ipcRenderer.on("new-dir", (e, dirs) => {
      this.setState({
        err: null,
        dirs
      });
    });
  }

  navigate = dir => {
    let newDir = [...this.state.dir];
    newDir.push(dir + "\\");
    this.setState({ dir: newDir }, () => {
      ipcRenderer.send("get-dirs", this.state.dir);
    });
  };

  openFile = file => {
    let fullPath = this.state.dir + "\\" + file;
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
    console.log(this.state.dir);
    return this.state.err ? (
      <div className="display-err">{this.state.err}</div>
    ) : (
      <div className="app-container">
        <div className="controls-window-container">
          <Toolbar goBack={this.goBack} dir={this.state.dir} />
        </div>
        <div className="nav-window-container">
          {this.state.dirs.map(dir =>
            dir.type === "Dir" ? (
              <Folder navigate={this.navigate} dir={dir.name} />
            ) : (
              <File openFile={this.openFile} file={dir.name} />
            )
          )}
        </div>
      </div>
    );
  }
}
