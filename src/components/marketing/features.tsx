"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck, Globe, Users, Type, Sparkles, MessageSquare,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    title: "Brand Consistency",
    description:
      "See exactly how closely each design aligns with your brand guidelines, color palette, typography rules, and visual identity.",
  },
  {
    icon: Globe,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    title: "Platform Optimization",
    description:
      "Evaluation adapts to Instagram, LinkedIn, X/Twitter, Facebook, and TikTok — respecting each platform's design conventions and audience.",
  },
  {
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    title: "Audience Fit",
    description:
      "Understand whether your design speaks to your actual target audience and whether the visual language matches their expectations.",
  },
  {
    icon: Type,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    title: "Visual Hierarchy",
    description:
      "Get a detailed review of typography sizing, spacing, composition, readability, and overall layout structure.",
  },
  {
    icon: Sparkles,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    title: "AI Creative Director",
    description:
      "Receive strategic feedback written like a senior creative director — specific, referenced to actual design elements, never generic.",
  },
  {
    icon: MessageSquare,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    title: "Caption & Copy Ideas",
    description:
      "Get suggested captions, CTA copy, and creative direction tailored to your brand's tone of voice and platform context.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-[#09090B] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-violet-400 tracking-widest uppercase mb-3"
          >
            What Brand Whisper 01 evaluates
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4"
          >
            Everything your brand needs
            <br />
            <span className="text-zinc-500">to stay consistent</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Six evaluation dimensions give you a complete picture of how well your
            social media design performs — from brand alignment to platform fit.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
