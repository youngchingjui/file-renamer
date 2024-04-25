import fs from "fs"
import path from "path"

const output = []

const getFolderTree = (dir, prefix = "", depth = 0) => {
    const files = fs.readdirSync(dir)
    files.forEach((file, index) => {
        const filePath = path.join(dir, file)
        const isLast = index === files.length - 1
        const newPrefix = prefix + (isLast ? "└── " : "├── ")

        if (fs.statSync(filePath).isDirectory()) {
            output.push(prefix + (isLast ? "└── " : "├── ") + file)
            if (depth < 1) {
                // Only go one level deep
                getFolderTree(
                    filePath,
                    prefix + (isLast ? "    " : "│   "),
                    depth + 1
                )
            }
        } else if (depth === 1) {
            if (index < 20) {
                // List only the first 20 files
                output.push(prefix + (isLast ? "└── " : "├── ") + file)
            } else if (index === 20) {
                // Add a note if there are more than 20 files
                output.push(prefix + "├── ---<+ more files>")
            }
        }
    })
}

// Replace '/path/to/your/Documents' with the actual path to your Documents folder
getFolderTree("/Users/youngchingjui/Documents/")

fs.writeFileSync(
    "/Users/youngchingjui/Desktop/folderStructure.txt",
    output.join("\n"),
    "utf-8"
)
