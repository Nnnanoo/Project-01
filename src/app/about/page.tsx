import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { Sparkles, Target, Zap, Shield, Users, Globe } from "lucide-react";

export const metadata = {
  title: "About — Whisperly",
  description: "Learn about Whisperly and the mission behind Brand Whisper 01.",
};

const VALUES = [
  {
    icon: Target,
    title: "Brand precision, not guesswork",
    description:
      "Every design decision should have a reason. Whisperly gives creative teams the data and AI insight to make confident, brand-aligned decisions instead of relying on gut feel alone.",
  },
  {
    icon: Zap,
    title: "Speed without sacrificing quality",
    description:
      "A feedback cycle that used to take days now takes seconds. Brand Whisper 01 delivers creative-director-level analysis instantly, so teams can iterate faster and ship better work.",
  },
  {
    icon: Shield,
    title: "Your brand data stays yours",
    description:
      "We never use your brand guidelines, assets, or evaluation data to train AI models. Your competitive intelligence stays private, always.",
  },
  {
    icon: Users,
    title: "Built for real creative teams",
    description:
      "From solo brand managers to agency teams handling 20+ clients — Whisperly is designed to fit how creative work actually happens, not how we wish it did.",
  },
  {
    icon: Globe,
    title: "Platform-aware by design",
    description:
      "A LinkedIn post and an Instagram reel have completely different rules. Brand Whisper 01 understands platform conventions natively and evaluates every design in the right context.",
  },
];

const STATS = [
  { value: "11", label: "Evaluation dimensions per design" },
  { value: "5", label: "Social platforms supported" },
  { value: "< 10s", label: "Average evaluation time" },
  { value: "5,000", label: "Free credits to start" },
];

export default function AboutPage() {
  return (
    <div className="bg-[#09090B] min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-400 tracking-widest uppercase">Our story</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            The AI creative director
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              your brand deserves
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Whisperly was built to solve a real problem: brand teams producing dozens of social
            media designs weekly with no scalable way to verify brand consistency or quality
            before publishing.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-violet-400 tracking-widest uppercase mb-4">Our mission</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-6">
                Make brand consistency effortless at scale
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Brand guidelines get written and then forgotten. Design reviews are slow, subjective,
                and often skipped under deadline pressure. The result: inconsistent brand presence
                across platforms, confused audiences, and eroded brand equity.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Brand Whisper 01 — our AI evaluation engine — reads your brand guidelines, learns your
                visual identity, and gives every design an honest, expert review in seconds. It&apos;s
                like having a senior creative director available 24/7, for every design, at every
                stage of production.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-xs text-zinc-500 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-violet-400 tracking-widest uppercase mb-3">What we believe</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Principles behind Whisperly
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-zinc-400 mb-8">
            5,000 free credits. No credit card required. Your first brand evaluation in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20"
            >
              Start free trial
            </Link>
            <Link
              href="/features"
              className="px-6 py-3 border border-white/[0.12] text-zinc-300 font-medium rounded-xl hover:bg-white/[0.04] transition-colors"
            >
              Explore features
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
