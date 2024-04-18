import path from "node:path"
import url from "node:url"

import { app, BrowserWindow, ipcMain } from "electron/main"

let win
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            nativeWindowOpen: true,
        },
    })
    win.loadFile("dist/index.html")
    console.log("finished loading")
}

app.whenReady().then(() => {
    createWindow()

    // Create a new window on Mac if none are open
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Quit when all windows are closed, except on Mac
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

ipcMain.on("response-text", (event, text) => {
    console.log(text)
})
