import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { extractTextFromBuffer } from "@/lib/ai/pdf-processor";
import { getAnthropic, CLAUDE_SONNET } from "@/lib/ai/anthropic-client";
import type { BrandExtraction } from "@/types";

const EXTRACTION_SYSTEM = `You are a senior brand strategist with expertise in visual identity, brand guidelines, and brand architecture.

Your task is to analyze uploaded brand materials (PDFs, logos, moodboards, and other assets) and extract as much brand identity information as possible.

Be thorough and intelligent. Look for:
- Brand name (from document headers, logos, titles)
- Industry / category
- Color palette (hex values, usage context, primary vs secondary)
- Typography (font names, heading styles, body styles)
- Brand personality traits
- Tone of voice
- Target audience
- Country or geographic market
- Brand description / positioning statement
- Design style / visual direction

For each extracted field, include a confidence score (0–1) based on how clearly it was stated in the material vs inferred.

Return ONLY valid JSON with this exact structure:
{
  "brandName": "string or null",
  "industry": "string or null",
  "country": "string or null",
  "description": "string or null",
  "targetAudience": "string or null",
  "personality": ["trait1", "trait2"],
  "toneOfVoice": "string or null",
  "colors": [
    { "name": "Primary Blue", "hex": "#1A2B3C", "usage": "Primary backgrounds and headlines", "isPrimary": true }
  ],
  "typography": {
    "primaryFont": "string or null",
    "secondaryFont": "string or null",
    "headingStyle": "string",
    "bodyStyle": "string",
    "fontWeights": ["400", "700"]
  },
  "designStyle": "string or null",
  "keywords": ["keyword1", "keyword2"],
  "confidence": {
    "brandName": 0.9,
    "industry": 0.7,
    "country": 0.5,
    "description": 0.8,
    "targetAudience": 0.6,
    "toneOfVoice": 0.7,
    "colors": 0.95,
    "typography": 0.8
  }
}`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const anthropic = getAnthropic();
    let pdfText = "";
    type ImageBlock = { type: "image"; source: { type: "base64"; media_type: "image/png" | "image/jpeg" | "image/gif" | "image/webp"; data: string } };
    const imageBlocks: ImageBlock[] = [];

    // Process each file
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf" && !pdfText) {
        try {
          const extracted = await extractTextFromBuffer(buffer);
          pdfText = extracted.text.slice(0, 12000);
        } catch {
          // PDF extraction failed — continue without it
        }
      } else if (file.type.startsWith("image/") && imageBlocks.length < 4) {
        const validTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
        if (validTypes.includes(file.type)) {
          imageBlocks.push({
            type: "image",
            source: {
              type: "base64",
              media_type: file.type as "image/png" | "image/jpeg" | "image/gif" | "image/webp",
              data: buffer.toString("base64"),
            },
          });
        }
      }
    }

    // Build the user message content
    let userText = `Analyze the following brand materials and extract all brand identity information.\n\nFiles uploaded: ${files.map((f) => f.name).join(", ")}`;

    if (pdfText) {
      userText += `\n\nBRAND GUIDELINES PDF TEXT:\n${pdfText}`;
    }

    if (imageBlocks.length === 0 && !pdfText) {
      userText += "\n\nNote: No readable content was found in the uploaded files. Return null values with very low confidence scores.";
    }

    userText += "\n\nReturn ONLY the JSON object, no markdown fences.";

    const response = await anthropic.messages.create({
      model: CLAUDE_SONNET,
      max_tokens: 2000,
      system: EXTRACTION_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            ...imageBlocks,
            { type: "text", text: userText },
          ],
        },
      ],
    });

    const block = response.content[0];
    if (block.type !== "text" || !block.text) throw new Error("Empty extraction response");
    const content = block.text;

    const raw = JSON.parse(content);

    const extraction: BrandExtraction = {
      brandName: raw.brandName || null,
      industry: raw.industry || null,
      country: raw.country || null,
      description: raw.description || null,
      targetAudience: raw.targetAudience || null,
      personality: Array.isArray(raw.personality) ? raw.personality : [],
      toneOfVoice: raw.toneOfVoice || null,
      colors: Array.isArray(raw.colors) ? raw.colors : [],
      typography: raw.typography || {},
      designStyle: raw.designStyle || null,
      keywords: Array.isArray(raw.keywords) ? raw.keywords : [],
      confidence: raw.confidence || {},
    };

    return NextResponse.json({ success: true, extraction });
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract brand identity. Please try again." },
      { status: 500 }
    );
  }
}
