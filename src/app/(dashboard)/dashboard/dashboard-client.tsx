"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star, Camera, MessageSquare, Brain,
  TrendingUp, ArrowRight, Sparkles, CheckCircle,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate, scoreToGrade, scoreToColor, cn } from "@/lib/utils";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  brand: any | null;
  recentEvaluations: {
    id: string;
    overallScore: number;
    brandConsistency: number;
    postType: string;
    imageUrl: string;
    createdAt: Date;
    brand: { name: string };
  }[];
  recentAnalyses: {
    id: string;
    username: string;
    feedConsistency: number;
    brandConsistency: number;
    createdAt: Date;
    brand: { name: string };
  }[];
  avgScore: number | null;
}

export function DashboardClient({ brand, recentEvaluations, recentAnalyses, avgScore }: Props) {
  const brainReady = brand?.brandBrain?.processingStatus === "completed";

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      {/* Brand Brain Status Banner */}
      {brand && !brainReady && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-violet-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Brand Brain is initializing</p>
            <p className="text-xs text-muted-foreground">
              Your AI brand intelligence is being built. This usually takes 30–60 seconds.
            </p>
          </div>
          <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </motion.div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Avg. Score"
          value={avgScore !== null ? `${avgScore}/100` : "—"}
          change={avgScore !== null ? scoreToGrade(avgScore) : "No evaluations yet"}
          changeType={avgScore && avgScore >= 75 ? "positive" : avgScore && avgScore >= 60 ? "neutral" : "negative"}
          icon={TrendingUp}
          iconColor="text-violet-600"
          delay={0}
        />
        <MetricCard
          label="Evaluations"
          value={brand?._count.evaluations ?? 0}
          change="Design checks"
          icon={Star}
          iconColor="text-amber-600"
          delay={0.05}
        />
        <MetricCard
          label="Feed Analyses"
          value={brand?._count.analyses ?? 0}
          change="Instagram reports"
          icon={Camera}
          iconColor="text-pink-600"
          delay={0.1}
        />
        <MetricCard
          label="AI Sessions"
          value={brand?._count.chatSessions ?? 0}
          change="Brand conversations"
          icon={MessageSquare}
          iconColor="text-blue-600"
          delay={0.15}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Evaluations */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold">Recent Evaluations</CardTitle>
              <Link href="/evaluate">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {recentEvaluations.length === 0 ? (
                <EmptyState
                  icon={Star}
                  title="No evaluations yet"
                  description="Upload your first design to get an AI evaluation"
                  href="/evaluate"
                  cta="Evaluate a design"
                />
              ) : (
                <div className="space-y-3">
                  {recentEvaluations.map((eval_, i) => (
                    <motion.div
                      key={eval_.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
                    >
                      {/* Image thumbnail */}
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0 relative">
                        <Image
                          src={eval_.imageUrl}
                          alt="Design"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium capitalize truncate">
                            {eval_.postType.replace(/_/g, " ")}
                          </p>
                          <Badge
                            variant={
                              eval_.overallScore >= 75
                                ? "success"
                                : eval_.overallScore >= 60
                                ? "warning"
                                : "destructive"
                            }
                            className="text-[10px] h-4 px-1.5"
                          >
                            {scoreToGrade(eval_.overallScore)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(eval_.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={cn("text-sm font-bold", scoreToColor(eval_.overallScore))}>
                          {Math.round(eval_.overallScore)}
                        </span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {[
                { href: "/evaluate", icon: Star, label: "Evaluate Design", desc: "Check brand fit", color: "text-amber-500" },
                { href: "/instagram", icon: Camera, label: "Analyze Feed", desc: "Instagram audit", color: "text-pink-500" },
                { href: "/assistant", icon: MessageSquare, label: "Ask AI Assistant", desc: "Brand questions", color: "text-blue-500" },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:scale-105 transition-transform">
                      <action.icon className={cn("w-4 h-4", action.color)} />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{action.label}</p>
                      <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Brand Brain Status */}
          {brand?.brandBrain && brainReady && (
            <Card className="border-border/50 bg-gradient-to-br from-violet-500/5 to-indigo-500/5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-violet-500" />
                  <CardTitle className="text-sm font-semibold">Brand Brain</CardTitle>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2.5">
                {[
                  { label: "Colors extracted", done: true },
                  { label: "Typography mapped", done: true },
                  { label: "Tone of voice profiled", done: true },
                  { label: "Visual language analyzed", done: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recent Instagram */}
          {recentAnalyses.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Instagram Analyses</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {recentAnalyses.map((a) => (
                  <div key={a.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">@{a.username}</span>
                      <span className="text-muted-foreground">{formatDate(a.createdAt)}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground">Feed Consistency</span>
                        <span className={scoreToColor(a.feedConsistency)}>{Math.round(a.feedConsistency)}%</span>
                      </div>
                      <Progress value={a.feedConsistency} className="h-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Welcome / No Brand State */}
      {!brand && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-xl shadow-violet-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">Set up your brand</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Complete the onboarding process to create your Brand Brain and start evaluating designs.
          </p>
          <Link href="/onboarding">
            <Button variant="gradient" size="lg">
              Start Onboarding
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-xs text-muted-foreground mb-4 max-w-[200px]">{description}</p>
      <Link href={href}>
        <Button size="sm" variant="outline" className="text-xs">
          {cta}
        </Button>
      </Link>
    </div>
  );
}
