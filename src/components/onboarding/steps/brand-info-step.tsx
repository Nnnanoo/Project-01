"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PERSONALITY_TRAITS = [
  "Bold", "Minimal", "Playful", "Elegant", "Professional",
  "Youthful", "Luxury", "Friendly", "Innovative", "Traditional",
  "Energetic", "Calm", "Edgy", "Warm", "Authoritative",
];

const INDUSTRIES = [
  "Fashion & Apparel", "Beauty & Cosmetics", "Food & Beverage",
  "Technology", "Health & Wellness", "Real Estate", "Retail",
  "Education", "Finance", "Entertainment", "Travel & Hospitality",
  "Sports & Fitness", "Architecture & Design", "E-commerce", "Other",
];

interface Props {
  data: {
    name: string; industry: string; country: string; description: string;
    targetAudience: string; competitors: string; personality: string[];
    toneOfVoice: string; mission: string; vision: string;
  };
  onChange: (values: Partial<Props["data"]>) => void;
}

export function BrandInfoStep({ data, onChange }: Props) {
  function togglePersonality(trait: string) {
    const current = data.personality;
    if (current.includes(trait)) {
      onChange({ personality: current.filter((t) => t !== trait) });
    } else if (current.length < 5) {
      onChange({ personality: [...current, trait] });
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Brand Information</h2>
          <p className="text-sm text-muted-foreground">
            Tell us about your brand identity
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">
              Brand Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="brandName"
              placeholder="e.g. Nike, Apple, Zara"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Industry</Label>
            <Select
              value={data.industry}
              onValueChange={(v) => onChange({ industry: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country / Market</Label>
          <Input
            id="country"
            placeholder="e.g. Saudi Arabia, UAE, United States"
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Brand Description</Label>
          <Textarea
            id="description"
            placeholder="What does your brand do? What makes it unique?"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience</Label>
          <Textarea
            id="audience"
            placeholder="Age, gender, lifestyle, interests, income level..."
            value={data.targetAudience}
            onChange={(e) => onChange({ targetAudience: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="competitors">Competitors</Label>
          <Input
            id="competitors"
            placeholder="e.g. Brand A, Brand B, Brand C"
            value={data.competitors}
            onChange={(e) => onChange({ competitors: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <div>
            <Label>Brand Personality <span className="text-muted-foreground text-xs">(pick up to 5)</span></Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {PERSONALITY_TRAITS.map((trait) => (
              <motion.button
                key={trait}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePersonality(trait)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-all duration-150",
                  data.personality.includes(trait)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                )}
              >
                {trait}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone of Voice</Label>
          <Input
            id="tone"
            placeholder="e.g. Warm, friendly, professional, inspiring"
            value={data.toneOfVoice}
            onChange={(e) => onChange({ toneOfVoice: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mission">Brand Mission</Label>
            <Textarea
              id="mission"
              placeholder="What is your brand's purpose?"
              value={data.mission}
              onChange={(e) => onChange({ mission: e.target.value })}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vision">Brand Vision</Label>
            <Textarea
              id="vision"
              placeholder="Where do you see your brand in 5-10 years?"
              value={data.vision}
              onChange={(e) => onChange({ vision: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
