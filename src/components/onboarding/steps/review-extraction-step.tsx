"use client";

import { CheckCircle, Sparkles, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { BrandExtraction, OnboardingData } from "@/types";

interface Props {
  extraction: BrandExtraction;
  data: OnboardingData["brandInfo"];
  onChange: (values: Partial<OnboardingData["brandInfo"]>) => void;
}

const PERSONALITY_OPTIONS = [
  "professional", "playful", "luxurious", "minimal", "bold",
  "approachable", "innovative", "traditional", "creative", "authoritative",
  "energetic", "sophisticated", "trustworthy", "friendly", "edgy",
];

const TONE_OPTIONS = [
  "professional", "casual", "inspirational", "educational",
  "bold", "friendly", "sophisticated", "conversational", "authoritative",
];

function ConfidenceBadge({ score }: { score: number }) {
  if (score >= 0.8) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
      <CheckCircle className="w-2.5 h-2.5" /> AI detected
    </span>
  );
  if (score >= 0.5) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
      <AlertCircle className="w-2.5 h-2.5" /> Please verify
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded-full">
      <Sparkles className="w-2.5 h-2.5" /> Please fill in
    </span>
  );
}

function RequiredBadge() {
  return (
    <span className="inline-flex items-center text-[10px] font-semibold text-red-500/80 tracking-wide uppercase">
      Required
    </span>
  );
}

export function ReviewExtractionStep({ extraction, data, onChange }: Props) {
  const conf = extraction.confidence || {};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1">Review your brand identity</h2>
        <p className="text-sm text-muted-foreground">
          Brand Whisper 01 extracted the following from your uploaded files.
          Fields marked <span className="text-amber-600 font-medium">Please verify</span> or{" "}
          <span className="text-muted-foreground font-medium">Please fill in</span> need your attention.
          Fields marked <span className="text-red-500 font-medium">Required</span> must be filled before continuing.
        </p>
      </div>

      {/* Extracted colors */}
      {extraction.colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Brand Colors</p>
            <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5" /> AI extracted
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {extraction.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-3 py-2">
                <div
                  className="w-5 h-5 rounded-md border border-border/50 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <p className="text-xs font-medium">{c.name || c.hex}</p>
                  <p className="text-[10px] text-muted-foreground">{c.hex} · {c.usage}</p>
                </div>
                {c.isPrimary && (
                  <span className="text-[10px] bg-violet-500/10 text-violet-600 px-1.5 py-0.5 rounded-full">Primary</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typography */}
      {extraction.typography?.primaryFont && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Typography</p>
            <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5" /> AI extracted
            </span>
          </div>
          <div className="bg-muted/50 border border-border rounded-xl p-3 flex items-center gap-3">
            <div className="text-2xl font-bold text-muted-foreground">Aa</div>
            <div>
              <p className="text-sm font-medium">{extraction.typography.primaryFont}</p>
              {extraction.typography.secondaryFont && (
                <p className="text-xs text-muted-foreground">Secondary: {extraction.typography.secondaryFont}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Personality */}
      {extraction.personality.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Brand Personality</p>
            <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-2.5 h-2.5" /> AI detected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {extraction.personality.map((p) => (
              <span key={p} className="text-xs bg-violet-500/10 text-violet-600 border border-violet-500/20 px-2.5 py-1 rounded-full capitalize">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Form fields */}
      <div className="border-t border-border/50 pt-6 space-y-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Complete your brand profile
        </p>

        {/* Brand name */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <RequiredBadge />
            <ConfidenceBadge score={conf.brandName ?? 0} />
          </div>
          <Input
            id="brandName"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Your brand name"
            className={!data.name.trim() ? "border-red-500/40 focus-visible:ring-red-500/30" : ""}
          />
        </div>

        {/* Target audience — required */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="audience">Target Audience</Label>
            <RequiredBadge />
            <ConfidenceBadge score={conf.targetAudience ?? 0} />
          </div>
          <Input
            id="audience"
            value={data.targetAudience}
            onChange={(e) => onChange({ targetAudience: e.target.value })}
            placeholder="e.g. Young professionals 25–35, luxury consumers in the GCC"
            className={!data.targetAudience.trim() ? "border-red-500/40 focus-visible:ring-red-500/30" : ""}
          />
        </div>

        {/* Country — required */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="country">Country</Label>
            <RequiredBadge />
            <ConfidenceBadge score={conf.country ?? 0} />
          </div>
          <Input
            id="country"
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
            placeholder="e.g. United States, Saudi Arabia, United Kingdom"
            className={!data.country.trim() ? "border-red-500/40 focus-visible:ring-red-500/30" : ""}
          />
        </div>

        {/* Geographical region — required */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="region">Geographical Region</Label>
            <RequiredBadge />
            <ConfidenceBadge score={conf.region ?? 0} />
          </div>
          <Input
            id="region"
            value={data.region}
            onChange={(e) => onChange({ region: e.target.value })}
            placeholder="e.g. North America, MENA, Europe, Southeast Asia, Global"
            className={!data.region.trim() ? "border-red-500/40 focus-visible:ring-red-500/30" : ""}
          />
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="industry">Industry</Label>
            <ConfidenceBadge score={conf.industry ?? 0} />
          </div>
          <Input
            id="industry"
            value={data.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
            placeholder="e.g. Fashion, Technology, Food & Beverage"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="description">Brand Description</Label>
            <ConfidenceBadge score={conf.description ?? 0} />
          </div>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Briefly describe what your brand does and its positioning"
            rows={3}
          />
        </div>

        {/* Competitors */}
        <div className="space-y-1.5">
          <Label htmlFor="competitors">Competitors (optional)</Label>
          <Input
            id="competitors"
            value={data.competitors}
            onChange={(e) => onChange({ competitors: e.target.value })}
            placeholder="e.g. Nike, Adidas, Lululemon (comma-separated)"
          />
        </div>

        {/* Tone of voice */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Tone of Voice</Label>
            <ConfidenceBadge score={conf.toneOfVoice ?? 0} />
          </div>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange({ toneOfVoice: t })}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-all capitalize",
                  data.toneOfVoice === t
                    ? "bg-primary/10 border-primary/40 text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Brand personality (if not detected) */}
        {extraction.personality.length === 0 && (
          <div className="space-y-2">
            <Label>Brand Personality (select all that apply)</Label>
            <div className="flex flex-wrap gap-2">
              {PERSONALITY_OPTIONS.map((p) => {
                const selected = data.personality.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? data.personality.filter((v) => v !== p)
                        : [...data.personality, p];
                      onChange({ personality: next });
                    }}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full border transition-all capitalize",
                      selected
                        ? "bg-primary/10 border-primary/40 text-primary font-medium"
                        : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
