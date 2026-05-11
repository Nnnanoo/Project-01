"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "What are credits and how are they used?",
    answer:
      "Credits are the currency of Brand Whisper 01. Each action consumes a small number of credits: a design evaluation costs 100 credits, an Instagram feed analysis costs 200 credits, and each assistant message costs 10 credits. Every new account starts with 5,000 free credits — enough for 50 evaluations before you need to upgrade.",
  },
  {
    question: "How does Brand Whisper 01 analyze my designs?",
    answer:
      "Brand Whisper 01 uses GPT-4o Vision AI to visually analyze your uploaded designs. It compares the design against your extracted brand identity (colors, typography, tone, personality) and evaluates it across 6 dimensions: brand consistency, platform optimization, audience fit, visual hierarchy, creative effectiveness, and emotional alignment. Results are returned in seconds.",
  },
  {
    question: "Which social media platforms does it support?",
    answer:
      "Brand Whisper 01 currently supports Instagram, LinkedIn, X/Twitter, Facebook, and TikTok. When you select a platform, the evaluation adapts its criteria to match that platform's design conventions, audience expectations, and performance factors. A LinkedIn evaluation focuses on professionalism and readability; an Instagram evaluation focuses on visual impact and feed aesthetics.",
  },
  {
    question: "How do I upload my brand guidelines?",
    answer:
      "During onboarding, you upload your brand PDF, logos, moodboards, and any other brand assets. Brand Whisper 01 automatically extracts your color palette, typography, tone of voice, and visual personality from these files — no manual configuration required. If some information can't be found, we'll ask you to fill in just the missing fields.",
  },
  {
    question: "Is my brand data private and secure?",
    answer:
      "Yes. Your brand guidelines, uploaded assets, and evaluation data are private to your account. We do not use your brand data to train AI models or share it with other customers. All files are stored securely and are only processed to power your evaluations.",
  },
  {
    question: "Can I use Whisperly for multiple brands?",
    answer:
      "Multiple brand workspaces are available on the Pro and Agency plans. Each brand has its own Brand Whisper 01 configuration, evaluation history, and AI assistant — so you can manage multiple clients or product lines cleanly from a single account.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel at any time from your account settings. After cancellation, you keep access to your plan's features until the end of the billing period. Your account then reverts to the free tier and you retain your evaluation history.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm font-medium text-white pr-4">{question}</span>
        <span className="text-zinc-500 shrink-0">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="bg-[#09090B] py-24 lg:py-32 border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-violet-400 tracking-widest uppercase mb-3"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-white tracking-tight"
          >
            Common questions
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-2"
        >
          {FAQS.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
