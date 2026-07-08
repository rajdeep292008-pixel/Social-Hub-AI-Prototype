import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Wand2, Hash, Loader2, Copy, Share2, Check, ExternalLink } from "lucide-react";
import { writeContent, improveContent, suggestHashtags, type WritingFormat } from "@/lib/ai.functions";
import { platforms } from "@/lib/platforms";

export const Route = createFileRoute("/compose")({
  head: () => ({
    meta: [
      { title: "Writer — SocialHub" },
      { name: "description", content: "AI helper to write posts, stories, captions, comments, replies, and bios you can copy and share anywhere." },
    ],
  }),
  component: Writer,
});

const formats: { value: WritingFormat; label: string; hint: string }[] = [
  { value: "post", label: "Post", hint: "Standalone update" },
  { value: "story", label: "Story", hint: "Short anecdote" },
  { value: "caption", label: "Caption", hint: "For a photo/video" },
  { value: "comment", label: "Comment", hint: "On someone's post" },
  { value: "reply", label: "Reply", hint: "To a message" },
  { value: "bio", label: "Bio", hint: "Profile bio" },
  { value: "thread", label: "Thread", hint: "3–5 numbered posts" },
  { value: "dm", label: "DM", hint: "Direct message" },
];

const tones = ["friendly", "professional", "witty", "bold", "warm", "hype", "chill"];

function Writer() {
  const [idea, setIdea] = useState("");
  const [format, setFormat] = useState<WritingFormat>("post");
  const [platform, setPlatform] = useState<string>("any");
  const [tone, setTone] = useState<string>("friendly");
  const [emojis, setEmojis] = useState(false);
  const [wantHashtags, setWantHashtags] = useState(false);

  const [text, setText] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState<null | "generate" | "improve" | "hashtags">(null);
  const [copied, setCopied] = useState(false);

  const fnWrite = useServerFn(writeContent);
  const fnImprove = useServerFn(improveContent);
  const fnHashtags = useServerFn(suggestHashtags);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const handleGenerate = async () => {
    if (!idea.trim()) return toast.error("Describe what to write about");
    setLoading("generate");
    try {
      const res = await fnWrite({ data: { prompt: idea, format, platform, tone, emojis, hashtags: wantHashtags } });
      setText(res.text);
      toast.success("Draft ready");
    } catch {
      toast.error("AI failed. Try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleImprove = async () => {
    if (!text.trim()) return toast.error("Write or generate something first");
    setLoading("improve");
    try {
      const res = await fnImprove({ data: { text } });
      setText(res.text);
      toast.success("Improved");
    } catch {
      toast.error("AI failed");
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
    } catch {
      toast.error("AI failed");
    } finally {
      setLoading(null);
    }
  };

  const copy = async () => {
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
  };

  const nativeShare = async () => {
    if (!text.trim()) return toast.error("Nothing to share");
    if (navigator.share) {
      try { await navigator.share({ text }); } catch { /* user cancelled */ }
    } else {
      await copy();
      toast("Copied — paste it anywhere");
    }
  };

  const openIntent = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const chars = text.length;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6">
        <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-primary)]" />
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> Write anything
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Your idea</Label>
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. 'shipped a new feature this week, want to share what I learned'"
                className="min-h-[92px] resize-none border-border/60 bg-background/40 text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Format</Label>
                <div className="flex flex-wrap gap-1.5">
                  {formats.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormat(f.value)}
                      title={f.hint}
                      className={`rounded-md border px-2.5 py-1.5 text-xs transition ${
                        format === f.value
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Platform</Label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="h-9 rounded-md border border-border/60 bg-background/40 px-2 text-sm"
                >
                  <option value="any">Any platform</option>
                  {platforms.map((p) => (
                    <option key={p.key} value={p.key}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Tone</Label>
                <div className="flex flex-wrap gap-1.5">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`rounded-full border px-2.5 py-1 text-xs capitalize transition ${
                        tone === t
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border/60 bg-card/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Options</Label>
                <div className="flex flex-wrap gap-2 text-xs">
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2.5 py-1.5">
                    <input type="checkbox" checked={emojis} onChange={(e) => setEmojis(e.target.checked)} className="accent-primary" />
                    Emojis
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2.5 py-1.5">
                    <input type="checkbox" checked={wantHashtags} onChange={(e) => setWantHashtags(e.target.checked)} className="accent-primary" />
                    Hashtags
                  </label>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading === "generate"}
              className="gap-2 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
            >
              {loading === "generate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Your draft</CardTitle>
            <span className="text-xs text-muted-foreground">{chars} chars</span>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your AI-written draft appears here — you can edit it before copying."
              className="min-h-[220px] resize-none border-border/60 bg-background/40 text-base leading-relaxed"
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="ghost" className="gap-2" onClick={handleImprove} disabled={loading === "improve"}>
                {loading === "improve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
                Improve
              </Button>
              <Button size="sm" variant="ghost" className="gap-2" onClick={handleHashtags} disabled={loading === "hashtags"}>
                {loading === "hashtags" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Hash className="h-3.5 w-3.5 text-primary" />}
                Suggest hashtags
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-2" onClick={copy}>
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" className="gap-2 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90" onClick={nativeShare}>
                  <Share2 className="h-3.5 w-3.5" /> Share
                </Button>
              </div>
            </div>

            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {hashtags.map((h) => (
                  <button
                    key={h}
                    onClick={() => setText((t) => `${t}${t.endsWith(" ") || t === "" ? "" : " "}${h}`)}
                    className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-foreground transition hover:bg-primary/20"
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Share directly</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              Open a platform with your draft pre-filled when supported. Otherwise the tile opens the app and your text stays on the clipboard.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((p) => {
                const url = p.shareUrl && text.trim() ? p.shareUrl(text) : p.url;
                const hasIntent = !!(p.shareUrl && text.trim());
                return (
                  <button
                    key={p.key}
                    onClick={async () => {
                      if (text.trim()) {
                        try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
                      }
                      openIntent(url);
                    }}
                    className={`group flex items-center gap-2 rounded-md border border-border/60 bg-background/40 px-2.5 py-2 text-left text-xs transition hover:border-primary/40 hover:bg-background/80 ${p.accent}`}
                  >
                    <p.Icon className="h-4 w-4" />
                    <span className="flex-1 truncate font-medium text-foreground">{p.name}</span>
                    {hasIntent ? (
                      <Share2 className="h-3 w-3 opacity-70" />
                    ) : (
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/40 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tips</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p>• Give the AI a specific angle — outcomes, numbers, or a feeling — to get a sharper draft.</p>
            <p>• Try the same idea as a "post" and a "thread" to see which reads better.</p>
            <p>• Use "Share directly" for X, LinkedIn, Reddit, WhatsApp, Telegram, Facebook — they accept pre-filled text.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
