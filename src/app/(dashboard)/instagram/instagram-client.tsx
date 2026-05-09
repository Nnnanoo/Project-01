"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Upload, Sparkles, TrendingUp,
  CheckCircle, Lightbulb, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/dashboard/score-ring";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn, scoreToColor, scoreToGrade, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface AnalysisResult {
  id: string;
  username: string;
  feedConsistency: number;
  brandConsistency: number;
  engagementQuality: number;
  contentDirection: string;
  visualStorytelling: number;
  postCount: number;
  analysisReport: string;
  recommendations: string[];
  createdAt: string;
  brand?: { name: string };
}

interface Props {
  brands: { id: string; name: string; instagramUsername?: string | null }[];
  recentAnalyses: AnalysisResult[];
}

const SCORE_METRICS = [
  { key: "feedConsistency", label: "Feed Consistency" },
  { key: "brandConsistency", label: "Brand Consistency" },
  { key: "engagementQuality", label: "Engagement Quality" },
  { key: "visualStorytelling", label: "Visual Storytelling" },
];

export function InstagramClient({ brands, recentAnalyses }: Props) {
  const [selectedBrand, setSelectedBrand] = useState(brands[0]?.id || "");
  const [username, setUsername] = useState(brands[0]?.instagramUsername || "");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history] = useState<AnalysisResult[]>(recentAnalyses);

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = [...files, ...accepted].slice(0, 9);
    setFiles(newFiles);
    newFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () =>
        setPreviews((prev) => {
          const next = [...prev];
          next[files.length] = reader.result as string;
          return next;
        });
      reader.readAsDataURL(f);
    });
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 10 * 1024 * 1024,
  });

  function handleBrandChange(brandId: string) {
    setSelectedBrand(brandId);
    const brand = brands.find((b) => b.id === brandId);
    if (brand?.instagramUsername) setUsername(brand.instagramUsername);
  }

  async function handleAnalyze() {
    if (!files.length || !selectedBrand) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("brandId", selectedBrand);
      formData.append("username", username);
      files.forEach((f) => formData.append("images", f));

      const res = await fetch("/api/instagram", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setResult(data.analysis);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  const avgScore = result
    ? Math.round(
        (result.feedConsistency + result.brandConsistency + result.engagementQuality + result.visualStorytelling) / 4
      )
    : null;

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Upload Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-500" />
                Upload Feed Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Brand</Label>
                <Select value={selectedBrand} onValueChange={handleBrandChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Instagram Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                  <Input
                    placeholder="yourbrand"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-7 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Grid Drop Zone */}
              {files.length > 0 ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {previews.slice(0, 9).map((p, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden relative">
                      <Image src={p} alt="" fill className="object-cover" unoptimized />
                    </div>
                  ))}
                  {files.length < 9 && (
                    <div
                      {...getRootProps()}
                      className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/40 flex items-center justify-center cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 text-center",
                    isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Upload feed posts</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload 6-9 recent posts for best results
                  </p>
                </div>
              )}

              {files.length > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  {files.length} post{files.length !== 1 ? "s" : ""} uploaded
                  {files.length < 6 && " · Upload more for better analysis"}
                </p>
              )}

              <Button
                variant="gradient"
                className="w-full gap-2"
                disabled={!files.length || !selectedBrand || loading}
                onClick={handleAnalyze}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Feed
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          {history.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Previous Analyses</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {history.slice(0, 4).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setResult(a)}
                    className={cn(
                      "w-full text-left flex items-center gap-2.5 p-2.5 rounded-lg transition-colors",
                      result?.id === a.id ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/60"
                    )}
                  >
                    <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5 text-pink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">@{a.username}</p>
                      <p className="text-[10px] text-muted-foreground">{formatDate(new Date(a.createdAt))}</p>
                    </div>
                    <span className={cn("text-xs font-bold", scoreToColor(a.feedConsistency))}>
                      {Math.round(a.feedConsistency)}%
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-6"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-pink-500/30 animate-pulse">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Analyzing your Instagram feed</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Reviewing consistency, brand alignment, and storytelling...
                  </p>
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Score Header */}
                <Card className="border-border/50">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-5 mb-4">
                      {avgScore !== null && <ScoreRing score={avgScore} size={90} label="Overall" />}
                      <div>
                        <Badge variant={avgScore && avgScore >= 75 ? "success" : "warning"} className="mb-1">
                          {avgScore !== null ? scoreToGrade(avgScore) : ""}
                        </Badge>
                        <h3 className="text-lg font-bold">@{result.username}</h3>
                        <p className="text-xs text-muted-foreground">
                          {result.postCount} posts analyzed · {formatDate(new Date(result.createdAt))}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {SCORE_METRICS.map((m) => {
                        const score = result[m.key as keyof typeof result] as number;
                        return (
                          <div key={m.key} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{m.label}</span>
                              <span className={cn("font-semibold", scoreToColor(score))}>{Math.round(score)}%</span>
                            </div>
                            <Progress value={score} className="h-1.5" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Content Direction */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-semibold">Content Direction</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.contentDirection}
                    </p>
                  </CardContent>
                </Card>

                {/* Full Report */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-semibold">Strategic Analysis</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {result.analysisReport}
                    </p>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <CardTitle className="text-sm font-semibold">Recommendations</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2.5">
                    {result.recommendations?.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-semibold mb-1">Ready to analyze</p>
                <p className="text-sm text-muted-foreground max-w-[240px]">
                  Upload 6-9 recent Instagram posts for a comprehensive feed analysis
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
