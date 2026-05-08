"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Brain, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  { icon: "📋", label: "Brand profile created" },
  { icon: "🧠", label: "Brand Brain initialized" },
  { icon: "🎨", label: "Visual identity mapped" },
  { icon: "✨", label: "AI analysis ready" },
];

interface Props {
  brandId: string;
  brandName: string;
}

export function OnboardingComplete({ brandName }: Props) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 6000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-500/30"
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-sm text-violet-500 font-medium">Brand Brain Built</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">
            {brandName ? `${brandName} is ready!` : "Your brand is ready!"}
          </h1>
          <p className="text-muted-foreground mb-8">
            Your AI-powered brand intelligence system has been created.
            Start evaluating designs and getting brand insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 text-left"
            >
              <span className="text-lg">{step.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{step.label}</p>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <Button
            variant="gradient"
            size="lg"
            className="w-full gap-2"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-xs text-muted-foreground">
            Redirecting automatically in a few seconds...
          </p>
        </motion.div>
      </div>
    </div>
  );
}
