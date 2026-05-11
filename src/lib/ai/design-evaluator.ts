import { getAnthropic, CLAUDE_SONNET } from "./anthropic-client";
import type { BrandBrain } from "@/types";

export interface EvaluationResult {
  overallScore: number;
  brandConsistency: number;
  typographyScore: number;
  colorScore: number;
  layoutScore: number;
  hierarchyScore: number;
  toneScore: number;
  emotionalScore: number;
  aestheticsScore: number;
  ctaScore: number;
  audienceFitScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  fullAnalysis: string;
  caption: string;
}

const EVALUATOR_SYSTEM = `You are a world-class creative director and brand strategist with deep expertise in visual design, brand identity, and social media marketing. You evaluate designs with the discerning eye of someone who has worked with top global brands.

Your evaluations are:
- Honest and precise, not generic
- Actionable and specific (reference actual visual elements)
- Written in a smart, human, strategic tone — like a trusted creative director, not a robot
- Focused on brand alignment AND design quality equally
- Constructive even when critical`;

const PLATFORM_CONTEXT: Record<string, string> = {
  instagram:
    "Instagram — prioritize visual impact, thumb-stopping quality, color harmony, and aesthetic appeal. Consider feed grid coherence, story format ratios, and Gen Z/Millennial taste.",
  linkedin:
    "LinkedIn — prioritize professionalism, readability at desktop size, thought leadership positioning, and credibility signals. Avoid overly casual design elements.",
  twitter:
    "X / Twitter — prioritize clarity, text readability at small sizes, immediate visual impact, and concise message delivery. The design must work at thumbnail scale.",
  facebook:
    "Facebook — balance visual appeal with information clarity for a broad, diverse audience. Consider both mobile and desktop viewing contexts.",
  tiktok:
    "TikTok — prioritize energy, trend alignment, bold visuals, and Gen-Z appeal. The design should feel native to a fast-scrolling, entertainment-first environment.",
};

const PLATFORM_CAPTION_STYLE: Record<string, string> = {
  instagram: "Write an Instagram caption: 2-3 punchy sentences + 3-5 relevant hashtags. Hook in the first line. Conversational but on-brand.",
  linkedin: "Write a LinkedIn post caption: 2-3 professional sentences. No hashtags unless very relevant. Thought leadership tone. End with a subtle CTA or question.",
  twitter: "Write an X/Twitter post: max 240 characters, punchy, direct. One optional hashtag max.",
  facebook: "Write a Facebook post caption: 2-3 sentences, friendly and accessible. Optional 1-2 hashtags.",
  tiktok: "Write a TikTok caption: short, energetic, 1-2 sentences + 3 trending-style hashtags. Gen-Z friendly.",
};

export interface BrandSocialContext {
  instagramUsername?: string | null;
  linkedinUrl?: string | null;
  twitterUsername?: string | null;
  targetAudience?: string | null;
  country?: string | null;
  region?: string | null;
}

