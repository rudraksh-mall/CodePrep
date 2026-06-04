const ApiError = require("./ApiError");

async function extractTextFromBuffer(buffer) {
  try {
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const pdf = await getDocument({
      data: new Uint8Array(buffer),
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      text += content.items.map(item => item.str).join(" ");
      text += "\n";
    }

    return text.trim();
  } catch (err) {
    console.error("PDF PARSE ERROR:", err);
    throw new ApiError(422, "Could not parse PDF");
  }
}

module.exports = { extractTextFromBuffer };