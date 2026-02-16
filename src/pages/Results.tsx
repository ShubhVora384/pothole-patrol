import { BarChart3, Target, AlertTriangle, CheckCircle } from "lucide-react";

const mockResult = {
  potholeCount: 7,
  confidence: 94.2,
  severity: "High",
  processedAt: new Date().toLocaleString(),
};

const Results = () => {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Detection Results</h1>
      <p className="mb-8 text-muted-foreground">
        Analysis results from the most recent submission.
      </p>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">Potholes Found</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{mockResult.potholeCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">Confidence</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{mockResult.confidence}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">Severity</span>
          </div>
          <p className="text-3xl font-bold text-primary">{mockResult.severity}</p>
        </div>
      </div>

      {/* Placeholder for processed image */}
      <div className="mb-4 flex aspect-video items-center justify-center rounded-2xl border border-border bg-card">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-2 h-10 w-10 text-success" />
          <p className="text-sm font-medium text-foreground">Processed Image / Video</p>
          <p className="text-xs text-muted-foreground">
            Connect to backend to display annotated results
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Processed at: {mockResult.processedAt}
      </p>
    </div>
  );
};

export default Results;
