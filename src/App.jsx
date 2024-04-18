import React, { useState } from "react"

import FileRenamer from "./components/FileRenamer"

function App() {
    const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "")

    const saveAPIKey = () => {
        localStorage.setItem("apiKey", apiKey)
    }

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-lg font-semibold mb-5">File Renamer</h1>
            <FileRenamer apiKey={apiKey} />
            <hr className="my-6" />
            <div>
                <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="api-key-input"
                >
                    OpenAI API Key
                </label>
                <input
                    type="text"
                    id="api-key-input"
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                    className="w-full px-4 py-2 2 mb-2 border border-gray-300 rounded"
                    placeholder="Paste your API Key here"
                />
                <button
                    id="api-key-button"
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition-colors"
                    onClick={saveAPIKey}
                >
                    Save API Key
                </button>
            </div>
        </div>
    )
}

export default App
