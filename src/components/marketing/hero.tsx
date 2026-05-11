"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

function MockEvaluationCard() {
  const scores = [
    { label: "Brand Consistency", value: 92 },
    { label: "Platform Fit", value: 96 },
    { label: "Audience Fit", value: 78 },
    { label: "Visual Hierarchy", value: 85 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      className="relative w-full max-w-sm mx-auto lg:mx-0"
    >
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 blur-3xl rounded-3xl" />

      <div className="relative bg-zinc-900/90 border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
        {/* Card header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-white">Brand Whisper 01</span>
          </div>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
            Complete
          </span>
        </div>

        {/* Overall score */}
        <div className="px-5 py-5 flex items-center gap-5 border-b border-white/[0.06]">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26 * 0.87} ${2 * Math.PI * 26}`}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">87</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Overall Score</p>
            <p className="text-sm font-semibold text-white">Excellent</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Instagram Post · Nike Brand</p>
          </div>
        </div>

        {/* Category scores */}
        <div className="px-5 py-4 space-y-3">
          {scores.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-zinc-400">{s.label}</span>
                <span className="text-[11px] font-semibold text-white">{s.value}</span>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI summary */}
        <div className="px-5 pb-5">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">Strong brand alignment.</span>{" "}
              The typography hierarchy and color usage are consistent with brand guidelines. Consider increasing CTA prominence for higher conversion.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#09090B]">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3.5 py-1.5 rounded-full mb-7"
            >
              <Sparkles className="w-3 h-3" />
              Introducing Brand Whisper 01
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6"
            >
              AI that thinks like a{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                creative director
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl"
            >
              Upload your brand guidelines. Evaluate any social media design in seconds.
              Get specific, actionable feedback — not generic AI output.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-xl shadow-violet-500/25 text-sm"
              >
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-white/[0.1] text-zinc-300 hover:text-white hover:border-white/20 font-medium px-6 py-3 rounded-xl transition-all text-sm"
              >
                See how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {[
                "5,000 credits free",
                "No credit card required",
                "Cancel anytime",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column: mock UI */}
          <div className="flex justify-center lg:justify-end">
            <MockEvaluationCard />
          </div>
        </div>
      </div>
    </section>
  );
}
