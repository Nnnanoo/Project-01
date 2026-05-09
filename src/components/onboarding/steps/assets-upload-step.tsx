"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image as ImageIcon, Type, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  if (file.type === "application/pdf") return <FileText className="w-5 h-5 text-red-500" />;
  if (file.type.startsWith("font")) return <Type className="w-5 h-5 text-blue-500" />;
  return <ImageIcon className="w-5 h-5 text-green-500" />;
}

function getFileLabel(file: File) {
  if (file.type === "application/pdf") return "Brand Guidelines";
  if (file.type.startsWith("font")) return "Font File";
  if (file.name.toLowerCase().includes("logo")) return "Logo";
  if (file.name.toLowerCase().includes("mood")) return "Moodboard";
  return "Brand Asset";
}

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
}

export function AssetsUploadStep({ files, onChange }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange([...files, ...acceptedFiles]);
    },
    [files, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 50 * 1024 * 1024,
  });

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  const hasPDF = files.some((f) => f.type === "application/pdf");

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Upload className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Upload Brand Assets</h2>
          <p className="text-sm text-muted-foreground">
            Upload your brand files for AI analysis
          </p>
        </div>
      </div>

      {/* PDF Highlight */}
      <div className="mb-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              Brand Guidelines PDF
              {hasPDF && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload your brand guidelines PDF for deep AI analysis. We&apos;ll extract
              colors, typography, tone of voice, design rules, and more to build
              your Brand Brain.
            </p>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-muted/30"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              isDragActive ? "bg-primary/10" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "w-6 h-6 transition-colors",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div>
            <p className="font-medium text-sm">
              {isDragActive ? "Drop files here" : "Drop files or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, PNG, JPG, SVG, Fonts (TTF, OTF, WOFF) — max 50MB each
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            {["Brand Guidelines PDF", "Logos", "Moodboards", "Fonts"].map((label) => (
              <span
                key={label}
                className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card"
              >
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getFileLabel(file)} · {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(i)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          No files required — you can always upload later from the dashboard.
        </p>
      )}
    </div>
  );
}
