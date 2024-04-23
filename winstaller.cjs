const electronInstaller = require("electron-winstaller")

const appName = "file-renamer"
const version = "0.0.2"

console.log(`Creating installer for ${appName} ${version}`)

const resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: "/Users/youngchingjui/Projects/file-renamer/",
    authors: "Young and AI",
    exe: `${appName}.exe`,
    name: `${appName}`,
    version: version,
})

resultPromise.then(() => {
    console.log("Installer created successfully")
})
