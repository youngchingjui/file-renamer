import PropTypes from "prop-types"
import React, { useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { pdfToImageBase64 } from "../lib/utils"

const FileRenamer = ({ apiKey }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [responseText, setResponseText] = useState({ message: "", type: "" })
    const [fileInfo, setFileInfo] = useState({
        name: "No file selected",
        base64Data: "",
        filePath: "",
        fileType: "",
    })
    const [filenameFormat, setFilenameFormat] = useState("")
    const [imageSrc, setImageSrc] = useState("")
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)

    const openFile = async () => {
        setResponseText("")
        const { filePath, base64Data, fileType } =
            await window.electron.openFile() // Use Dialog from main.js to open file, so we get full file path

        if (!filePath) return

        try {
            let imageBase64
            let mimeType = "data:image/jpeg;base64"
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
            setResponseText({ message: `❌ ${error.message}`, type: "error" })
        }
    }

    const handleRunScript = async () => {
        setResponseText({ message: "", type: "" })
        setIsLoading(true)

        if (!apiKey) {
            setResponseText({
                message: "❌ OpenAI API key is required",
                type: "error",
            })
            setIsLoading(false)
            return
        }

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
            setResponseText({
                message: `✅ File renamed to: ${newFileName}`,
                type: "success",
            })

            // Prepare to send new file name back to main
            const directoryPath = fileInfo.filePath.substring(
                0,
                fileInfo.filePath.lastIndexOf("/") + 1
            )
            const newPath = `${directoryPath}${newFileName}${fileInfo.fileType}`
            window.electron.renameFile({ oldPath: fileInfo.filePath, newPath })
        } catch (error) {
            setResponseText({ message: `❌ Error: ${error}`, type: "error" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-4">
                {imageSrc ? (
                    <img
                        alt="Preview"
                        className="rounded-lg object-cover cursor-pointer aspect-square"
                        height={100}
                        src={imageSrc}
                        width={100}
                        onClick={() => setIsLightboxOpen(true)}
                    />
                ) : (
                    <div className="h-24 w-24 bg-transparent border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center aspect-square" />
                )}
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 ">
                        {fileInfo.name}
                    </h4>
                    <button
                        className="mt-2 h-8 rounded-md px-3 text-xs border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={openFile}
                    >
                        Change file
                    </button>
                </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-1">
                <Label className="text-gray-800 " htmlFor="filename-format">
                    Preferred filename format
                </Label>
                <Input
                    className="max-w-[300px]"
                    placeholder="e.g. '<YYYYMMDD> - <Description>'"
                    type="text"
                    value={filenameFormat}
                    onChange={(e) => setFilenameFormat(e.target.value)}
                />
            </div>
            <div>
                <button
                    id="my-button"
                    className="px-4 py-2 mb-2 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition-colors"
                    onClick={handleRunScript}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="border-t-transparent border-solid animate-spin rounded-full border-white border-4 h-6 w-6"></div>
                    ) : (
                        "Rename my file"
                    )}
                </button>
                {responseText.message && (
                    <div
                        className={`text-${
                            responseText.type === "error"
                                ? "red-500"
                                : "green-500"
                        }`}
                    >
                        {responseText.message}
                    </div>
                )}
            </div>
            {isLightboxOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-2 rounded">
                        <img
                            src={imageSrc}
                            className="max-w-full h-auto max-h-[90vh]"
                            onClick={() => setIsLightboxOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

FileRenamer.propTypes = {
    apiKey: PropTypes.string.isRequired,
}

export default FileRenamer
