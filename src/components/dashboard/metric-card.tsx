"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function MetricCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-violet-600",
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-border/50 hover:border-border transition-colors duration-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-2xl font-bold truncate">{value}</p>
              {change && (
                <p
                  className={cn(
                    "text-xs mt-1 font-medium",
                    changeType === "positive"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : changeType === "negative"
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  )}
                >
                  {change}
                </p>
              )}
            </div>
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-muted/60", iconColor.replace("text-", "bg-").replace("-600", "-500/10").replace("-400", "-400/10"))}>
              <Icon className={cn("w-4.5 h-4.5", iconColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
