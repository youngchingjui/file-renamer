const { contextBridge, ipcRenderer } = require("electron")

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ["chrome", "node", "electron"]) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

contextBridge.exposeInMainWorld("electron", {
    send: (channel, data) => {
        // Whitelist channels
        let validChannels = ["response-text"] // Add any other channels you need
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain"] // Add any channels you expect to receive data from
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args))
        }
    },
    renameFile: ({ oldPath, newPath }) =>
        ipcRenderer.send("rename-file", { oldPath, newPath }),

    openFile: () => ipcRenderer.invoke("dialog:openFile"),
})
