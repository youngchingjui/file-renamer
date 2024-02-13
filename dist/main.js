"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadFile("index.html");
    console.log("finished loading");
}
electron_1.app.on("ready", createWindow);
//# sourceMappingURL=main.js.map