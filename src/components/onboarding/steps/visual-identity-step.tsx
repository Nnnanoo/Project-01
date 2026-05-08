"use client";

import { Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TYPOGRAPHY_STYLES = [
  { value: "serif", label: "Serif", desc: "Elegant & traditional" },
  { value: "sans-serif", label: "Sans Serif", desc: "Modern & clean" },
  { value: "display", label: "Display", desc: "Bold & expressive" },
  { value: "mixed", label: "Mixed", desc: "Combination of styles" },
];

const DESIGN_STYLES = [
  { value: "minimalist", label: "Minimalist", desc: "Clean, lots of whitespace" },
  { value: "maximalist", label: "Maximalist", desc: "Rich, layered, bold" },
  { value: "editorial", label: "Editorial", desc: "Magazine-style layouts" },
  { value: "flat", label: "Flat", desc: "Simple shapes & icons" },
  { value: "gradient", label: "Gradient", desc: "Colorful gradients & flows" },
  { value: "brutalist", label: "Brutalist", desc: "Raw, bold, unconventional" },
];

const CONTENT_STYLES = [
  { value: "educational", label: "Educational" },
  { value: "inspirational", label: "Inspirational" },
  { value: "promotional", label: "Promotional" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "behind-scenes", label: "Behind the Scenes" },
  { value: "product-focused", label: "Product Focused" },
];

interface Props {
  data: {
    preferredColors: string;
    typographyStyle: string;
    designStyle: string;
    contentStyle: string;
    exampleBrands: string;
  };
  onChange: (values: Partial<Props["data"]>) => void;
}

export function VisualIdentityStep({ data, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
          <Palette className="w-5 h-5 text-pink-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Visual Identity</h2>
          <p className="text-sm text-muted-foreground">
            Define your brand&apos;s visual language
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="colors">Preferred Colors</Label>
          <Input
            id="colors"
            placeholder="e.g. Deep navy, warm cream, gold accent — or hex codes"
            value={data.preferredColors}
            onChange={(e) => onChange({ preferredColors: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Describe your brand colors or paste hex codes separated by commas
          </p>
        </div>

        <div className="space-y-3">
          <Label>Typography Style</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TYPOGRAPHY_STYLES.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => onChange({ typographyStyle: style.value })}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all duration-150",
                  data.typographyStyle === style.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80"
                )}
              >
                <div
                  className="text-lg font-bold mb-0.5"
                  style={{
                    fontFamily:
                      style.value === "serif"
                        ? "Georgia, serif"
                        : style.value === "display"
                        ? "Impact, sans-serif"
                        : "system-ui",
                  }}
                >
                  Aa
                </div>
                <div className="text-xs font-medium">{style.label}</div>
                <div className="text-xs text-muted-foreground">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Design Style</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DESIGN_STYLES.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => onChange({ designStyle: style.value })}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all duration-150",
                  data.designStyle === style.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80"
                )}
              >
                <div className="text-sm font-semibold">{style.label}</div>
                <div className="text-xs text-muted-foreground">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Preferred Content Style</Label>
          <div className="flex flex-wrap gap-2">
            {CONTENT_STYLES.map((style) => (
              <button
                key={style.value}
                type="button"
                onClick={() => onChange({ contentStyle: style.value })}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-all duration-150",
                  data.contentStyle === style.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exampleBrands">Example Brands You Like</Label>
          <Input
            id="exampleBrands"
            placeholder="e.g. Apple, Muji, Aesop, Supreme"
            value={data.exampleBrands}
            onChange={(e) => onChange({ exampleBrands: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Brands whose visual style you admire (doesn&apos;t have to be your industry)
          </p>
        </div>
      </div>
    </div>
  );
}
