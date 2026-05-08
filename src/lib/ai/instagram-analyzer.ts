import { getOpenAI, GPT4O } from "./openai-client";
import type { BrandBrain } from "@/types";

export interface InstagramAnalysisResult {
  feedConsistency: number;
  brandConsistency: number;
  engagementQuality: number;
  contentDirection: string;
  visualStorytelling: number;
  analysisReport: string;
  recommendations: string[];
}

const INSTAGRAM_ANALYZER_SYSTEM = `You are an expert social media strategist and brand analyst specializing in Instagram. You analyze brand accounts with the depth of a world-class agency creative director and digital strategist.

Your analyses are:
- Data-driven and visually observant
- Strategic and business-focused
- Actionable with clear next steps
- Written in a professional, intelligent tone`;

export async function analyzeInstagramFeed(
  imageDataUrls: string[],
  brandBrain: BrandBrain | null,
  brandName: string,
  username: string
): Promise<InstagramAnalysisResult> {
  const openai = getOpenAI();

  const brandContext = brandBrain
    ? `Brand: ${brandName}
Design Direction: ${brandBrain.designDirection}
Brand Colors: ${(brandBrain.extractedColors as Array<{ name: string; hex: string }>).map((c) => `${c.name} (${c.hex})`).join(", ")}
Brand Personality: ${brandBrain.brandPersonality.join(", ")}`
    : `Brand: ${brandName}\nNo brand guidelines loaded.`;

  const imageMessages = imageDataUrls.slice(0, 9).map((url) => ({
    type: "image_url" as const,
    image_url: { url, detail: "low" as const },
  }));

  const response = await openai.chat.completions.create({
    model: GPT4O,
    messages: [
      { role: "system", content: INSTAGRAM_ANALYZER_SYSTEM },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze the Instagram feed for @${username} (brand: ${brandName}).

${brandContext}

Review all provided post images and return a JSON analysis:
{
  "feedConsistency": <0-100, visual coherence of the overall feed grid>,
  "brandConsistency": <0-100, alignment with brand identity>,
  "engagementQuality": <0-100, estimated content quality for engagement>,
  "visualStorytelling": <0-100, how well the feed tells the brand story>,
  "contentDirection": "Detailed paragraph describing the current content direction and visual narrative",
  "analysisReport": "3-4 paragraph strategic analysis covering: feed aesthetic quality, brand consistency, content mix, visual storytelling, and overall strategic direction. Write like a senior strategist giving a client briefing.",
  "recommendations": [
    "Specific, actionable recommendation 1",
    "Specific, actionable recommendation 2",
    "Specific, actionable recommendation 3",
    "Specific, actionable recommendation 4",
    "Specific, actionable recommendation 5"
  ]
}`,
          },
          ...imageMessages,
        ],
      },
    ],
    temperature: 0.4,
    response_format: { type: "json_object" },
    max_tokens: 2000,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty analysis response");

  const result = JSON.parse(content);

  return {
    feedConsistency: clamp(result.feedConsistency, 0, 100),
    brandConsistency: clamp(result.brandConsistency, 0, 100),
    engagementQuality: clamp(result.engagementQuality, 0, 100),
    visualStorytelling: clamp(result.visualStorytelling, 0, 100),
    contentDirection: result.contentDirection || "",
    analysisReport: result.analysisReport || "",
    recommendations: result.recommendations || [],
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
