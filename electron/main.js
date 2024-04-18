import path from "node:path"
import url from "node:url"

import { app, BrowserWindow, dialog, ipcMain } from "electron/main"
import fs from "fs"

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
    win.loadFile("public/index.html")
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

ipcMain.on("rename-file", (event, { oldPath, newPath }) => {
    console.log(oldPath, newPath)
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
            console.error("File rename error:", err)
            return
        }
        console.log(`File renamed from ${oldPath} to ${newPath}`)
    })
})

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled || filePaths.length === 0) {
        return { filePath: "", base64Image: "" }
    }

    const filePath = filePaths[0]
    const fileContents = fs.readFileSync(filePath)
    const base64Image = fileContents.toString("base64")
    return { filePath, base64Image }
}

ipcMain.handle("dialog:openFile", handleFileOpen)
