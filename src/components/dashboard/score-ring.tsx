"use client";

import { motion } from "framer-motion";
import { cn, scoreToColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
  animate?: boolean;
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  className,
  animate = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const colorClass = scoreToColor(score);
  const strokeColor =
    score >= 90
      ? "#10b981"
      : score >= 75
      ? "#22c55e"
      : score >= 60
      ? "#eab308"
      : score >= 40
      ? "#f97316"
      : "#ef4444";

  return (
    <div className={cn("relative inline-flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ filter: `drop-shadow(0 0 6px ${strokeColor}40)` }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-bold", size >= 100 ? "text-2xl" : "text-lg", colorClass)}
            initial={animate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(score)}
          </motion.span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-medium text-muted-foreground text-center">
          {label}
        </span>
      )}
    </div>
  );
}
