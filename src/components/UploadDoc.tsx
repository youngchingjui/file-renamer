"use client"

import React, { useState } from "react"

export default function UploadDoc() {
    const [prompt, setPrompt] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!file) {
            alert("Please select a file to upload")
            return
        }

        const formData = new FormData()
        formData.append("prompt", prompt)
        formData.append("file", file)

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        })

        const result = await response.json()
        alert(result.message)
    }

    return (
        <form
            action="/api/upload"
            method="post"
            encType="multipart/form-data"
            className="space-y-4"
        >
            <input
                type="text"
                name="prompt"
                placeholder="Enter prompt here..."
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                onChange={(e) => setPrompt(e.target.value)}
            />
            <input
                type="file"
                name="file"
                className="block w-full text-sm text-gray-500
  file:mr-4 file:py-2 file:px-4
  file:rounded-full file:border-0
  file:text-sm file:font-semibold
  file:bg-violet-50 file:text-violet-700
  hover:file:bg-violet-100"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Upload File
            </button>
        </form>
    )
}
