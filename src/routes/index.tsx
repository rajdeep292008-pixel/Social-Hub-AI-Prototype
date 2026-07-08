import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { platforms } from "@/lib/platforms";
import { startVisit, endPendingVisit } from "@/lib/tracking";
import { PenSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SocialHub — All your social media in one tap" },
      { name: "description", content: "Open X, LinkedIn, Facebook, Instagram, YouTube, TikTok, Telegram, WhatsApp and more from a single hub. Write with AI and track your time." },
    ],
  }),
  component: Hub,
});

function Hub() {
  const [q, setQ] = useState("");

  // When the user returns to this tab after visiting a platform, close the visit.
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") endPendingVisit();
    };
    document.addEventListener("visibilitychange", onVis);
    // Also try on mount in case the user just came back
    endPendingVisit();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const filtered = platforms.filter((p) =>
    q.trim() === "" ? true : p.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
          One tap · zero switching
        </span>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Your social hub</h1>
        <p className="max-w-2xl text-muted-foreground">
          Open every network from one place, write your next post with AI, and see where your attention actually goes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Jump to a platform</span>
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="h-8 w-40 pl-7 text-xs"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((p) => (
                <a
                  key={p.key}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => startVisit(p.key)}
                  aria-label={`Open ${p.name}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-background/40 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background/80 hover:shadow-[var(--shadow-elegant)]"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${p.bg}`}>
                    <p.Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${p.accent}`} />
                  </span>
                  <span className="text-xs font-medium text-foreground">{p.name}</span>
                </a>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground">No platform matches "{q}".</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur">
            <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-primary)]" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Need something to post?</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">
                Use the AI writer to draft posts, stories, captions, comments, replies and bios you can copy into any app.
              </p>
              <Button asChild size="sm" className="gap-2 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
                <Link to="/compose"><PenSquare className="h-3.5 w-3.5" /> Open the writer</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/40 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Time-aware</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
              <p>Every time you tap a platform, we quietly track how long that tab stays in focus and show it under <Link to="/analytics" className="text-primary underline-offset-2 hover:underline">Time spent</Link>.</p>
              <p>Everything stays on your device — nothing leaves the browser.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
