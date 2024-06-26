import path from "path"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = {
    target: "electron-renderer",
    mode: "development",
    entry: "./electron/renderer.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "renderer.bundle.js",
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        fullySpecified: false,
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                },
            },
        ],
    },
}

export default config
