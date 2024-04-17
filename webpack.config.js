import path from "path"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = {
    target: "electron-renderer",
    mode: "development",
    entry: "./src/renderer.js", // entry file of your renderer code
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "renderer.bundle.js", // bundled file
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader", // transpile ES6 to ES5
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },
}

export default config
