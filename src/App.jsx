import OpenAI from "openai";
import React, { useEffect,useState } from "react";

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const [openai, setOpenai] = useState(null);
  const [fileInfo, setFileInfo] = useState({ name: "No file selected", base64: "" });

  useEffect(() => {
    if (apiKey) {
      setOpenai(
        new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true,
        })
      );
    }
  }, [apiKey]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convert image to base64
        const base64Image = reader.result.split(',')[1]; // Remove the data URL part
        setFileInfo({
          name: file.name,
          base64: base64Image,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFileInfo({ name: "No file selected", base64: "" });
    }
  };

  const saveAPIKey = () => {
    localStorage.setItem("apiKey", apiKey);
    setOpenai(new OpenAI({ apiKey, dangerouslyAllowBrowser: true }));
  };

  const handleRunScript = async () => {
    if (!fileInfo.base64) {
      console.log("No image selected");
      return;
    }
    console.log("running main");
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Suggest a file name for this image. Only give 1 suggested name. Don't provide any file extension." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${fileInfo.base64}`,
              },
            },
          ],
        },
      ],
    });

    console.log(response.choices[0]);
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-lg font-semibold mb-5">File Renamer</h1>
      <div className="mb-8 p-5 bg-gray-100 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-center">
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={handleFileChange}
        />
        <label className="cursor-pointer" htmlFor="fileUpload">
          Upload file
        </label>
        <div id="fileInfo">{fileInfo.name}</div>
      </div>
      <button
        id="my-button"
        className="px-4 py-2 mb-5 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition-colors"
        onClick={handleRunScript}
      >
        Rename my file
      </button>
      <hr className="my-6" />
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
  </div>
  );
}

export default App;
