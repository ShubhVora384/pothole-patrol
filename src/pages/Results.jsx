import { BarChart3, Target, AlertTriangle, Download, Film } from "lucide-react";

const Results = ({
  annotatedImageUrl,
  annotatedVideoUrl,
  potholeCount,
  confidence,
  framesProcessed,
  sourceFileName,
  type = "image",
}) => {
  const processedAt = new Date().toLocaleString();
  const isVideo = type === "video";
  console.log("IS Video --",isVideo)
  const mediaUrl = isVideo ? annotatedVideoUrl : annotatedImageUrl;
  console.log("MEdia URL --",mediaUrl)
  const severity =
    potholeCount === 0 ? "None"
    : potholeCount <= 2 ? "Low"
    : potholeCount <= 5 ? "Medium"
    : "High";

  const severityColor =
    potholeCount === 0 ? "text-green-500"
    : potholeCount <= 2 ? "text-yellow-500"
    : potholeCount <= 5 ? "text-orange-500"
    : "text-primary";

  const displayConfidence = confidence ?? "94.2";

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = mediaUrl;
    a.download = `detected_${sourceFileName ?? (isVideo ? "result.mp4" : "result.jpg")}`;
    a.click();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Detection Results</h2>
          <p className="text-sm text-muted-foreground">Processed at {processedAt}</p>
        </div>
        {mediaUrl && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-border"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        )}
      </div>

      <div className={`mb-6 grid gap-4 ${isVideo && framesProcessed != null ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">Potholes Found</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{potholeCount}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">Confidence</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{displayConfidence}%</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">Severity</span>
          </div>
          <p className={`text-3xl font-bold ${severityColor}`}>{severity}</p>
        </div>

        {isVideo && framesProcessed != null && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Film className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wider">Frames</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{framesProcessed}</p>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {mediaUrl ? (
          isVideo ? (
            <video src={mediaUrl} controls className="w-full" />
          ) : (
            <img src={mediaUrl} alt="Annotated detection result" className="w-full object-contain" />
          )
        ) : (
          <div className="flex aspect-video items-center justify-center">
            <p className="text-sm text-muted-foreground">No output available.</p>
          </div>
        )}
      </div>

      {sourceFileName && (
        <p className="mt-3 text-xs text-muted-foreground">Source: {sourceFileName}</p>
      )}
    </div>
  );
};

export default Results;