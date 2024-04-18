import CopyPlugin from "copy-webpack-plugin"
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
    resolve: { extensions: [".js", ".jsx"], fullySpecified: false },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "src/index.html", to: "index.html" }],
        }),
    ],
}

export default config
