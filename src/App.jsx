import React, { useState } from "react"

import ApiKeyManager from "./components/ApiKeyManager"
import FileRenamer from "./components/FileRenamer"

function App() {
    const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "")

    return (
        <div className="p-10 max-w-screen-md mx-auto">
            <h1 className="text-lg font-semibold mb-5">File Renamer</h1>
            <FileRenamer apiKey={apiKey} />
            <hr className="my-6" />
            <ApiKeyManager apiKey={apiKey} setApiKey={setApiKey} />
        </div>
    )
}

export default App
