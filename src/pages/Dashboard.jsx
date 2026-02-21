import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = "http://127.0.0.1:8000";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/video/analytics/overview`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load analytics
      </div>
    );
  }

  const severityData = [
    { name: "Low", value: data.severity_distribution.low },
    { name: "Medium", value: data.severity_distribution.medium },
    { name: "High", value: data.severity_distribution.high },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      <h1 className="mb-8 text-2xl font-bold">
        Road Monitoring Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">

        <KpiCard title="Total Videos" value={data.total_videos} />

        <KpiCard title="Total Potholes" value={data.total_potholes} />

        <KpiCard
          title="Avg Confidence"
          value={(data.average_confidence * 100).toFixed(1) + "%"}
        />

      </div>

      {/* Pie Chart */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Severity Distribution
        </h2>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
              >
                {severityData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

const KpiCard = ({ title, value }) => (
  <div className="rounded-2xl border border-border bg-card p-6 text-center">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="mt-2 text-3xl font-bold">{value}</p>
  </div>
);

export default Dashboard;
