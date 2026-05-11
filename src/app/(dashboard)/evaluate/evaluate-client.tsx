"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Star, CheckCircle, XCircle,
  Lightbulb, TrendingUp, Image as ImageIcon, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { cn, scoreToGrade, scoreToColor, formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Platform, PostType } from "@/types";

const PLATFORMS: { value: Platform; label: string; emoji: string }[] = [
  { value: "instagram", label: "Instagram", emoji: "📸" },
  { value: "linkedin", label: "LinkedIn", emoji: "💼" },
  { value: "twitter", label: "X / Twitter", emoji: "🐦" },
  { value: "facebook", label: "Facebook", emoji: "📘" },
  { value: "tiktok", label: "TikTok", emoji: "🎵" },
];

const POST_TYPES_BY_PLATFORM: Record<Platform, { value: string; label: string }[]> = {
  instagram: [
    { value: "instagram_post", label: "Post" },
    { value: "carousel", label: "Carousel" },
    { value: "story", label: "Story" },
    { value: "reel_cover", label: "Reel Cover" },
    { value: "ad_creative", label: "Ad Creative" },
  ],
  linkedin: [
    { value: "single_image", label: "Single Image Post" },
    { value: "carousel", label: "Carousel / Document" },
    { value: "ad_creative", label: "Ad Creative" },
  ],
  twitter: [
    { value: "single_image", label: "Image Post" },
    { value: "ad_creative", label: "Ad Creative" },
  ],
  facebook: [
    { value: "instagram_post", label: "Post" },
    { value: "story", label: "Story" },
    { value: "ad_creative", label: "Ad Creative" },
    { value: "cover_photo", label: "Cover Photo" },
  ],
  tiktok: [
    { value: "video_thumbnail", label: "Video Thumbnail" },
    { value: "ad_creative", label: "Ad Creative" },
  ],
};

const SCORE_METRICS = [
  { key: "brandConsistency", label: "Brand Consistency" },
  { key: "typographyScore", label: "Typography" },
  { key: "colorScore", label: "Color Usage" },
  { key: "layoutScore", label: "Layout" },
  { key: "hierarchyScore", label: "Visual Hierarchy" },
  { key: "toneScore", label: "Tone of Voice" },
  { key: "emotionalScore", label: "Emotional Impact" },
  { key: "aestheticsScore", label: "Aesthetics" },
  { key: "ctaScore", label: "CTA Quality" },
  { key: "audienceFitScore", label: "Audience Fit" },
];

interface EvaluationResult {
  id: string;
  overallScore: number;
  brandConsistency: number;
  typographyScore: number;
  colorScore: number;
  layoutScore: number;
  hierarchyScore: number;
  toneScore: number;
  emotionalScore: number;
  aestheticsScore: number;
  ctaScore: number;
  audienceFitScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  fullAnalysis: string;
  imageUrl: string;
  postType: string;
  createdAt: string;
  brand?: { name: string };
}

interface Props {
  brands: { id: string; name: string }[];
  recentEvaluations: EvaluationResult[];
}

