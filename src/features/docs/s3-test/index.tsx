"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { uploadImageToS3 } from "@/lib/s3-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UploadResult = { file: string; url: string; key: string };

export function S3TestPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);
    setLoading(true);
    try {
      for (const file of Array.from(fileList)) {
        const { key, url } = await uploadImageToS3(file);
        setResults((prev) => [...prev, { file: file.name, url, key }]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      <div>
        <h1 className="text-xl font-semibold">S3 Upload Test</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bucket: <code className="text-xs">ioncore</code> · Endpoint:{" "}
          <code className="text-xs">s3.ionlabs.dev</code>
        </p>
      </div>

      <div
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-10 transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <Upload className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drop images here or <span className="text-primary font-medium">click to browse</span>
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, GIF</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Uploading...
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Uploaded ({results.length})</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setResults([])}
            >
              <X className="size-3" /> Clear
            </Button>
          </div>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  <Image src={r.url} alt={r.file} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    <span className="truncate text-sm font-medium">{r.file}</span>
                  </div>
                  <p className="break-all text-xs text-muted-foreground">key: {r.key}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 h-6 text-xs"
                    onClick={() => navigator.clipboard.writeText(r.url)}
                  >
                    Copy URL
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
