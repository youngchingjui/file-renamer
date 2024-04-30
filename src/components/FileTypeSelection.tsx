import React, { useState } from "react"
import { Label } from "./ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"

const fileTypes = [
    {
        id: "general",
        name: "General",
        filenameFormat: "<YYYYMMDD> - <Description>",
        otherSettings: {},
    },
    {
        id: "invoice",
        name: "Invoice / Receipt",
        filenameFormat: "<YYYYMMDD> - <$ Amount> - <Description>",
        otherSettings: {},
    },
    {
        id: "fapiao",
        name: "Fapiao 发票",
        filenameFormat:
            "<YYYYMMDD> - <￥ Amount> - <Description of items on invoice>",
        otherSettings: {},
    },
    {
        id: "screenshot",
        name: "Screenshot",
        filenameFormat: "<Description of screenshot>",
        otherSettings: {},
    },
    {
        id: "bank_statement",
        name: "Bank Statement",
        filenameFormat: "<YYYYMMDD> - <Bank name> - <Type of document>",
        otherSettings: {},
    },
]

const FileTypeSelection = ({ setFilenameFormat }) => {
    const [selectedFileType, setSelectedFileType] = useState(fileTypes[0]) // Default to the first type

    const handleValueChange = (value: string) => {
        const fileType = fileTypes.find((type) => type.id === value)

        if (!fileType) {
            return
        }

        setSelectedFileType(fileType)
        setFilenameFormat(fileType.filenameFormat)
    }
    return (
        <div>
            <Label className="text-gray-800" htmlFor="file-type">
                Select File Type (for better accuracy)
            </Label>
            <Select
                value={selectedFileType.id}
                onValueChange={handleValueChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Document type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-100">
                    {fileTypes.map((type) => (
                        <SelectItem
                            key={type.id}
                            value={type.id}
                            className="cursor-pointer hover:bg-gray-200"
                        >
                            {type.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default FileTypeSelection
