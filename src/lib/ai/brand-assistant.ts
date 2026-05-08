import { getOpenAI, GPT4O } from "./openai-client";
import type { BrandBrain } from "@/types";

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

const ASSISTANT_SYSTEM = (brandName: string, brainContext: string) => `You are the AI Brand Assistant for "${brandName}".

You are an expert creative director and brand strategist with deep knowledge of this specific brand. You help the brand team:
- Evaluate if designs, copy, or content fit the brand
- Generate captions, CTAs, and copy in the brand's exact tone of voice
- Give strategic creative feedback
- Explain brand guidelines in plain language
- Suggest improvements aligned with brand identity

Your personality:
- Smart, direct, and strategic — like a senior creative consultant
- Warm but professional
- Give specific, actionable answers — never vague
- Reference brand-specific elements when relevant
- Be concise unless detail is needed

BRAND KNOWLEDGE BASE:
${brainContext}

Always stay in character as this brand's dedicated AI strategist. If you don't have enough information to answer confidently, say so and ask for clarification.`;

export async function streamBrandAssistantResponse(
  messages: AssistantMessage[],
  brandBrain: BrandBrain | null,
  brandName: string
): Promise<ReadableStream<Uint8Array>> {
  const openai = getOpenAI();
  const brainContext = buildBrainContext(brandBrain, brandName);

  const stream = await openai.chat.completions.create({
    model: GPT4O,
    messages: [
      {
        role: "system",
        content: ASSISTANT_SYSTEM(brandName, brainContext),
      },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.6,
    max_tokens: 1500,
    stream: true,
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

export async function getBrandAssistantResponse(
  messages: AssistantMessage[],
  brandBrain: BrandBrain | null,
  brandName: string
): Promise<string> {
  const openai = getOpenAI();
  const brainContext = buildBrainContext(brandBrain, brandName);

  const response = await openai.chat.completions.create({
    model: GPT4O,
    messages: [
      {
        role: "system",
        content: ASSISTANT_SYSTEM(brandName, brainContext),
      },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.6,
    max_tokens: 1500,
  });

  return response.choices[0].message.content || "";
}

function buildBrainContext(brain: BrandBrain | null, brandName: string): string {
  if (!brain) {
    return `Brand: ${brandName}\nNo detailed brand guidelines have been uploaded yet. Provide general creative best practices and ask the user to upload brand guidelines for more specific advice.`;
  }

  const tone = brain.toneProfile as {
    primary?: string;
    adjectives?: string[];
    doList?: string[];
    dontList?: string[];
    examplePhrases?: string[];
    communicationStyle?: string;
  };

  const typography = brain.typography as {
    primaryFont?: string;
    secondaryFont?: string;
    headingStyle?: string;
    bodyStyle?: string;
  };

  const colors = (brain.extractedColors as Array<{ name: string; hex: string; usage: string; isPrimary: boolean }>)
    .map((c) => `${c.name} (${c.hex}): ${c.usage}`)
    .join("\n  - ");

  return [
    `BRAND: ${brandName}`,
    ``,
    `BRAND PERSONALITY: ${brain.brandPersonality.join(", ")}`,
    ``,
    `DESIGN DIRECTION:`,
    brain.designDirection,
    ``,
    `VISUAL LANGUAGE:`,
    brain.visualLanguage,
    ``,
    `BRAND COLORS:`,
    `  - ${colors}`,
    ``,
    `TYPOGRAPHY:`,
    `  Primary: ${typography.primaryFont}`,
    `  Secondary: ${typography.secondaryFont || "None"}`,
    `  Headings: ${typography.headingStyle}`,
    `  Body: ${typography.bodyStyle}`,
    ``,
    `TONE OF VOICE:`,
    `  Primary tone: ${tone.primary}`,
    `  Adjectives: ${(tone.adjectives || []).join(", ")}`,
    `  DO: ${(tone.doList || []).join(" | ")}`,
    `  DON'T: ${(tone.dontList || []).join(" | ")}`,
    `  Example phrases: ${(tone.examplePhrases || []).join(" | ")}`,
    ``,
    `COMMUNICATION STYLE: ${brain.communicationStyle}`,
    ``,
    `FORBIDDEN USAGES: ${brain.forbiddenUsages.join(", ")}`,
    ``,
    `LOGO RULES: ${brain.logoUsageRules.join(". ")}`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}
