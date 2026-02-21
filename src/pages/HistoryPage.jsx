import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Target, Film, ChevronDown, ChevronUp } from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000";

const getSeverity = (count) =>
  count === 0 ? "None" : count <= 2 ? "Low" : count <= 5 ? "Medium" : "High";

const severityColor = {
  None: "text-green-500",
  Low: "text-yellow-500",
  Medium: "text-orange-500",
  High: "text-destructive",
};

const HistoryCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const severity = getSeverity(item.stats.pothole_count);
  const confidence = item.stats.average_confidence
    ? (item.stats.average_confidence * 100).toFixed(1)
    : "N/A";

  return (
    <div className="rounded-2xl border border-border bg-card transition-colors hover:border-primary/30">
      {/* Card header — always visible */}
      <div className="flex flex-wrap items-start justify-between gap-3 p-5">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              Video
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {item.video_id.slice(0, 8)}...
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {item.stats.pothole_count} potholes
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {confidence}% confidence
            </span>
            <span className="flex items-center gap-1">
              <Film className="h-3 w-3" />
              {item.stats.frames_processed} frames
            </span>
            {item.processed_at && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.processed_at}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold ${severityColor[severity]}`}>
            {severity}
          </span>
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="rounded-lg border border-border bg-secondary p-1.5 transition-colors hover:bg-border"
          >
            {expanded
              ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
              : <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </button>
        </div>
      </div>

      {/* Expandable video */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          <video
            src={`${BASE_URL}/video/${item.video_id}`}
            controls
            className="w-full rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

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

  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
        <p className="text-muted-foreground">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Detection History</h1>
      <p className="mb-8 text-muted-foreground">
        Previous pothole detection results — {history.length} videos processed.
      </p>

      {history.length === 0 ? (
        <p className="text-muted-foreground">No videos processed yet.</p>
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