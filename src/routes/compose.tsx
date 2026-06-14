import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PlatformIcon, type Platform } from "@/components/PlatformIcon";
import { toast } from "sonner";
import { Sparkles, CalendarClock, Send, Wand2, Hash, Loader2 } from "lucide-react";
import { generatePost, improvePost, suggestHashtags } from "@/lib/ai.functions";
import { addPost } from "@/lib/mock";

export const Route = createFileRoute("/compose")({
  head: () => ({
    meta: [
      { title: "Compose — SocialHub AI" },
      { name: "description", content: "Write once, post to X and LinkedIn. Use AI to draft, improve, and add hashtags." },
    ],
  }),
  component: Compose,
});

const MAX = 280;

function Compose() {
  const [text, setText] = useState("");
  const [platforms, setPlatforms] = useState<Record<Platform, boolean>>({ twitter: true, linkedin: true });
  const [idea, setIdea] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [loading, setLoading] = useState<null | "generate" | "improve" | "hashtags">(null);
  const [hashtags, setHashtags] = useState<string[]>([]);

  const remaining = MAX - text.length;
  const fnGenerate = useServerFn(generatePost);
  const fnImprove = useServerFn(improvePost);
  const fnHashtags = useServerFn(suggestHashtags);

  const togglePlatform = (p: Platform) => setPlatforms((s) => ({ ...s, [p]: !s[p] }));
  const activeTargets = () => (Object.keys(platforms) as Platform[]).filter((p) => platforms[p]);

  const handleGenerate = async () => {
    if (!idea.trim()) return toast.error("Describe what to write about");
    setLoading("generate");
    try {
      const targets = activeTargets();
      const platform = targets.length === 1 ? targets[0] : "both";
      const res = await fnGenerate({ data: { prompt: idea, platform } });
      setText(res.text);
      toast.success("Draft generated");
    } catch (e) {
      toast.error("AI failed. Try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleImprove = async () => {
    if (!text.trim()) return toast.error("Write something first");
    setLoading("improve");
    try {
      const res = await fnImprove({ data: { text } });
      setText(res.text);
      toast.success("Improved with AI");
    } catch {
      toast.error("AI failed. Try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleHashtags = async () => {
    if (!text.trim()) return toast.error("Write something first");
    setLoading("hashtags");
    try {
      const res = await fnHashtags({ data: { text } });
      setHashtags(res.hashtags);
      toast.success("Hashtags ready");
    } catch {
      toast.error("AI failed. Try again.");
    } finally {
      setLoading(null);
    }
  };

  const submit = (scheduled: boolean) => {
    const targets = activeTargets();
    if (!text.trim()) return toast.error("Write something first");
    if (targets.length === 0) return toast.error("Pick at least one platform");
    if (scheduled && !scheduleAt) return toast.error("Pick a date & time");
    addPost({
      text,
      platforms: targets,
      status: scheduled ? "scheduled" : "posted",
      scheduledFor: scheduled ? new Date(scheduleAt).toISOString() : undefined,
    });
    toast.success(scheduled ? "Post scheduled" : `Posted to ${targets.join(" + ")}`);
    setText("");
    setHashtags([]);
    setScheduleAt("");
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-6">
        {/* AI Idea Generator */}
        <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-primary)]" />
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" /> AI co-writer
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="What should the post be about? (e.g. 'launching our new AI dashboard')"
                className="bg-background/40"
              />
              <Button onClick={handleGenerate} disabled={loading === "generate"} className="gap-2 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
                {loading === "generate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">New post</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[180px] resize-none border-border/60 bg-background/40 text-base"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="ghost" className="gap-2" onClick={handleImprove} disabled={loading === "improve"}>
                  {loading === "improve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
                  Improve with AI
                </Button>
                <Button size="sm" variant="ghost" className="gap-2" onClick={handleHashtags} disabled={loading === "hashtags"}>
                  {loading === "hashtags" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Hash className="h-3.5 w-3.5 text-primary" />}
                  Suggest hashtags
                </Button>
              </div>
              <span className={remaining < 0 ? "text-destructive" : remaining < 40 ? "text-warning" : ""}>{remaining}</span>
            </div>

            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((h) => (
                  <button
                    key={h}
                    onClick={() => setText((t) => `${t} ${h}`.trim())}
                    className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-foreground transition hover:bg-primary/20"
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
              <div className="flex items-center gap-2">
                {(["twitter", "linkedin"] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition ${
                      platforms[p]
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <PlatformIcon platform={p} className="h-5 w-5" />
                    {p === "twitter" ? "X" : "LinkedIn"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                  className="h-9 w-[200px] bg-background/40 text-xs"
                />
                <Button variant="outline" className="gap-2" onClick={() => submit(true)}>
                  <CalendarClock className="h-4 w-4" /> Schedule
                </Button>
                <Button className="gap-2 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90" onClick={() => submit(false)}>
                  <Send className="h-4 w-4" /> Post now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm">Live preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {activeTargets().length === 0 && (
              <p className="text-xs text-muted-foreground">Pick a platform to see a preview.</p>
            )}
            {activeTargets().map((p) => (
              <div key={p} className="rounded-lg border border-border/60 bg-background/40 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <PlatformIcon platform={p} />
                  <span className="text-xs text-muted-foreground">{p === "twitter" ? "X" : "LinkedIn"} preview</span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {text || <span className="text-muted-foreground">Your post will appear here…</span>}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
