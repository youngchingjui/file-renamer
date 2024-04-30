import { notarize } from "@electron/notarize"

const options = {
    tool: "notarytool",
    appPath:
        "/Users/youngchingjui/Projects/file-renamer/out/make/zip/darwin/arm64/file-renamer.app",
    keychain: "",
    keychainProfile: "young.david319",
}
try {
    const notarizationResult = await notarize(options)
    console.log("Notarization success:", notarizationResult)
} catch (error) {
    console.error("Notarization error:", error)
    if (error.response) {
        console.log("Error status:", error.response.status)
        console.log("Error data:", error.response.data)
    } else {
        console.log("Error message:", error.message)
    }
}
