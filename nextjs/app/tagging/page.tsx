"use server"

export default async function TaggingPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white shadow-md rounded">
                <h1 className="text-lg font-bold mb-4">File Upload</h1>
                <form
                    action="/api/upload"
                    method="post"
                    encType="multipart/form-data"
                    className="space-y-4"
                >
                    <input
                        type="file"
                        name="file"
                        className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Upload File
                    </button>
                </form>
            </div>
        </div>
    )
}
