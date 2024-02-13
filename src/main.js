const { app, BrowserWindow } = require("electron/main")

let win

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    win.loadFile("index.html")
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
