// ─── User & Auth ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  credits: number;
  plan: string;
  subscriptionStatus: string | null;
  createdAt: Date;
  brands: Brand[];
}

// ─── Brand ──────────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  userId: string;
  name: string;
  industry: string | null;
  country: string | null;
  region: string | null;
  description: string | null;
  targetAudience: string | null;
  competitors: string[];
  personality: string[];
  toneOfVoice: string | null;
  mission: string | null;
  vision: string | null;
  instagramUsername: string | null;
  linkedinUrl: string | null;
  twitterUsername: string | null;
  mainPlatform: string | null;
  selectedPlatforms: string[];
  marketingGoals: string[];
  contentTypes: string[];
  postingFrequency: string | null;
  preferredColors: string[];
  typographyStyle: string | null;
  designStyle: string | null;
  contentStyle: string | null;
  exampleBrands: string[];
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  brandBrain: BrandBrain | null;
  assets: BrandAsset[];
  evaluations: Evaluation[];
}

// ─── Brand Brain ─────────────────────────────────────────────────────────────

export interface BrandBrain {
  id: string;
  brandId: string;
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
  rawExtraction: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtractedColor {
  name: string;
  hex: string;
  usage: string;
  isPrimary: boolean;
}

export interface TypographyProfile {
  primaryFont: string;
  secondaryFont: string | null;
  headingStyle: string;
  bodyStyle: string;
  fontWeights: string[];
}

export interface ToneProfile {
  primary: string;
  adjectives: string[];
  doList: string[];
  dontList: string[];
  examplePhrases: string[];
  communicationStyle: string;
}

// ─── Brand Assets ────────────────────────────────────────────────────────────

export type AssetType =
  | "brand_guidelines"
  | "moodboard"
  | "logo"
  | "font"
  | "image"
  | "other";

export interface BrandAsset {
  id: string;
  brandId: string;
  type: AssetType;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  processed: boolean;
  createdAt: Date;
}

// ─── Platform ────────────────────────────────────────────────────────────────

export type Platform =
  | "instagram"
  | "linkedin"
  | "twitter"
  | "facebook"
  | "tiktok";

// ─── Evaluation ──────────────────────────────────────────────────────────────

export type PostType =
  | "instagram_post"
  | "carousel"
  | "story"
  | "reel_cover"
  | "ad_creative"
  | "single_image"
  | "video_thumbnail"
  | "cover_photo";

export interface Evaluation {
  id: string;
  brandId: string;
  postType: PostType;
  platform: Platform;
  imageUrl: string;
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
  caption: string | null;
  creditsUsed: number;
  createdAt: Date;
}

// ─── Instagram Analysis ──────────────────────────────────────────────────────

export interface InstagramAnalysis {
  id: string;
  brandId: string;
  username: string;
  feedConsistency: number;
  brandConsistency: number;
  engagementQuality: number;
  contentDirection: string;
  visualStorytelling: number;
  postCount: number;
  analysisReport: string;
  recommendations: string[];
  createdAt: Date;
}

// ─── AI Chat ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

// ─── Brand Extraction ─────────────────────────────────────────────────────────
// Returned by /api/onboarding/extract — AI-analyzed brand identity from uploaded files

export interface BrandExtraction {
  brandName: string | null;
  industry: string | null;
  country: string | null;
  region: string | null;
  description: string | null;
  targetAudience: string | null;
  personality: string[];
  toneOfVoice: string | null;
  colors: ExtractedColor[];
  typography: Partial<TypographyProfile>;
  designStyle: string | null;
  keywords: string[];
  confidence: Record<string, number>;
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export interface OnboardingData {
  brandInfo: {
    name: string;
    industry: string;
    country: string;
    region: string;
    description: string;
    targetAudience: string;
    competitors: string;
    personality: string[];
    toneOfVoice: string;
  };
  platforms: {
    selectedPlatforms: string[];
    mainPlatform: string;
    instagramUsername: string;
    linkedinUrl: string;
    twitterUsername: string;
    marketingGoals: string[];
    contentTypes: string[];
    postingFrequency: string;
  };
}

// ─── Credits ─────────────────────────────────────────────────────────────────

export interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: Date;
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
