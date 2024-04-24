import PropTypes from "prop-types"
import React, { useState } from "react"

import { pdfToImageBase64 } from "../lib/utils"

const FileRenamer = ({ apiKey }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [responseText, setResponseText] = useState("")
    const [fileInfo, setFileInfo] = useState({
        name: "No file selected",
        base64Data: "",
        fileType: "",
    })
    const [filenameFormat, setFilenameFormat] = useState("")
    const [imageSrc, setImageSrc] = useState("")

    const openFile = async () => {
        setResponseText("")
        const { filePath, base64Data, fileType } =
            await window.electron.openFile() // Use Dialog from main.js to open file, so we get full file path

        if (!filePath) return

        try {
            let imageBase64, mimeType
            switch (fileType) {
                case ".pdf":
                    const result = await pdfToImageBase64(base64Data)
                    imageBase64 = result.base64ImageData
                    mimeType = result.mimeType
                    break
                case ".jpg":
                case ".png":
                case ".jpeg":
                    imageBase64 = base64Data
                    break
                default:
                    throw new Error("Unsupported file type")
            }

            setImageSrc(mimeType + "," + imageBase64)
            setFileInfo({
                name: filePath.split("/").pop(),
                base64Data: imageBase64,
                filePath,
                fileType,
            })
        } catch (error) {
            setResponseText(`❌ ${error.message}`)
        }
    }

    const handleRunScript = async () => {
        setResponseText("")
        setIsLoading(true)
        if (!fileInfo.base64Data) {
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
                            text: `Suggest a file name for this image. Only give 1 suggested name. Don't provide any file extension. Use spaces " ", not underscores "_".${
                                filenameFormat
                                    ? " Use this format: '" +
                                      filenameFormat +
                                      "'."
                                    : "Suggest a most sensible file name format."
                            }`,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${fileInfo.base64Data}`,
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
            const newPath = `${directoryPath}${newFileName}.${fileInfo.fileType}`
            window.electron.renameFile({ oldPath: fileInfo.filePath, newPath })
        } catch (error) {
            setResponseText(`❌ Error: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex">
            <div
                className="flex-grow w-1/2 p-4 min-h-[300px] flex flex-col cursor-pointer"
                onClick={openFile}
            >
                {imageSrc ? (
                    <img src={imageSrc} />
                ) : (
                    <div className="flex-grow mb-8 p-5 bg-gray-100 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-center">
                        {fileInfo.name ? (
                            <div id="fileInfo">{fileInfo.name}</div>
                        ) : (
                            <label htmlFor="fileUpload">Upload file</label>
                        )}
                    </div>
                )}
            </div>
            <div className="flex-none p-4">
                <label
                    htmlFor="filenameFormat"
                    className="block text-sm font-medium text-gray-700"
                >
                    Desired filename format (optional)
                </label>
                <input
                    id="filenameFormat"
                    type="text"
                    value={filenameFormat}
                    onChange={(e) => setFilenameFormat(e.target.value)}
                    placeholder="e.g. '<YYYYMMDD> - <Description>'"
                    className="mb-4 px-4 py-2 border rounded w-full"
                />
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
            </div>
        </div>
    )
}

FileRenamer.propTypes = {
    apiKey: PropTypes.string.isRequired,
}

export default FileRenamer
