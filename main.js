const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { pathToFileURL } = require("url");

let serverProcess = null;
let mainWindow = null;

function startServer() {
  const serverPath = path.join(__dirname, "server", "server.js");
  if (!fs.existsSync(serverPath)) {
    console.error("Server entrypoint not found:", serverPath);
    return;
  }

  serverProcess = spawn("node", [serverPath], {
    cwd: path.join(__dirname, "server"),
    stdio: "inherit",
    env: Object.assign({}, process.env),
  });

  serverProcess.on("error", (err) => {
    console.error("Server process error:", err);
  });

  serverProcess.on("exit", (code, signal) => {
    console.log(`Server process exited with code ${code} signal ${signal}`);
  });
}

function getAppUrl() {
  const distIndex = path.join(__dirname, "client", "dist", "index.html");
  if (fs.existsSync(distIndex)) {
    return pathToFileURL(distIndex).href;
  }
  return "http://localhost:5173";
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    show: true,
    backgroundColor: "#000000",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const url = getAppUrl();
  console.log("Loading app URL:", url);
  mainWindow.loadURL(url);

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Page loaded successfully");
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    console.error("Failed to load URL", validatedURL, errorCode, errorDescription);
  });

  mainWindow.webContents.on("console-message", (event, level, msg, line, sourceId) => {
    console.log(`[Renderer] ${msg}`);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
