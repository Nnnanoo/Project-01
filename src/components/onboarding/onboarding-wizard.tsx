"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BrandInfoStep } from "./steps/brand-info-step";
import { VisualIdentityStep } from "./steps/visual-identity-step";
import { SocialMediaStep } from "./steps/social-media-step";
import { AssetsUploadStep } from "./steps/assets-upload-step";
import { OnboardingComplete } from "./onboarding-complete";
import type { OnboardingData } from "@/types";

const STEPS = [
  { id: 1, title: "Brand Info", description: "Tell us about your brand" },
  { id: 2, title: "Visual Identity", description: "Define your visual style" },
  { id: 3, title: "Social Media", description: "Your social presence" },
  { id: 4, title: "Upload Assets", description: "Brand files & guidelines" },
];

const INITIAL_DATA: OnboardingData = {
  brandInfo: {
    name: "",
    industry: "",
    country: "",
    description: "",
    targetAudience: "",
    competitors: "",
    personality: [],
    toneOfVoice: "",
    mission: "",
    vision: "",
  },
  visualIdentity: {
    preferredColors: "",
    typographyStyle: "",
    designStyle: "",
    contentStyle: "",
    exampleBrands: "",
  },
  socialMedia: {
    instagramUsername: "",
    mainPlatform: "",
    marketingGoals: [],
    contentTypes: [],
    postingFrequency: "",
  },
};

export function OnboardingWizard() {
  const _router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [brandId, setBrandId] = useState<string>("");

  const progress = ((currentStep - 1) / STEPS.length) * 100;

  function updateData(section: keyof OnboardingData, values: Partial<OnboardingData[typeof section]>) {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...values },
    }));
  }

  function nextStep() {
    if (currentStep < STEPS.length) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      uploadedFiles.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/onboarding", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setBrandId(result.brandId);
        setComplete(true);
      }
    } catch {
      // handled silently, user can retry
    } finally {
      setSubmitting(false);
    }
  }

  if (complete) {
    return <OnboardingComplete brandId={brandId} brandName={data.brandInfo.name} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-sm">Afloatter</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </header>

      {/* Step Nav */}
      <div className="border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors",
                  currentStep === step.id
                    ? "bg-primary/10 text-primary font-medium"
                    : step.id < currentStep
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                    step.id < currentStep
                      ? "bg-emerald-500 text-white"
                      : currentStep === step.id
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.id < currentStep ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    step.id
                  )}
                </div>
                {step.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {currentStep === 1 && (
              <BrandInfoStep
                data={data.brandInfo}
                onChange={(values) => updateData("brandInfo", values)}
              />
            )}
            {currentStep === 2 && (
              <VisualIdentityStep
                data={data.visualIdentity}
                onChange={(values) => updateData("visualIdentity", values)}
              />
            )}
            {currentStep === 3 && (
              <SocialMediaStep
                data={data.socialMedia}
                onChange={(values) => updateData("socialMedia", values)}
              />
            )}
            {currentStep === 4 && (
              <AssetsUploadStep
                files={uploadedFiles}
                onChange={setUploadedFiles}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Nav */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              variant="gradient"
              onClick={nextStep}
              className="gap-1.5 min-w-[120px]"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="gradient"
              onClick={handleSubmit}
              disabled={submitting}
              className="gap-1.5 min-w-[160px]"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Build Brand Brain
                </>
              )}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
