"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";

const PLANS = [
  {
    name: "Free Trial",
    price: null,
    priceLabel: "Free",
    description: "Start evaluating. No credit card needed.",
    credits: "5,000 credits",
    highlight: false,
    cta: "Start free trial",
    ctaHref: "/register",
    features: [
      "50 design evaluations",
      "20 feed analyses",
      "Brand Whisper 01 AI extraction",
      "Brand AI assistant",
      "All 6 evaluation dimensions",
      "Platform selection",
    ],
  },
  {
    name: "Starter",
    price: 29,
    priceLabel: "$29",
    description: "For growing brands and content creators.",
    credits: "10,000 credits / month",
    highlight: false,
    cta: "Get started",
    ctaHref: "/register",
    features: [
      "100 evaluations / month",
      "50 feed analyses / month",
      "Priority processing",
      "Export PDF reports",
      "Email support",
      "Everything in Free Trial",
    ],
  },
  {
    name: "Pro",
    price: 79,
    priceLabel: "$79",
    description: "For marketing teams and agencies.",
    credits: "40,000 credits / month",
    highlight: true,
    cta: "Get started",
    ctaHref: "/register",
    features: [
      "400 evaluations / month",
      "200 feed analyses / month",
      "Multiple brand workspaces",
      "Advanced analytics dashboard",
      "API access",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    price: 199,
    priceLabel: "$199",
    description: "Unlimited power for large teams.",
    credits: "Unlimited credits",
    highlight: false,
    cta: "Contact us",
    ctaHref: "/register",
    features: [
      "Unlimited evaluations",
      "Unlimited feed analyses",
      "Team member access",
      "White-label reports",
      "Custom onboarding",
      "Dedicated account manager",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#09090B] py-24 lg:py-32 border-t border-white/[0.04]">
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
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4"
          >
            Start free.
            <span className="text-zinc-500"> Scale when ready.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-zinc-400 text-base max-w-lg mx-auto"
          >
            Every account starts with 5,000 free credits. No credit card required.
            Upgrade when you&apos;re ready to scale.
          </motion.p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative flex flex-col rounded-2xl p-6 border transition-all duration-300 ${
                plan.highlight
                  ? "bg-gradient-to-b from-violet-600/10 to-indigo-600/5 border-violet-500/30 shadow-xl shadow-violet-500/10"
                  : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    <Sparkles className="w-2.5 h-2.5" />
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-white">{plan.priceLabel}</span>
                  {plan.price && <span className="text-sm text-zinc-500">/ month</span>}
                </div>
                <p className="text-xs text-zinc-500">{plan.description}</p>
              </div>

              <div className="mb-5 px-3 py-2 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                <p className="text-xs font-medium text-violet-400">{plan.credits}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-xs text-zinc-400">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`block text-center text-sm font-medium py-2.5 rounded-xl transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-violet-500/20"
                    : "border border-white/[0.1] text-zinc-300 hover:text-white hover:border-white/20"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
