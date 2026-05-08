import { getOpenAI, GPT4O } from "./openai-client";
import type { BrandBrain, ExtractedColor, TypographyProfile, ToneProfile } from "@/types";
import type { OnboardingData } from "@/types";

export interface BrandBrainInput {
  pdfText?: string;
  onboardingData: OnboardingData;
  brandName: string;
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
  const openai = getOpenAI();

  const { pdfText, onboardingData, brandName } = input;

  const contextText = buildContextText(pdfText, onboardingData, brandName);

  const response = await openai.chat.completions.create({
    model: GPT4O,
    messages: [
      {
        role: "system",
        content: BRAND_BRAIN_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Analyze this brand information and extract the Brand Brain:

${contextText}

Return a JSON object with EXACTLY this structure:
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
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty response from AI");

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

function buildContextText(
  pdfText: string | undefined,
  data: OnboardingData,
  brandName: string
): string {
  const lines: string[] = [
    `BRAND NAME: ${brandName}`,
    `INDUSTRY: ${data.brandInfo.industry || "Not specified"}`,
    `COUNTRY/MARKET: ${data.brandInfo.country || "Not specified"}`,
    `BRAND DESCRIPTION: ${data.brandInfo.description || "Not provided"}`,
    `TARGET AUDIENCE: ${data.brandInfo.targetAudience || "Not specified"}`,
    `COMPETITORS: ${data.brandInfo.competitors || "Not specified"}`,
    `BRAND PERSONALITY TRAITS: ${data.brandInfo.personality.join(", ") || "Not specified"}`,
    `TONE OF VOICE: ${data.brandInfo.toneOfVoice || "Not specified"}`,
    `BRAND MISSION: ${data.brandInfo.mission || "Not specified"}`,
    `BRAND VISION: ${data.brandInfo.vision || "Not specified"}`,
    "",
    "VISUAL IDENTITY:",
    `PREFERRED COLORS: ${data.visualIdentity.preferredColors || "Not specified"}`,
    `TYPOGRAPHY STYLE: ${data.visualIdentity.typographyStyle || "Not specified"}`,
    `DESIGN STYLE: ${data.visualIdentity.designStyle || "Not specified"}`,
    `CONTENT STYLE: ${data.visualIdentity.contentStyle || "Not specified"}`,
    `EXAMPLE BRANDS: ${data.visualIdentity.exampleBrands || "Not specified"}`,
    "",
    "SOCIAL MEDIA:",
    `MAIN PLATFORM: ${data.socialMedia.mainPlatform || "Not specified"}`,
    `MARKETING GOALS: ${data.socialMedia.marketingGoals.join(", ") || "Not specified"}`,
    `CONTENT TYPES: ${data.socialMedia.contentTypes.join(", ") || "Not specified"}`,
    `POSTING FREQUENCY: ${data.socialMedia.postingFrequency || "Not specified"}`,
  ];

  if (pdfText && pdfText.trim()) {
    lines.push("", "--- BRAND GUIDELINES PDF CONTENT ---");
    lines.push(pdfText.substring(0, 12000)); // Use first 12k chars to fit context
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
