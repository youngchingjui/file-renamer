export async function POST(req: Request) {
    // Process the file upload here
    console.log(req) // This will depend on your setup, e.g., using middleware like `multer`
    return new Response("Got a request")
}
