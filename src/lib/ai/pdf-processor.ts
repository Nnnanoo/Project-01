import fs from "fs";
import path from "path";

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  chunks: string[];
}

export async function extractTextFromPDF(
  filePath: string
): Promise<PDFExtractionResult> {
  // Dynamic import to avoid SSR issues with pdf-parse
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");

  const fileBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(fileBuffer);

  const text = data.text;
  const pageCount = data.numpages;

  // Chunk text into ~1500 char segments with 200 char overlap for RAG
  const chunks = chunkText(text, 1500, 200);

  return { text, pageCount, chunks };
}

export async function extractTextFromBuffer(
  buffer: Buffer
): Promise<PDFExtractionResult> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);

  const text = data.text;
  const pageCount = data.numpages;
  const chunks = chunkText(text, 1500, 200);

  return { text, pageCount, chunks };
}

function chunkText(
  text: string,
  chunkSize: number,
  overlap: number
): string[] {
  const cleanText = text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  const sentences = cleanText.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (current.length + sentence.length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      // Overlap: keep last portion
      const words = current.split(" ");
      current = words.slice(-Math.floor(overlap / 6)).join(" ") + " " + sentence;
    } else {
      current += (current ? " " : "") + sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());

  return chunks.filter((c) => c.length > 50);
}

export function getUploadPath(filename: string): string {
  const uploadDir = process.env.UPLOAD_DIR || "./public/uploads";
  return path.join(uploadDir, filename);
}

export function ensureUploadDir(): void {
  const uploadDir = process.env.UPLOAD_DIR || "./public/uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}
