"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { UploadAssetsStep } from "./steps/upload-assets-step";
import { ReviewExtractionStep } from "./steps/review-extraction-step";
import { PlatformSetupStep } from "./steps/platform-setup-step";
import { OnboardingComplete } from "./onboarding-complete";
import { toast } from "sonner";
import type { OnboardingData, BrandExtraction } from "@/types";

const STEPS = [
  { id: 1, title: "Upload Assets", description: "Brand files & guidelines" },
  { id: 2, title: "Review Identity", description: "Confirm extracted data" },
  { id: 3, title: "Platforms", description: "Where you post" },
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
  },
  platforms: {
    selectedPlatforms: [],
    mainPlatform: "",
    instagramUsername: "",
    marketingGoals: [],
    contentTypes: [],
    postingFrequency: "",
  },
};

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [files, setFiles] = useState<File[]>([]);
  const [extraction, setExtraction] = useState<BrandExtraction | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [brandId, setBrandId] = useState<string>("");

  const progress = ((currentStep - 1) / STEPS.length) * 100;

  function updateBrandInfo(values: Partial<OnboardingData["brandInfo"]>) {
    setData((prev) => ({ ...prev, brandInfo: { ...prev.brandInfo, ...values } }));
  }

  function updatePlatforms(values: Partial<OnboardingData["platforms"]>) {
    setData((prev) => ({ ...prev, platforms: { ...prev.platforms, ...values } }));
  }

  async function handleExtract() {
    if (files.length === 0) return;
    setExtracting(true);
    setExtractionError(null);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/onboarding/extract", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Extraction failed");

      const ext: BrandExtraction = result.extraction;
      setExtraction(ext);

      // Pre-populate form from extraction
      updateBrandInfo({
        name: ext.brandName || "",
        industry: ext.industry || "",
        country: ext.country || "",
        description: ext.description || "",
        targetAudience: ext.targetAudience || "",
        personality: ext.personality.length > 0 ? ext.personality : [],
        toneOfVoice: ext.toneOfVoice || "",
      });

      // Advance to review step
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setExtractionError(
        err instanceof Error ? err.message : "Failed to extract brand identity. Please try again."
      );
    } finally {
      setExtracting(false);
    }
  }

  function nextStep() {
    if (currentStep === 1) {
      // Step 1 → 2 requires extraction to have run
      if (!extraction) {
        toast.error("Please upload files and extract your brand identity first.");
        return;
      }
    }
    if (currentStep === 2 && !data.brandInfo.name.trim()) {
      toast.error("Please enter your brand name before continuing.");
      return;
    }
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
    if (!data.brandInfo.name.trim()) {
      toast.error("Brand name is required.");
      return;
    }
    if (data.platforms.selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (extraction) {
        formData.append("extraction", JSON.stringify(extraction));
      }
      files.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/onboarding", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Onboarding failed");

      setBrandId(result.brandId);
      setComplete(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
              <span className="font-semibold text-sm">Whisperly</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </header>

      {/* Step nav */}
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
                  {step.id < currentStep ? <Check className="w-3 h-3" /> : step.id}
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
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {currentStep === 1 && (
              <UploadAssetsStep
                files={files}
                onChange={setFiles}
                extracting={extracting}
                extractionError={extractionError}
                onExtract={handleExtract}
              />
            )}
            {currentStep === 2 && extraction && (
              <ReviewExtractionStep
                extraction={extraction}
                data={data.brandInfo}
                onChange={updateBrandInfo}
              />
            )}
            {currentStep === 3 && (
              <PlatformSetupStep
                data={data.platforms}
                onChange={updatePlatforms}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav — hidden on step 1 while waiting for extraction */}
      {!(currentStep === 1 && !extraction) && (
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
                className="gap-1.5 min-w-[180px]"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up brand...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Complete setup
                  </>
                )}
              </Button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
