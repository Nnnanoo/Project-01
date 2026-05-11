import { getAnthropic, CLAUDE_SONNET } from "./anthropic-client";
import type { ExtractedColor, TypographyProfile, ToneProfile } from "@/types";

export interface BrandBrainContext {
  brandName: string;
  industry?: string;
  country?: string;
  description?: string;
  targetAudience?: string;
  competitors?: string;
  personality?: string[];
  toneOfVoice?: string;
  preferredColors?: string;
  typographyStyle?: string;
  designStyle?: string;
  mainPlatform?: string;
  marketingGoals?: string[];
  contentTypes?: string[];
  postingFrequency?: string;
}

export interface BrandBrainInput {
  pdfText?: string;
  context: BrandBrainContext;
}

export interface BrandBrainExtraction {
  extractedColors: ExtractedColor[];
  typography: TypographyProfile;
  toneProfile: ToneProfile;
  logoUsageRules: string[];
  spacingRules: string[];
  designDirection: string;
  visualLanguage: string;
  brandPersonality: string[];
  forbiddenUsages: string[];
  communicationStyle: string;
}

const BRAND_BRAIN_SYSTEM_PROMPT = `You are an expert brand strategist and creative director with 20 years of experience.
Your task is to analyze brand guidelines and onboarding information to extract a comprehensive, structured Brand Brain.

You must return ONLY valid JSON matching the exact schema provided. Be thorough, specific, and insightful.
Extract real information from the text — do not hallucinate. If information is not available, provide intelligent defaults based on context.`;

export async function buildBrandBrain(
  input: BrandBrainInput
): Promise<BrandBrainExtraction> {
  const anthropic = getAnthropic();
  const { pdfText, context } = input;
  const contextText = buildContextText(pdfText, context);

  const response = await anthropic.messages.create({
    model: CLAUDE_SONNET,
    max_tokens: 3000,
    system: BRAND_BRAIN_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyze this brand information and extract the Brand Brain:

${contextText}

Return a JSON object with EXACTLY this structure (no markdown fences):
{
  "extractedColors": [
    {
      "name": "color name",
      "hex": "#hexcode",
      "usage": "when/how to use this color",
      "isPrimary": true/false
    }
  ],
  "typography": {
    "primaryFont": "font name",
    "secondaryFont": "font name or null",
    "headingStyle": "description of heading treatment",
    "bodyStyle": "description of body text treatment",
    "fontWeights": ["Regular", "Bold", "etc"]
  },
  "toneProfile": {
    "primary": "primary tone word",
    "adjectives": ["adj1", "adj2", "adj3", "adj4", "adj5"],
    "doList": ["DO: write like this...", "DO: use these words...", "..."],
    "dontList": ["DON'T: avoid this...", "DON'T: never say...", "..."],
    "examplePhrases": ["example phrase 1", "example phrase 2", "..."],
    "communicationStyle": "detailed description of communication style"
  },
  "logoUsageRules": ["rule 1", "rule 2", "..."],
  "spacingRules": ["rule 1", "rule 2", "..."],
  "designDirection": "comprehensive paragraph about the overall design direction and aesthetic",
  "visualLanguage": "comprehensive paragraph about the visual language, imagery style, and aesthetic choices",
  "brandPersonality": ["trait 1", "trait 2", "trait 3", "trait 4", "trait 5"],
  "forbiddenUsages": ["never do this", "avoid this element", "..."],
  "communicationStyle": "detailed description of how the brand communicates across all touchpoints"
}`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text" || !block.text) throw new Error("Empty response from AI");
  const content = block.text;

  const parsed = JSON.parse(content);

  return {
    extractedColors: parsed.extractedColors || [],
    typography: parsed.typography || getDefaultTypography(),
    toneProfile: parsed.toneProfile || getDefaultToneProfile(),
    logoUsageRules: parsed.logoUsageRules || [],
    spacingRules: parsed.spacingRules || [],
    designDirection: parsed.designDirection || "",
    visualLanguage: parsed.visualLanguage || "",
    brandPersonality: parsed.brandPersonality || [],
    forbiddenUsages: parsed.forbiddenUsages || [],
    communicationStyle: parsed.communicationStyle || "",
  };
}

function buildContextText(pdfText: string | undefined, ctx: BrandBrainContext): string {
  const lines: string[] = [
    `BRAND NAME: ${ctx.brandName}`,
    `INDUSTRY: ${ctx.industry || "Not specified"}`,
    `COUNTRY/MARKET: ${ctx.country || "Not specified"}`,
    `BRAND DESCRIPTION: ${ctx.description || "Not provided"}`,
    `TARGET AUDIENCE: ${ctx.targetAudience || "Not specified"}`,
    `COMPETITORS: ${ctx.competitors || "Not specified"}`,
    `BRAND PERSONALITY TRAITS: ${(ctx.personality || []).join(", ") || "Not specified"}`,
    `TONE OF VOICE: ${ctx.toneOfVoice || "Not specified"}`,
    "",
    "VISUAL IDENTITY:",
    `PREFERRED COLORS: ${ctx.preferredColors || "Not specified"}`,
    `TYPOGRAPHY STYLE: ${ctx.typographyStyle || "Not specified"}`,
    `DESIGN STYLE: ${ctx.designStyle || "Not specified"}`,
    "",
    "SOCIAL MEDIA:",
    `MAIN PLATFORM: ${ctx.mainPlatform || "Not specified"}`,
    `MARKETING GOALS: ${(ctx.marketingGoals || []).join(", ") || "Not specified"}`,
    `CONTENT TYPES: ${(ctx.contentTypes || []).join(", ") || "Not specified"}`,
    `POSTING FREQUENCY: ${ctx.postingFrequency || "Not specified"}`,
  ];

  if (pdfText?.trim()) {
    lines.push("", "--- BRAND GUIDELINES PDF CONTENT ---");
    lines.push(pdfText.substring(0, 12000));
  }

  return lines.join("\n");
}

function getDefaultTypography(): TypographyProfile {
  return {
    primaryFont: "System Sans-Serif",
    secondaryFont: null,
    headingStyle: "Bold and impactful",
    bodyStyle: "Clean and readable",
    fontWeights: ["Regular", "Medium", "Bold"],
  };
}

function getDefaultToneProfile(): ToneProfile {
  return {
    primary: "Professional",
    adjectives: ["Clear", "Confident", "Helpful", "Approachable", "Reliable"],
    doList: ["Be clear and concise", "Use active voice", "Focus on benefits"],
    dontList: ["Avoid jargon", "Don't be overly formal", "Avoid negative language"],
    examplePhrases: [],
    communicationStyle: "Professional and approachable communication",
  };
}
