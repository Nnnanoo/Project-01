"use client";

import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MARKETING_GOALS = [
  "Brand Awareness", "Lead Generation", "Community Building",
  "Sales & Conversions", "Customer Retention", "Thought Leadership",
  "Product Launches", "Event Promotion",
];

const CONTENT_TYPES = [
  "Photos", "Reels / Short Videos", "Carousels", "Stories",
  "Infographics", "User-Generated Content", "Behind the Scenes",
  "Testimonials", "Educational Posts",
];

const PLATFORMS = [
  "Instagram", "TikTok", "LinkedIn", "Twitter / X",
  "Facebook", "YouTube", "Pinterest", "Snapchat",
];

const FREQUENCIES = [
  "Daily", "3-5x per week", "1-2x per week",
  "A few times a month", "Monthly",
];

interface Props {
  data: {
    instagramUsername: string;
    mainPlatform: string;
    marketingGoals: string[];
    contentTypes: string[];
    postingFrequency: string;
  };
  onChange: (values: Partial<Props["data"]>) => void;
}

export function SocialMediaStep({ data, onChange }: Props) {
  function toggleMulti(key: "marketingGoals" | "contentTypes", value: string) {
    const current = data[key];
    if (current.includes(value)) {
      onChange({ [key]: current.filter((v) => v !== value) });
    } else {
      onChange({ [key]: [...current, value] });
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Camera className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Social Media</h2>
          <p className="text-sm text-muted-foreground">
            Your social media presence and strategy
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
              <Input
                id="instagram"
                placeholder="yourbrand"
                value={data.instagramUsername}
                onChange={(e) => onChange({ instagramUsername: e.target.value })}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Main Platform</Label>
            <Select
              value={data.mainPlatform}
              onValueChange={(v) => onChange({ mainPlatform: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select main platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Posting Frequency</Label>
          <div className="flex flex-wrap gap-2">
            {FREQUENCIES.map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => onChange({ postingFrequency: freq })}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-all duration-150",
                  data.postingFrequency === freq
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Marketing Goals <span className="text-xs text-muted-foreground">(select all that apply)</span></Label>
          <div className="flex flex-wrap gap-2">
            {MARKETING_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => toggleMulti("marketingGoals", goal)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-all duration-150",
                  data.marketingGoals.includes(goal)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Content Types <span className="text-xs text-muted-foreground">(select all that apply)</span></Label>
          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleMulti("contentTypes", type)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-all duration-150",
                  data.contentTypes.includes(type)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
