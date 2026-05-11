"use client";

import { motion } from "framer-motion";
import { Upload, Zap, BarChart2 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your brand guidelines",
    description:
      "Start by uploading your brand PDF, logos, moodboards, and assets. Brand Whisper 01 automatically extracts your color palette, typography, tone of voice, and brand personality — no manual setup required.",
    highlight: "AI extracts your identity automatically",
  },
  {
    number: "02",
    icon: Zap,
    title: "Upload a design & select platform",
    description:
      "Drop in any social media design. Select your target platform — Instagram, LinkedIn, X/Twitter, Facebook, or TikTok — and Brand Whisper 01 applies the right evaluation criteria for that specific context.",
    highlight: "Platform-specific analysis",
  },
  {
    number: "03",
    icon: BarChart2,
    title: "Get instant creative feedback",
    description:
      "Receive a complete scorecard covering 6 evaluation dimensions, along with specific improvement suggestions, caption ideas, and a strategic creative director summary you can act on immediately.",
    highlight: "Results in seconds",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#09090B] py-24 lg:py-32 border-t border-white/[0.04]">
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
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4"
          >
            From guidelines to insights
            <br />
            <span className="text-zinc-500">in three steps</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 relative">
          {/* Connector line on desktop */}
          <div className="hidden lg:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col"
            >
              {/* Icon + number */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center shrink-0 relative z-10">
                  <step.icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-3xl font-bold text-white/[0.07]">{step.number}</span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">{step.description}</p>

              <div className="inline-flex items-center gap-1.5 text-xs text-violet-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                {step.highlight}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
