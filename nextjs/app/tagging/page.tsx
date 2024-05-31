"use server"

import UploadDoc from "../../../src/components/UploadDoc"
export default async function TaggingPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-md rounded">
                <h1 className="text-lg font-bold mb-4">File Upload</h1>
                <UploadDoc />
            </div>
        </div>
    )
}
