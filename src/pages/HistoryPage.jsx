import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  Target,
  Film,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000";

/* severity color mapping now uses backend severity */
const severityColor = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

const HistoryCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const severity = item.stats?.max_severity ?? "low";

  const confidence = item.stats?.average_confidence
    ? (item.stats.average_confidence * 100).toFixed(1)
    : "N/A";

  return (
    <div className="rounded-2xl border border-border bg-card transition hover:border-primary/30">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 p-5">

        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium">
              Video
            </span>

            <span className="font-mono text-xs text-muted-foreground">
              {item.video_id.slice(0, 8)}...
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">

            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {item.stats?.pothole_count} potholes
            </span>

            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {confidence}%
            </span>

            <span className="flex items-center gap-1">
              <Film className="h-3 w-3" />
              {item.stats?.frames_processed} frames
            </span>

            {item.created_at && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(item.created_at).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Severity */}
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold ${
              severityColor[severity]
            }`}
          >
            {severity.toUpperCase()}
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg border border-border bg-secondary p-1.5 hover:bg-border"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">

          {/* Video */}
          <video
            src={`${BASE_URL}/video/${item.video_id}`}
            controls
            className="w-full rounded-xl"
          />

          {/* Severity distribution */}
          {item.stats?.severity_distribution && (
            <div className="grid grid-cols-3 gap-3 text-center">

              <SeverityBox
                label="Low"
                value={item.stats.severity_distribution.low}
                color="text-green-500"
              />

              <SeverityBox
                label="Medium"
                value={item.stats.severity_distribution.medium}
                color="text-yellow-500"
              />

              <SeverityBox
                label="High"
                value={item.stats.severity_distribution.high}
                color="text-red-500"
              />

            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SeverityBox = ({ label, value, color }) => (
  <div className="rounded-xl border border-border p-3">
    <p className={`text-xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/video/all_videos`);
        if (!res.ok) throw new Error("Failed to fetch history");

        const data = await res.json();

        setHistory(data.reverse());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-muted-foreground">Loading history...</div>
    );

  if (error)
    return (
      <div className="p-10 text-red-500">{error}</div>
    );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">

      <h1 className="text-2xl font-bold mb-2">
        Detection History
      </h1>

      <p className="text-muted-foreground mb-8">
        Smart Road Monitoring Log — {history.length} videos processed
      </p>

      {history.length === 0 ? (
        <p className="text-muted-foreground">
          No videos processed yet.
        </p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <HistoryCard key={item.video_id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
