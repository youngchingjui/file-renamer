import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.mjs" // Leave this in for Webpack to bundle, required for PDF.js to work

export const pdfToImageBase64 = async (base64Data) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "pdfjs-dist/legacy/build/pdf.worker.mjs"
    const loadingTask = pdfjsLib.getDocument({ data: atob(base64Data) })
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
    return canvas.toDataURL().split(",")[1] // Returns base64 string only
}