export function EvaluateClient({ brands, recentEvaluations }: Props) {
  const [selectedBrand, setSelectedBrand] = useState(brands[0]?.id || "");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [postType, setPostType] = useState<PostType>("instagram_post");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<EvaluationResult[]>(recentEvaluations);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  async function handleEvaluate() {
    if (!file || !selectedBrand) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("brandId", selectedBrand);
      formData.append("postType", postType);
      formData.append("platform", platform);
      formData.append("image", file);

      const res = await fetch("/api/evaluate", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      const evalResult = data.evaluation;
      setResult(evalResult);
      setHistory((prev) => [evalResult, ...prev]);
      toast.success("Evaluation complete!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Upload Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Upload Design</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* Brand selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Globe className="w-3 h-3" /> Platform
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => {
                        setPlatform(p.value);
                        const firstType = POST_TYPES_BY_PLATFORM[p.value][0]?.value || "instagram_post";
                        setPostType(firstType as PostType);
                      }}
                      title={p.label}
                      className={cn(
                        "flex items-center justify-center py-2 rounded-lg border text-base transition-all",
                        platform === p.value
                          ? "border-primary/40 bg-primary/10"
                          : "border-border hover:border-border/80 hover:bg-muted/40"
                      )}
                    >
                      {p.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Post type */}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Content Type</label>
                <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_TYPES_BY_PLATFORM[platform].map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Drop Zone */}
              <div
                {...getRootProps()}
                className={cn(
                  "relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all duration-200",
                  isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                  preview ? "aspect-square" : "aspect-video"
                )}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-contain bg-muted/30"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      isDragActive ? "bg-primary/10" : "bg-muted"
                    )}>
                      <ImageIcon className={cn("w-5 h-5", isDragActive ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {isDragActive ? "Drop it!" : "Drop design here"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        JPG, PNG, WEBP — max 20MB
                      </p>
                    </div>
                  </div>
                )}
                {preview && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-medium">Click to change</p>
                  </div>
                )}
              </div>

              <Button
                variant="gradient"
                className="w-full gap-2"
                disabled={!file || !selectedBrand || loading}
                onClick={handleEvaluate}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Evaluate Design
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          {history.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">History</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {history.slice(0, 5).map((eval_) => (
                  <button
                    key={eval_.id}
                    onClick={() => setResult(eval_)}
                    className={cn(
                      "w-full flex items-center gap-2.5 p-2.5 rounded-lg transition-colors text-left",
                      result?.id === eval_.id ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/60"
                    )}
                  >
                    <div className="w-8 h-8 rounded-md bg-muted overflow-hidden shrink-0 relative">
                      <Image
                        src={eval_.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium capitalize truncate">
                        {eval_.postType?.replace(/_/g, " ")}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(new Date(eval_.createdAt))}
                      </p>
                    </div>
                    <span className={cn("text-xs font-bold", scoreToColor(eval_.overallScore))}>
                      {Math.round(eval_.overallScore)}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Results Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full py-24 gap-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 animate-pulse">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">Analyzing your design</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Creative director AI is reviewing...
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <EvaluationResult result={result} />
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-24 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-semibold mb-1">Ready to evaluate</p>
                <p className="text-sm text-muted-foreground max-w-[240px]">
                  Upload a design on the left to get an AI brand evaluation
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function EvaluationResult({ result }: { result: EvaluationResult }) {
  return (
    <div className="space-y-4">
      {/* Overall Score Header */}
      <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-5">
            <ScoreRing score={result.overallScore} size={100} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={
                    result.overallScore >= 75
                      ? "success"
                      : result.overallScore >= 60
                      ? "warning"
                      : "destructive"
                  }
                >
                  {scoreToGrade(result.overallScore)}
                </Badge>
                <span className="text-xs text-muted-foreground capitalize">
                  {result.postType?.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-2xl font-bold">
                {scoreToGrade(result.overallScore)} Design
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Overall brand evaluation score
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Score Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-2.5">
            {SCORE_METRICS.map((metric, i) => {
              const score = result[metric.key as keyof typeof result] as number;
              return (
                <motion.div
                  key={metric.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs text-muted-foreground w-28 shrink-0">{metric.label}</span>
                  <div className="flex-1">
                    <Progress
                      value={score}
                      className="h-1.5"
                    />
                  </div>
                  <span className={cn("text-xs font-semibold w-8 text-right", scoreToColor(score))}>
                    {Math.round(score)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Analysis + Strengths/Weaknesses/Suggestions */}
      <Tabs defaultValue="analysis">
        <TabsList className="w-full">
          <TabsTrigger value="analysis" className="flex-1 text-xs">Analysis</TabsTrigger>
          <TabsTrigger value="strengths" className="flex-1 text-xs">Strengths</TabsTrigger>
          <TabsTrigger value="weaknesses" className="flex-1 text-xs">Weaknesses</TabsTrigger>
          <TabsTrigger value="suggestions" className="flex-1 text-xs">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <Card className="border-border/50 mt-2">
            <CardContent className="p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {result.fullAnalysis}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths">
          <Card className="border-border/50 mt-2">
            <CardContent className="p-4 space-y-2.5">
              {result.strengths?.map((strength, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{strength}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weaknesses">
          <Card className="border-border/50 mt-2">
            <CardContent className="p-4 space-y-2.5">
              {result.weaknesses?.map((weakness, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{weakness}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions">
          <Card className="border-border/50 mt-2">
            <CardContent className="p-4 space-y-2.5">
              {result.suggestions?.map((suggestion, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{suggestion}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
