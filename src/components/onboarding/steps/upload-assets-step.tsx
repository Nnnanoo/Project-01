"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, ImageIcon, Type, X, Sparkles, CheckCircle2, AlertCircle,
} from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
  extracting: boolean;
  extractionError: string | null;
  onExtract: () => void;
}

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/svg+xml": [".svg"],
  "image/webp": [".webp"],
  "font/ttf": [".ttf"],
  "font/otf": [".otf"],
  "font/woff": [".woff"],
  "font/woff2": [".woff2"],
};

function getFileIcon(file: File) {
  if (file.type === "application/pdf") return <FileText className="w-4 h-4 text-red-400" />;
  if (file.type.startsWith("font") || file.name.match(/\.(ttf|otf|woff2?)$/i))
    return <Type className="w-4 h-4 text-blue-400" />;
  return <ImageIcon className="w-4 h-4 text-violet-400" />;
}

function getFileLabel(file: File) {
  if (file.type === "application/pdf") return "Brand Guidelines";
  if (file.name.toLowerCase().includes("logo")) return "Logo";
  if (file.name.toLowerCase().includes("mood")) return "Moodboard";
  if (file.type.startsWith("font") || file.name.match(/\.(ttf|otf|woff2?)$/i)) return "Font";
  return "Brand Asset";
}

export function UploadAssetsStep({ files, onChange, extracting, extractionError, onExtract }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      onChange([...files, ...accepted]);
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 50 * 1024 * 1024,
  });

  function removeFile(idx: number) {
    onChange(files.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Upload your brand guidelines</h2>
        <p className="text-sm text-muted-foreground">
          Brand Whisper 01 will automatically extract your colors, typography, tone, and visual identity.
          Upload your brand PDF, logos, moodboards, and any relevant assets.
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center min-h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 p-8",
          isDragActive
            ? "border-primary bg-primary/5"
            : files.length > 0
            ? "border-border bg-muted/20 hover:border-primary/40"
            : "border-border hover:border-primary/40 hover:bg-muted/30"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragActive ? "Drop files here" : "Drag files here or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF · PNG · JPG · SVG · Fonts (TTF, OTF, WOFF) · Max 50MB each
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Brand PDF", "Logo files", "Moodboards", "Font files"].map((t) => (
              <span key={t} className="text-[10px] bg-muted border border-border px-2.5 py-1 rounded-full text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {files.length} file{files.length > 1 ? "s" : ""} ready
            </p>
            {files.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50"
              >
                <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                  {getFileIcon(file)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getFileLabel(file)} · {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {extractionError && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{extractionError}</p>
        </div>
      )}

      {/* CTA */}
      {files.length > 0 && !extracting && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            variant="gradient"
            size="lg"
            className="w-full gap-2"
            onClick={onExtract}
          >
            <Sparkles className="w-4 h-4" />
            Extract Brand Identity with AI
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI will analyze your files and automatically extract your brand identity
          </p>
        </motion.div>
      )}

      {/* Extracting state */}
      {extracting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 py-6"
        >
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-violet-500 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Analyzing your brand files...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Brand Whisper 01 is extracting colors, typography, tone, and visual identity
            </p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {files.length === 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Tip:</span> Uploading a brand guidelines PDF gives the best results.
            Brand Whisper 01 can extract comprehensive identity data from it automatically.
          </p>
        </div>
      )}
    </div>
  );
}
