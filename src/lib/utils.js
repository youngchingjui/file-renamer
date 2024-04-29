import clsx from "clsx"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs" // Leave this in for Webpack to bundle, required for PDF.js to work
import { twMerge } from "tailwind-merge"

export const pdfToImageBase64 = async (base64PDFData) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "pdfjs-dist/legacy/build/pdf.worker.mjs"
    const loadingTask = pdfjsLib.getDocument({ data: atob(base64PDFData) })
    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 1.0 })
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    canvas.height = viewport.height
    canvas.width = viewport.width
    await page.render({
        canvasContext: context,
        viewport: viewport,
    }).promise
    const [mimeType, base64ImageData] = canvas.toDataURL().split(",")
    return { mimeType, base64ImageData }
}

export const cn = (...inputs) => {
    return twMerge(clsx(inputs))
}
