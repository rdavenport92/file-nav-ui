const electron = require("electron");
const { dialog } = electron;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const ipc = electron.ipcMain;
const fs = require("fs");
const child_process = require("child_process");

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on("get-dirs", (e, dirArray) => {
  let dir = dirArray.join("");
  fs.readdir(dir, (err, files) => {
    if (err) {
      dialog.showErrorBox({
        title: "Error!",
        content: "Unable to access the selected folder"
      });
    } else {
      let formattedFiles = files
        .map(file => {
          try {
            return {
              name: file,
              type: fs.lstatSync(dir + file).isDirectory() ? "Dir" : "File"
            };
          } catch (e) {
            return;
          }
        })
        .filter(file => file);
      mainWindow.send("new-dir", formattedFiles);
    }
  });
});

ipc.on("open-file", (e, file) => {
  child_process.exec(`"${file}"`, (err, data) => {
    if (err) {
      console.log(err);
      dialog.showMessageBox({
        title: "Error",
        message: "The selected file can not be opened",
        type: "error"
      });
    }
  });
});
