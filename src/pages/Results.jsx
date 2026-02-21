import {
  BarChart3,
  Target,
  AlertTriangle,
  Download,
  Film,
} from "lucide-react";

const Results = ({
  annotatedImageUrl,
  annotatedVideoUrl,
  potholeCount,
  confidence,
  framesProcessed,
  sourceFileName,
  maxSeverity,
  severityDistribution,
  type = "image",
}) => {

  const processedAt = new Date().toLocaleString();

  const isVideo = type === "video";
  const mediaUrl = isVideo ? annotatedVideoUrl : annotatedImageUrl;

  const severity = maxSeverity ?? "low";

  const severityColor =
    severity === "low"
      ? "text-green-500"
      : severity === "medium"
      ? "text-yellow-500"
      : "text-red-500";

  const displayConfidence = confidence ?? "0";

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = mediaUrl;
    a.download = `detected_${sourceFileName ?? "result.mp4"}`;
    a.click();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Detection Results
          </h2>
          <p className="text-sm text-muted-foreground">
            Processed at {processedAt}
          </p>
        </div>

        {mediaUrl && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        )}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard
          icon={<AlertTriangle />}
          label="Potholes"
          value={potholeCount}
        />

        <StatCard
          icon={<Target />}
          label="Confidence"
          value={`${displayConfidence}%`}
        />

        <StatCard
          icon={<BarChart3 />}
          label="Severity"
          value={severity.toUpperCase()}
          color={severityColor}
        />

        {isVideo && framesProcessed != null && (
          <StatCard
            icon={<Film />}
            label="Frames"
            value={framesProcessed}
          />
        )}
      </div>

      {/* NEW – Severity distribution */}
      {severityDistribution && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 text-sm font-semibold">
            Severity Distribution
          </p>

          <div className="grid grid-cols-3 gap-4 text-center">
            <SeverityBox label="Low" value={severityDistribution.low} color="text-green-500" />
            <SeverityBox label="Medium" value={severityDistribution.medium} color="text-yellow-500" />
            <SeverityBox label="High" value={severityDistribution.high} color="text-red-500" />
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {mediaUrl ? (
          <video src={mediaUrl} controls className="w-full" />
        ) : (
          <div className="flex aspect-video items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No output available.
            </p>
          </div>
        )}
      </div>

      {sourceFileName && (
        <p className="mt-3 text-xs text-muted-foreground">
          Source: {sourceFileName}
        </p>
      )}
    </div>
  );
};

/* small UI helpers */

const StatCard = ({ icon, label, value, color }) => (
  <div className="rounded-2xl border border-border bg-card p-5 text-center">
    <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
      {icon}
      <span className="text-xs uppercase">{label}</span>
    </div>
    <p className={`text-3xl font-bold ${color ?? "text-foreground"}`}>
      {value}
    </p>
  </div>
);

const SeverityBox = ({ label, value, color }) => (
  <div className="rounded-xl border border-border p-3">
    <p className={`text-xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default Results;
