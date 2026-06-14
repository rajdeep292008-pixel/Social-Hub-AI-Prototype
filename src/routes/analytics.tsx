import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stats } from "@/lib/mock";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SocialHub AI" },
      { name: "description", content: "Engagement, growth, and reach across your connected accounts." },
    ],
  }),
  component: Analytics,
});

// Tiny inline sparkline
function Spark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const w = 220, h = 60;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / Math.max(1, max - min)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full">
      <polyline fill="none" stroke={color} strokeWidth="2" points={pts} />
      <polyline fill={color} fillOpacity="0.12" stroke="none" points={`0,${h} ${pts} ${w},${h}`} />
    </svg>
  );
}

const series = [
  { label: "Engagement (7d)", color: "var(--primary)", data: [12, 18, 14, 22, 28, 24, 36] },
  { label: "New followers (7d)", color: "var(--twitter)", data: [4, 6, 9, 7, 11, 14, 18] },
  { label: "Impressions (7d)", color: "var(--linkedin)", data: [120, 180, 160, 210, 250, 230, 320] },
];

function Analytics() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Engagement and growth across your accounts.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 bg-card/60 backdrop-blur">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-semibold">{s.value}</span>
                <span className="text-xs text-success">{s.delta}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {series.map((s) => (
          <Card key={s.label} className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" /> {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Spark values={s.data} color={s.color} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
