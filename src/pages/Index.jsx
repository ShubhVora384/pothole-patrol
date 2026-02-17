import { Link } from "react-router-dom";
import { Camera, Video, History, ArrowRight, Shield, Zap, Eye } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "AI Detection",
    description: "Advanced deep learning models identify potholes with high accuracy.",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Fast inference on images and video for quick results.",
  },
  {
    icon: Shield,
    title: "Reliable Results",
    description: "Confidence scoring and detailed reports for every detection.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(38_92%_50%_/_0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-3.5 w-3.5" />
            AI-Powered Road Safety
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Pothole Detection
            <br />
            <span className="text-primary">System</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            Upload road images or videos and let our AI detect, count, and analyze potholes
            with confidence scoring and detailed reports.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/upload-image"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              <Camera className="h-4 w-4" />
              Upload Image
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/upload-video"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-border"
            >
              <Video className="h-4 w-4" />
              Upload Video
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-border"
            >
              <History className="h-4 w-4" />
              View History
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
