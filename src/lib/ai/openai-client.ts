import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export const GPT4O = "gpt-4o";
export const GPT4O_MINI = "gpt-4o-mini";
export const EMBEDDING_MODEL = "text-embedding-3-small";
