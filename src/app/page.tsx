import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="bg-[#09090B] min-h-screen">
      <MarketingNav />
      <Hero />
      <Features />

      {/* Stats / trust bar */}
      <section className="bg-[#09090B] border-y border-white/[0.04] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: "6", label: "Evaluation dimensions" },
              { value: "5", label: "Platforms supported" },
              { value: "5,000", label: "Free credits on signup" },
              { value: "<5s", label: "Average evaluation time" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <Pricing />
      <FAQ />

      {/* Bottom CTA */}
      <section className="bg-[#09090B] py-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to evaluate your brand?
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
            Start with 5,000 free credits. No credit card required.
            Set up your brand in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-xl shadow-violet-500/25 text-sm"
            >
              Start free trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border border-white/[0.1] text-zinc-300 hover:text-white hover:border-white/20 font-medium px-8 py-3.5 rounded-xl transition-all text-sm"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
