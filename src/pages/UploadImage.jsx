import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Send, X, RotateCcw } from "lucide-react";
import Results from "./Results";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { annotatedImageUrl, potholeCount }
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setFileName(f.name);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/detection/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const potholeCount = parseInt(response.headers.get("X-Pothole-Count") ?? "0", 10);

      // Convert response blob to object URL for display
      const blob = await response.blob();
      const annotatedImageUrl = URL.createObjectURL(blob);

      setResult({ annotatedImageUrl, potholeCount });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const clear = () => {
    // Revoke previous object URL to avoid memory leaks
    if (result?.annotatedImageUrl) {
      URL.revokeObjectURL(result.annotatedImageUrl);
    }
    setFile(null);
    setPreview(null);
    setFileName("");
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      {/* Header */}
      <h1 className="mb-2 text-2xl font-bold text-foreground">Upload Image</h1>
      <p className="mb-8 text-muted-foreground">
        Select a road image for pothole detection analysis.
      </p>

      {/* Upload Area */}
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
          <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <img src={preview} alt="Preview" className="w-full object-contain" />
            <button
              onClick={clear}
              className="absolute right-3 top-3 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* File name row */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <ImageIcon className="h-5 w-5 text-primary" />
            <span className="flex-1 truncate text-sm text-foreground">{fileName}</span>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit / Try again */}
          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Processing..." : "Submit for Detection"}
            </button>
          ) : (
            <button
              onClick={clear}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-border"
            >
              <RotateCcw className="h-4 w-4" />
              Upload Another Image
            </button>
          )}
        </div>
      )}

      {/* Inline Results — shown below upload after detection */}
      {result && (
        <div className="mt-10">
          <Results
            annotatedImageUrl={result.annotatedImageUrl}
            potholeCount={result.potholeCount}
            sourceFileName={fileName}
            type="image"
          />
        </div>
      )}
    </div>
  );
};

export default UploadImage;