import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { platforms, platformMap } from "@/lib/platforms";
import { loadStats, resetStats, endPendingVisit, formatDuration, type VisitStats } from "@/lib/tracking";
import { Clock, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Time spent — SocialHub" },
      { name: "description", content: "See how much time you spend on each social platform. Tracked locally on your device." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const [stats, setStats] = useState<VisitStats>({ totals: {} });

  const refresh = () => setStats(loadStats());

  useEffect(() => {
    endPendingVisit();
    refresh();
    const onVis = () => {
      if (document.visibilityState === "visible") {
        endPendingVisit();
        refresh();
      }
    };
    const onFocus = () => refresh();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const rows = platforms
    .map((p) => {
      const t = stats.totals[p.key] || { seconds: 0, visits: 0, lastVisit: "" };
      return { p, ...t };
    })
    .sort((a, b) => b.seconds - a.seconds);

  const totalSeconds = rows.reduce((s, r) => s + r.seconds, 0);
  const totalVisits = rows.reduce((s, r) => s + r.visits, 0);
  const active = rows.filter((r) => r.visits > 0);
  const top = active[0];

  const handleReset = () => {
    resetStats();
    refresh();
    toast.success("Cleared time tracking");
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Time spent</h1>
          <p className="text-muted-foreground">How your attention is split across the platforms you open from the hub.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleReset}>
          <Trash2 className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total time" value={formatDuration(totalSeconds)} icon={<Clock className="h-4 w-4 text-primary" />} />
        <StatCard label="Total visits" value={totalVisits.toString()} icon={<TrendingUp className="h-4 w-4 text-primary" />} />
        <StatCard label="Platforms used" value={active.length.toString()} />
        <StatCard label="Top platform" value={top ? top.p.name : "—"} sub={top ? formatDuration(top.seconds) : undefined} />
      </div>

      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Per-platform breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {totalSeconds === 0 && (
            <div className="rounded-lg border border-dashed border-border/60 bg-background/30 p-8 text-center text-sm text-muted-foreground">
              No time tracked yet. Head to the Hub and tap a platform — we'll start the timer when the tab loses focus, and stop it when you come back.
            </div>
          )}
          {rows.map((r) => {
            const pct = totalSeconds === 0 ? 0 : Math.round((r.seconds / totalSeconds) * 100);
            const meta = platformMap[r.p.key];
            return (
              <div key={r.p.key} className="rounded-lg border border-border/60 bg-background/30 p-3">
                <div className="mb-2 flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-md ${meta.bg}`}>
                    <r.p.Icon className={`h-4 w-4 ${meta.accent}`} />
                  </span>
                  <div className="flex flex-1 flex-col leading-tight">
                    <span className="text-sm font-medium">{r.p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {r.visits} visit{r.visits === 1 ? "" : "s"}
                      {r.lastVisit ? ` · last ${new Date(r.lastVisit).toLocaleString()}` : ""}
                    </span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatDuration(r.seconds)}</span>
                </div>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[image:var(--gradient-primary)] transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 text-right text-[10px] text-muted-foreground">{pct}%</div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        How it works: when you open a platform from the hub, this tab loses focus and we start the timer. When you switch back, we stop it and add the duration to that platform. Sessions longer than 2 hours are capped to avoid inflated counts.
      </p>
    </div>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: React.ReactNode }) {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          {icon} {label}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-semibold">{value}</span>
          {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
