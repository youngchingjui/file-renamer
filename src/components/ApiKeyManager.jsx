import PropTypes from "prop-types"
import React from "react"

const ApiKeyManager = ({ apiKey, setApiKey }) => {
    const saveAPIKey = () => {
        localStorage.setItem("apiKey", apiKey)
    }

    return (
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
    )
}

ApiKeyManager.propTypes = {
    apiKey: PropTypes.string.isRequired,
    setApiKey: PropTypes.func.isRequired,
}

export default ApiKeyManager
