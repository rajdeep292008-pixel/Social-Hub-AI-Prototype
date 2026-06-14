import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/PlatformIcon";
import { loadPosts, deletePost, type StoredPost } from "@/lib/mock";
import { bestTimeToPost } from "@/lib/ai.functions";
import { CalendarClock, Trash2, Sparkles, Loader2, PenSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — SocialHub AI" },
      { name: "description", content: "View scheduled posts and AI-recommended best times to post." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const [posts, setPosts] = useState<StoredPost[]>([]);
  const [tips, setTips] = useState<{ platform: "twitter" | "linkedin"; suggestion: string; times: string[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const fnBest = useServerFn(bestTimeToPost);

  useEffect(() => { setPosts(loadPosts()); }, []);

  const remove = (id: string) => {
    deletePost(id);
    setPosts(loadPosts());
    toast.success("Removed");
  };

  const loadTips = async () => {
    setLoading(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const [tw, li] = await Promise.all([
        fnBest({ data: { platform: "twitter", timezone: tz } }),
        fnBest({ data: { platform: "linkedin", timezone: tz } }),
      ]);
      setTips([
        { platform: "twitter", ...tw },
        { platform: "linkedin", ...li },
      ]);
    } catch {
      toast.error("AI failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const scheduled = posts.filter((p) => p.status === "scheduled");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">Plan ahead and let AI pick the best windows to post.</p>
      </div>

      <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-primary)]" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> AI best times to post
          </CardTitle>
          <Button size="sm" variant="outline" onClick={loadTips} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Suggest
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {tips.length === 0 && (
            <p className="text-sm text-muted-foreground sm:col-span-2">Tap suggest for AI-picked optimal posting windows.</p>
          )}
          {tips.map((t) => (
            <div key={t.platform} className="rounded-lg border border-border/60 bg-background/40 p-3">
              <div className="mb-2 flex items-center gap-2">
                <PlatformIcon platform={t.platform} />
                <span className="text-sm font-medium">{t.platform === "twitter" ? "X" : "LinkedIn"}</span>
              </div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {t.times.map((tm) => (
                  <span key={tm} className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs">{tm}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{t.suggestion}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Scheduled posts ({scheduled.length})</h2>
          <Button asChild size="sm" variant="ghost" className="gap-2">
            <Link to="/compose"><PenSquare className="h-3.5 w-3.5" /> New post</Link>
          </Button>
        </div>
        {scheduled.length === 0 && (
          <Card className="border-dashed border-border/60 bg-card/40">
            <CardContent className="p-8 text-center">
              <CalendarClock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nothing scheduled yet. Compose a post and pick a date & time.</p>
            </CardContent>
          </Card>
        )}
        {scheduled.map((p) => (
          <Card key={p.id} className="border-border/60 bg-card/60 backdrop-blur">
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex flex-col gap-1">
                {p.platforms.map((pl) => <PlatformIcon key={pl} platform={pl} />)}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-sm">{p.text}</p>
                <span className="text-xs text-muted-foreground">
                  <CalendarClock className="mr-1 inline h-3 w-3" />
                  {p.scheduledFor ? new Date(p.scheduledFor).toLocaleString() : ""}
                </span>
              </div>
              <Button size="icon" variant="ghost" onClick={() => remove(p.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
