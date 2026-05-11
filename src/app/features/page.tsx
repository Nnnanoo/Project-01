import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import {
  Sparkles, Eye, Palette, Type, LayoutGrid, TrendingUp,
  MessageSquare, Users, Globe, Zap, FileText, Brain,
} from "lucide-react";

export const metadata = {
  title: "Features — Whisperly",
  description: "Everything Brand Whisper 01 evaluates and generates for your social media designs.",
};

const EVALUATION_DIMENSIONS = [
  {
    icon: Eye,
    title: "Brand Consistency",
    description: "Measures how faithfully the design reflects your uploaded brand guidelines — colors, typography, logo usage, and overall visual language.",
    color: "violet",
  },
  {
    icon: Type,
    title: "Typography",
    description: "Evaluates font choices, hierarchy, weight balance, and whether the type system matches your brand's typographic identity.",
    color: "blue",
  },
  {
    icon: Palette,
    title: "Color Usage",
    description: "Checks color accuracy against your brand palette, contrast ratios, and whether the color story creates the right emotional tone.",
    color: "pink",
  },
  {
    icon: LayoutGrid,
    title: "Layout & Composition",
    description: "Assesses visual balance, spacing, grid alignment, and how well the layout guides the viewer's eye through the design.",
    color: "emerald",
  },
  {
    icon: TrendingUp,
    title: "Visual Hierarchy",
    description: "Rates how clearly the design communicates importance — what gets seen first, second, third, and whether that order serves the message.",
    color: "orange",
  },
  {
    icon: MessageSquare,
    title: "Tone of Voice",
    description: "Evaluates whether the copy, tone, and messaging style matches your brand's defined communication style and voice guidelines.",
    color: "cyan",
  },
  {
    icon: Sparkles,
    title: "Emotional Impact",
    description: "Assesses the emotional resonance of the design — does it evoke the right feeling for your brand and campaign objective?",
    color: "violet",
  },
  {
    icon: Eye,
    title: "Aesthetics",
    description: "An overall aesthetic quality score — is this design beautiful, polished, and worthy of your brand's standards?",
    color: "indigo",
  },
  {
    icon: Zap,
    title: "CTA Effectiveness",
    description: "Evaluates whether calls to action are clear, compelling, appropriately placed, and likely to drive the intended user action.",
    color: "yellow",
  },
  {
    icon: Users,
    title: "Audience Fit",
    description: "Measures how well the design speaks to your specific target audience — their demographics, cultural context, and platform expectations.",
    color: "teal",
  },
];

const PLATFORMS = [
  {
    emoji: "📸",
    name: "Instagram",
    description: "Feed posts, carousels, stories, reel covers, and ad creatives evaluated for visual impact, feed aesthetics, and Gen Z/Millennial taste.",
  },
  {
    emoji: "💼",
    name: "LinkedIn",
    description: "Single image posts, carousels, and ad creatives evaluated for professionalism, readability, and thought leadership positioning.",
  },
  {
    emoji: "🐦",
    name: "X / Twitter",
    description: "Image posts and ad creatives evaluated for thumbnail-scale readability, immediate impact, and character-constrained communication.",
  },
  {
    emoji: "📘",
    name: "Facebook",
    description: "Posts, stories, ad creatives, and cover photos evaluated for broad audience appeal across both mobile and desktop contexts.",
  },
  {
    emoji: "🎵",
    name: "TikTok",
    description: "Video thumbnails and ad creatives evaluated for energy, trend alignment, and native Gen-Z visual language.",
  },
];

const KEY_FEATURES = [
  {
    icon: Brain,
    title: "Upload-first onboarding",
    description: "Drop your brand PDF, logos, and moodboards. Brand Whisper 01 automatically extracts your entire brand identity — colors, typography, personality, tone, and design direction — so you never have to fill a form manually.",
  },
  {
    icon: FileText,
    title: "AI-generated social captions",
    description: "Every evaluation includes a platform-native caption tailored to your brand voice, target audience, and the specific design being published — ready to copy and paste.",
  },
  {
    icon: Globe,
    title: "Geographic & audience context",
    description: "Evaluations factor in your geographic market, country, and target audience demographics so the AI understands cultural nuances and regional expectations.",
  },
  {
    icon: Sparkles,
    title: "Instant Brand Brain",
    description: "Your uploaded guidelines are processed into a structured Brand Brain — a living knowledge base the AI references for every future evaluation, ensuring consistent scoring.",
  },
  {
    icon: TrendingUp,
    title: "Evaluation history & trends",
    description: "Every evaluation is saved. Track your brand consistency score over time, compare designs, and see how your creative quality evolves sprint by sprint.",
  },
  {
    icon: Users,
    title: "Multi-brand support",
    description: "Pro and Agency plans support multiple brand workspaces. Each brand has its own Brand Brain, evaluation history, and AI assistant — perfect for agencies and multi-product companies.",
  },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  teal: "bg-teal-500/10 border-teal-500/20 text-teal-400",
};

export default function FeaturesPage() {
  return (
    <div className="bg-[#09090B] min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-400 tracking-widest uppercase">Features</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Everything Brand Whisper 01
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              evaluates for you
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            11 evaluation dimensions. 5 platforms. AI-generated captions. Instant Brand Brain.
            Here&apos;s exactly what you get with every evaluation.
          </p>
        </div>
      </section>

      {/* Evaluation dimensions */}
      <section className="py-16 lg:py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-violet-400 tracking-widest uppercase mb-3">What gets scored</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              10 evaluation dimensions
            </h2>
            <p className="text-zinc-400 mt-3 max-w-xl mx-auto text-sm">
              Each dimension is scored 0–100, with a written explanation of exactly what the AI observed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EVALUATION_DIMENSIONS.map((dim) => (
              <div
                key={dim.title}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] transition-colors"
              >
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${colorMap[dim.color]}`}>
                  <dim.icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{dim.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{dim.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-16 lg:py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-violet-400 tracking-widest uppercase mb-3">Platform support</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              5 platforms, each evaluated differently
            </h2>
            <p className="text-zinc-400 mt-3 max-w-xl mx-auto text-sm">
              The AI applies platform-specific criteria for every evaluation — not one-size-fits-all scoring.
            </p>
          </div>
          <div className="space-y-3">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="flex items-start gap-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-2xl shrink-0">{p.emoji}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">{p.name}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key features */}
      <section className="py-16 lg:py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-violet-400 tracking-widest uppercase mb-3">Platform features</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              More than just a score
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {KEY_FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Try it free today</h2>
          <p className="text-zinc-400 mb-8">
            5,000 credits — enough for 50 full evaluations. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Start free trial
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
