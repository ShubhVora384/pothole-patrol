import { useState, useRef } from "react";
import { Upload, Film, Send, X } from "lucide-react";

const UploadVideo = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert("Video submitted! In production, this would call the backend API.");
    }, 2000);
  };

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Upload Video</h1>
      <p className="mb-8 text-muted-foreground">
        Select a road video for pothole detection analysis.
      </p>

      {!preview ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-12 transition-colors hover:border-primary/40">
          <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
          <span className="mb-1 text-sm font-medium text-foreground">
            Click to upload or drag & drop
          </span>
          <span className="text-xs text-muted-foreground">MP4, AVI up to 50MB</span>
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
            <span className="flex-1 truncate text-sm text-foreground">{fileName}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Processing..." : "Submit for Detection"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
