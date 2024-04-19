import PropTypes from "prop-types"
import React, { useState } from "react"

const FileRenamer = ({ apiKey }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [responseText, setResponseText] = useState("")
    const [fileInfo, setFileInfo] = useState({
        name: "No file selected",
        base64: "",
    })

    const openFile = async () => {
        setResponseText("")
        const { filePath, base64Image } = await window.electron.openFile()
        if (!filePath) return
        setFileInfo({
            name: filePath.split("/").pop(),
            base64: base64Image,
            filePath,
            extension: filePath.split(".").pop(),
        })
    }

    const handleRunScript = async () => {
        setResponseText("")
        setIsLoading(true)
        if (!fileInfo.base64) {
            console.log("No image selected")
            setIsLoading(false)
            return
        }
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        }

        const payload = {
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Suggest a file name for this image. Only give 1 suggested name. Don't provide any file extension. This image is likely the cover of a financial annual report. Use this format: '<STOCK TICKER SYMBOL> <YEAR> Annual Report'.",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${fileInfo.base64}`,
                            },
                        },
                    ],
                },
            ],
        }

        try {
            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(payload),
                }
            )

            const data = await response.json()
            const newFileName = data.choices[0].message.content
            setResponseText(`✅ File renamed to: ${newFileName}`)

            // Prepare to send new file name back to main
            const directoryPath = fileInfo.filePath.substring(
                0,
                fileInfo.filePath.lastIndexOf("/") + 1
            )
            const newPath = `${directoryPath}${newFileName}.${fileInfo.extension}`
            window.electron.renameFile({ oldPath: fileInfo.filePath, newPath })
        } catch (error) {
            setResponseText(`❌ Error: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div
                className="cursor-pointer mb-8 p-5 bg-gray-100 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-center"
                onClick={openFile}
            >
                {fileInfo.name ? (
                    <div id="fileInfo">{fileInfo.name}</div>
                ) : (
                    <label htmlFor="fileUpload">Upload file</label>
                )}
            </div>
            <button
                id="my-button"
                className="px-4 py-2 mb-5 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition-colors"
                onClick={handleRunScript}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="border-t-transparent border-solid animate-spin rounded-full border-white border-4 h-6 w-6"></div>
                ) : (
                    "Rename my file"
                )}
            </button>
            {responseText && (
                <div className="text-green-500 mt-2">{responseText}</div>
            )}
        </>
    )
}

FileRenamer.propTypes = {
    apiKey: PropTypes.string.isRequired,
}

export default FileRenamer
