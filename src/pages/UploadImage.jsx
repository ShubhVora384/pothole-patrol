import { useState, useRef, useEffect } from "react";
import { Upload, Film, Send, X, RotateCcw } from "lucide-react";
import Results from "./Results";

const BASE_URL = "http://127.0.0.1:8000";

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setFileName(f.name);
    setResult(null);
    setError(null);

    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const f = e.dataTransfer.files?.[0];
    if (!f || !f.type.startsWith("video/")) return;

    setFile(f);
    setFileName(f.name);
    setResult(null);
    setError(null);

    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BASE_URL}/video/detect`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Server error: ${response.status}`);
      }

      const { video_id, stats } = await response.json();

      const potholeCount = stats.pothole_count ?? 0;

      const confidence = stats.average_confidence
        ? (stats.average_confidence * 100).toFixed(1)
        : null;

      const framesProcessed = stats.frames_processed ?? null;

      const maxSeverity = stats.max_severity ?? "low";

      const severityDistribution = stats.severity_distribution ?? {
        low: 0,
        medium: 0,
        high: 0,
      };

      setResult({
        videoId: video_id,
        potholeCount,
        confidence,
        framesProcessed,
        maxSeverity,
        severityDistribution,
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);

    setFile(null);
    setPreview(null);
    setFileName("");
    setResult(null);
    setError(null);

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Upload Video</h1>
      <p className="mb-8 text-muted-foreground">
        Select a road video for pothole detection analysis.
      </p>

      {!preview ? (
        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-12 transition-colors hover:border-primary/40"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
          <span className="mb-1 text-sm font-medium text-foreground">
            Click to upload or drag & drop
          </span>
          <span className="text-xs text-muted-foreground">
            MP4, AVI up to 50MB
          </span>

          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <video src={preview} controls className="w-full" />

            <button
              onClick={clear}
              className="absolute right-3 top-3 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Film className="h-5 w-5 text-primary" />
            <span className="flex-1 truncate text-sm text-foreground">
              {fileName}
            </span>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Processing video..." : "Submit for Detection"}
            </button>
          ) : (
            <button
              onClick={clear}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-border"
            >
              <RotateCcw className="h-4 w-4" />
              Upload Another Video
            </button>
          )}
        </div>
      )}

      {result && (
        <div className="mt-10" ref={resultsRef}>
          <Results
            annotatedVideoUrl={`${BASE_URL}/video/${result.videoId}`}
            potholeCount={result.potholeCount}
            confidence={result.confidence}
            framesProcessed={result.framesProcessed}
            sourceFileName={fileName}
            maxSeverity={result.maxSeverity}
            severityDistribution={result.severityDistribution}
            type="video"
          />
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
