"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { OnboardingData } from "@/types";

interface Props {
  data: OnboardingData["platforms"];
  onChange: (values: Partial<OnboardingData["platforms"]>) => void;
}

const PLATFORMS = [
  { id: "instagram", label: "Instagram", emoji: "📸" },
  { id: "linkedin", label: "LinkedIn", emoji: "💼" },
  { id: "twitter", label: "X / Twitter", emoji: "🐦" },
  { id: "facebook", label: "Facebook", emoji: "📘" },
  { id: "tiktok", label: "TikTok", emoji: "🎵" },
];

const MARKETING_GOALS = [
  "Brand awareness", "Lead generation", "Community building",
  "Product sales", "Thought leadership", "Customer engagement",
  "Recruitment", "Event promotion",
];

const CONTENT_TYPES = [
  "Educational posts", "Product showcases", "Behind the scenes",
  "Customer stories", "Promotions & offers", "Industry news",
  "Inspirational content", "Team culture",
];

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "3-5x_week", label: "3–5× per week" },
  { value: "1-2x_week", label: "1–2× per week" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly or less" },
];

export function PlatformSetupStep({ data, onChange }: Props) {
  function togglePlatform(id: string) {
    const current = data.selectedPlatforms;
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    const newMain = next.includes(data.mainPlatform) ? data.mainPlatform : (next[0] || "");
    onChange({ selectedPlatforms: next, mainPlatform: newMain });
  }

  function toggleGoal(goal: string) {
    const current = data.marketingGoals;
    onChange({
      marketingGoals: current.includes(goal)
        ? current.filter((g) => g !== goal)
        : [...current, goal],
    });
  }

  function toggleContent(type: string) {
    const current = data.contentTypes;
    onChange({
      contentTypes: current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type],
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1">Platform setup</h2>
        <p className="text-sm text-muted-foreground">
          Tell Brand Whisper 01 where you post. The AI evaluation engine adapts its
          analysis based on each platform&apos;s unique conventions and audience expectations.
          Adding your social handles lets the AI factor in your existing presence.
        </p>
      </div>

      {/* Platform selector */}
      <div className="space-y-3">
        <Label>Where do you post? (select all that apply)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PLATFORMS.map((p) => {
            const selected = data.selectedPlatforms.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id)}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                  selected
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "border-border hover:border-border/80 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="text-lg">{p.emoji}</span>
                <span className="text-sm font-medium">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary platform */}
      {data.selectedPlatforms.length > 1 && (
        <div className="space-y-1.5">
          <Label htmlFor="mainPlatform">Primary platform</Label>
          <Select
            value={data.mainPlatform}
            onValueChange={(v) => onChange({ mainPlatform: v })}
          >
            <SelectTrigger id="mainPlatform">
              <SelectValue placeholder="Select primary platform" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.filter((p) => data.selectedPlatforms.includes(p.id)).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.emoji} {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Social media handles */}
      {(data.selectedPlatforms.includes("instagram") ||
        data.selectedPlatforms.includes("linkedin") ||
        data.selectedPlatforms.includes("twitter")) && (
        <div className="space-y-4 border border-border/50 rounded-xl p-4 bg-muted/20">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Social media handles (optional — improves AI evaluation context)
          </p>

          {data.selectedPlatforms.includes("instagram") && (
            <div className="space-y-1.5">
              <Label htmlFor="igUsername">Instagram username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                <Input
                  id="igUsername"
                  value={data.instagramUsername}
                  onChange={(e) => onChange({ instagramUsername: e.target.value.replace("@", "") })}
                  placeholder="yourbrand"
                  className="pl-7"
                />
              </div>
            </div>
          )}

          {data.selectedPlatforms.includes("linkedin") && (
            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl">LinkedIn company page URL</Label>
              <Input
                id="linkedinUrl"
                value={data.linkedinUrl}
                onChange={(e) => onChange({ linkedinUrl: e.target.value })}
                placeholder="linkedin.com/company/yourbrand"
              />
            </div>
          )}

          {data.selectedPlatforms.includes("twitter") && (
            <div className="space-y-1.5">
              <Label htmlFor="twitterUsername">X / Twitter handle</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                <Input
                  id="twitterUsername"
                  value={data.twitterUsername}
                  onChange={(e) => onChange({ twitterUsername: e.target.value.replace("@", "") })}
                  placeholder="yourbrand"
                  className="pl-7"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Marketing goals */}
      <div className="space-y-3">
        <Label>Marketing goals (select all that apply)</Label>
        <div className="flex flex-wrap gap-2">
          {MARKETING_GOALS.map((goal) => {
            const selected = data.marketingGoals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-all",
                  selected
                    ? "bg-primary/10 border-primary/40 text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                )}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content types */}
      <div className="space-y-3">
        <Label>Content types you create</Label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((type) => {
            const selected = data.contentTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleContent(type)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-all",
                  selected
                    ? "bg-primary/10 border-primary/40 text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                )}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Posting frequency */}
      <div className="space-y-1.5">
        <Label htmlFor="frequency">How often do you post?</Label>
        <Select
          value={data.postingFrequency}
          onValueChange={(v) => onChange({ postingFrequency: v })}
        >
          <SelectTrigger id="frequency">
            <SelectValue placeholder="Select posting frequency" />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCIES.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
