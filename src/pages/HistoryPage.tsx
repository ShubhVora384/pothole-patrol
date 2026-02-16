import { AlertTriangle, Clock, Target } from "lucide-react";

const mockHistory = [
  { id: 1, type: "Image", name: "road_photo_01.jpg", potholes: 3, confidence: 91.5, date: "2026-02-15 14:30", severity: "Medium" },
  { id: 2, type: "Video", name: "dashcam_clip.mp4", potholes: 12, confidence: 87.3, date: "2026-02-14 09:15", severity: "High" },
  { id: 3, type: "Image", name: "highway_section.png", potholes: 1, confidence: 96.8, date: "2026-02-13 16:45", severity: "Low" },
  { id: 4, type: "Image", name: "street_view_02.jpg", potholes: 5, confidence: 92.1, date: "2026-02-12 11:00", severity: "High" },
  { id: 5, type: "Video", name: "patrol_route.mp4", potholes: 8, confidence: 89.7, date: "2026-02-11 08:20", severity: "Medium" },
];

const severityColor: Record<string, string> = {
  Low: "text-success",
  Medium: "text-primary",
  High: "text-destructive",
};

const HistoryPage = () => {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Detection History</h1>
      <p className="mb-8 text-muted-foreground">Previous pothole detection results.</p>

      <div className="space-y-3">
        {mockHistory.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {item.type}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{item.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {item.potholes} potholes
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {item.confidence}% confidence
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.date}
                  </span>
                </div>
              </div>
              <span className={`text-sm font-semibold ${severityColor[item.severity]}`}>
                {item.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