export async function evaluateDesign(
  imageBase64: string,
  brandBrain: BrandBrain | null,
  postType: string,
  brandName: string,
  platform: string = "instagram",
  socialContext?: BrandSocialContext
): Promise<EvaluationResult> {
  const anthropic = getAnthropic();

  const brandContext = buildBrandContext(brandBrain, brandName, socialContext);
  const platformContext = PLATFORM_CONTEXT[platform] || PLATFORM_CONTEXT.instagram;
  const captionStyle = PLATFORM_CAPTION_STYLE[platform] || PLATFORM_CAPTION_STYLE.instagram;

  const base64Data = imageBase64.startsWith("data:")
    ? imageBase64.split(",")[1]
    : imageBase64;
  const mediaType: "image/png" | "image/jpeg" = imageBase64.startsWith("data:image/png")
    ? "image/png"
    : "image/jpeg";

  const response = await anthropic.messages.create({
    model: CLAUDE_SONNET,
    max_tokens: 2500,
    system: EVALUATOR_SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Data },
          },
          {
            type: "text",
            text: `Evaluate this ${postType.replace(/_/g, " ")} for the brand "${brandName}".

PLATFORM CONTEXT:
${platformContext}

BRAND PROFILE:
${brandContext}

Analyze the design and return a JSON object with EXACTLY this structure:
{
  "overallScore": <0-100>,
  "brandConsistency": <0-100>,
  "typographyScore": <0-100>,
  "colorScore": <0-100>,
  "layoutScore": <0-100>,
  "hierarchyScore": <0-100>,
  "toneScore": <0-100>,
  "emotionalScore": <0-100>,
  "aestheticsScore": <0-100>,
  "ctaScore": <0-100>,
  "audienceFitScore": <0-100>,
  "strengths": [
    "Specific strength 1 — be precise about what works and why",
    "Specific strength 2",
    "Specific strength 3"
  ],
  "weaknesses": [
    "Specific weakness 1 — name the exact element and why it fails",
    "Specific weakness 2",
    "Specific weakness 3"
  ],
  "suggestions": [
    "Actionable improvement 1 — be specific about what to change and how",
    "Actionable improvement 2",
    "Actionable improvement 3",
    "Actionable improvement 4"
  ],
  "fullAnalysis": "A 3-4 paragraph strategic analysis written in the voice of a senior creative director. Cover: overall impression, brand alignment, design craft, and key recommendation. Be specific, intelligent, and human. Avoid generic statements.",
  "caption": "<platform-native caption for this design>"
}

Caption instructions: ${captionStyle}
The caption should reflect the brand's voice, speak to their target audience, and feel native to ${platform}.

Score calibration:
- 90-100: Exceptional, could be used as a brand standard example
- 75-89: Strong with minor issues
- 60-74: Decent but has clear problems to address
- 40-59: Significant issues affecting brand or design quality
- 0-39: Fundamental problems requiring redesign

Return ONLY the JSON object, no markdown fences.`,
          },
        ],
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text" || !block.text) throw new Error("Empty evaluation response");

  const result = JSON.parse(block.text);

  return {
    overallScore: clamp(result.overallScore, 0, 100),
    brandConsistency: clamp(result.brandConsistency, 0, 100),
    typographyScore: clamp(result.typographyScore, 0, 100),
    colorScore: clamp(result.colorScore, 0, 100),
    layoutScore: clamp(result.layoutScore, 0, 100),
    hierarchyScore: clamp(result.hierarchyScore, 0, 100),
    toneScore: clamp(result.toneScore, 0, 100),
    emotionalScore: clamp(result.emotionalScore, 0, 100),
    aestheticsScore: clamp(result.aestheticsScore, 0, 100),
    ctaScore: clamp(result.ctaScore, 0, 100),
    audienceFitScore: clamp(result.audienceFitScore, 0, 100),
    strengths: result.strengths || [],
    weaknesses: result.weaknesses || [],
    suggestions: result.suggestions || [],
    fullAnalysis: result.fullAnalysis || "",
    caption: result.caption || "",
  };
}

function buildBrandContext(
  brain: BrandBrain | null,
  brandName: string,
  social?: BrandSocialContext
): string {
  const socialLines: string[] = [];
  if (social?.targetAudience) socialLines.push(`Target Audience: ${social.targetAudience}`);
  if (social?.country || social?.region) {
    const geo = [social.country, social.region].filter(Boolean).join(", ");
    socialLines.push(`Geographic Market: ${geo}`);
  }
  if (social?.instagramUsername) socialLines.push(`Instagram: @${social.instagramUsername}`);
  if (social?.linkedinUrl) socialLines.push(`LinkedIn: ${social.linkedinUrl}`);
  if (social?.twitterUsername) socialLines.push(`X/Twitter: @${social.twitterUsername}`);

  if (!brain) {
    return [
      `Brand: ${brandName}`,
      ...socialLines,
      "(No brand guidelines loaded — evaluate purely on design quality and general best practices)",
    ].join("\n");
  }

  const colors = brain.extractedColors
    .map((c) => `${c.name} (${c.hex}) — ${c.usage}`)
    .join(", ");

  const tone = brain.toneProfile as { primary?: string; adjectives?: string[]; dontList?: string[] };

  return [
    `Brand: ${brandName}`,
    ...socialLines,
    `Brand Personality: ${brain.brandPersonality.join(", ")}`,
    `Design Direction: ${brain.designDirection}`,
    `Visual Language: ${brain.visualLanguage}`,
    `Brand Colors: ${colors}`,
    `Typography: Primary font ${(brain.typography as { primaryFont?: string }).primaryFont || "unspecified"}`,
    `Tone Profile: ${tone.primary} — ${(tone.adjectives || []).join(", ")}`,
    `Communication Style: ${brain.communicationStyle}`,
    `Forbidden Usages: ${brain.forbiddenUsages.join("; ")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
