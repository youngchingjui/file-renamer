import PropTypes from "prop-types"
import React, { useState } from "react"

const ApiKeyManager = ({ apiKey, setApiKey }) => {
    const [isEditing, setIsEditing] = useState(false)

    const handleEdit = () => {
        if (isEditing) {
            localStorage.setItem("apiKey", apiKey)
            setIsEditing(false)
        } else {
            setIsEditing(true)
        }
    }

    const maskedAPIKey = (keyString) => {
        if (!keyString) {
            return ""
        }

        return keyString.substring(0, 11) + Array(20).fill("•").join("")
    }

    return (
        <div>
            <label
                className="block text-sm font-medium mb-2"
                htmlFor="api-key-input"
            >
                OpenAI API Key
            </label>
            <div className="flex justify-between items-center w-full gap-2">
                <input
                    type="text"
                    id="api-key-input"
                    value={isEditing ? apiKey : maskedAPIKey(apiKey)}
                    onChange={(event) => setApiKey(event.target.value)}
                    className={`w-full px-4 py-2 2 border border-gray-300 rounded ${
                        !isEditing &&
                        "cursor-not-allowed bg-gray-200 text-gray-400"
                    }`}
                    placeholder="Paste your OpenAI API key here"
                    disabled={!isEditing}
                />
                <button
                    onClick={handleEdit}
                    id="edit-api-key-button"
                    className={`px-4 py-2 min-w-24 border rounded transition-colors self-end ${
                        isEditing
                            ? "bg-indigo-500 text-white hover:bg-indigo-400 "
                            : "border-gray-500 text-gray-500 hover:bg-gray-100"
                    }`}
                >
                    {isEditing ? "Save" : "Edit"}
                </button>
            </div>
        </div>
    )
}

ApiKeyManager.propTypes = {
    apiKey: PropTypes.string.isRequired,
    setApiKey: PropTypes.func.isRequired,
}

export default ApiKeyManager
