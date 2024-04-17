import OpenAI from "openai"

let apiKey = localStorage.getItem("apiKey") || ""
let openai

if (apiKey) {
    openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
    })
}

console.log("loading renderer")

document.getElementById("api-key-input").value = apiKey

async function main() {
    console.log("running main")
    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "What's in this image?" },
                    {
                        type: "image_url",
                        image_url: {
                            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                        },
                    },
                ],
            },
        ],
    })

    console.log(response.choices[0])
}

async function saveAPIKey() {
    apiKey = document.getElementById("api-key-input").value
    localStorage.setItem("apiKey", apiKey)
    console.log("saved api key")
    openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
}

async function displayFileInfo() {
    const fileInput = document.getElementById("fileUpload")
    const file = fileInput.files[0]
    const fileInfoDiv = document.getElementById("fileInfo")

    if (file) {
        const { name, type } = file

        fileInfoDiv.innerHTML = name
    } else {
        fileInfoDiv.innerHTML = "No file selected"
    }
}

document.getElementById("my-button").addEventListener("click", main)
document.getElementById("api-key-button").addEventListener("click", saveAPIKey)
document
    .getElementById("fileUpload")
    .addEventListener("change", displayFileInfo)
