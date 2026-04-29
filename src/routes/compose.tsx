import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PlatformIcon, type Platform } from "@/components/PlatformIcon";
import { toast } from "sonner";
import { Sparkles, CalendarClock, Send, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/compose")({
  head: () => ({
    meta: [
      { title: "Compose — SocialHub AI" },
      { name: "description", content: "Write once, post to X and LinkedIn. Schedule for later or publish now." },
    ],
  }),
  component: Compose,
});

const MAX = 280;

function Compose() {
  const [text, setText] = useState("");
  const [platforms, setPlatforms] = useState<Record<Platform, boolean>>({ twitter: true, linkedin: true });
  const remaining = MAX - text.length;

  const togglePlatform = (p: Platform) => setPlatforms((s) => ({ ...s, [p]: !s[p] }));

  const submit = (scheduled: boolean) => {
    const targets = (Object.keys(platforms) as Platform[]).filter((p) => platforms[p]);
    if (!text.trim()) return toast.error("Write something first");
    if (targets.length === 0) return toast.error("Pick at least one platform");
    toast.success(scheduled ? "Post scheduled" : `Posted to ${targets.join(" + ")}`);
    setText("");
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
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
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="gap-2">
                <ImageIcon className="h-4 w-4" /> Media
              </Button>
              <Button size="sm" variant="ghost" className="gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Improve with AI
              </Button>
            </div>
            <span className={remaining < 0 ? "text-destructive" : remaining < 40 ? "text-warning" : ""}>
              {remaining}
            </span>
          </div>

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

      <div className="flex flex-col gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm">Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(Object.keys(platforms) as Platform[]).filter((p) => platforms[p]).map((p) => (
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
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">Add hashtags</p>
              <p className="text-xs text-muted-foreground">Auto-suggest from content</p>
            </div>
            <Switch />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
