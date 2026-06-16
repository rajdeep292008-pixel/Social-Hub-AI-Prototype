import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/PlatformIcon";
import { notifications, stats } from "@/lib/mock";
import { Sparkles, TrendingUp, AtSign, Heart, MessageCircle, Repeat2, UserPlus, Loader2, PenSquare, Linkedin, Twitter, Facebook, Instagram, Youtube, Music2, Send } from "lucide-react";

const socialLinks = [
  { name: "X (Twitter)", url: "https://twitter.com", Icon: Twitter, color: "hover:text-[hsl(203_89%_53%)]" },
  { name: "LinkedIn", url: "https://www.linkedin.com", Icon: Linkedin, color: "hover:text-[hsl(201_100%_35%)]" },
  { name: "Facebook", url: "https://www.facebook.com", Icon: Facebook, color: "hover:text-[hsl(221_44%_41%)]" },
  { name: "Instagram", url: "https://www.instagram.com", Icon: Instagram, color: "hover:text-[hsl(330_81%_60%)]" },
  { name: "YouTube", url: "https://www.youtube.com", Icon: Youtube, color: "hover:text-[hsl(0_100%_50%)]" },
  { name: "TikTok", url: "https://www.tiktok.com", Icon: Music2, color: "hover:text-foreground" },
  { name: "Telegram", url: "https://web.telegram.org", Icon: Send, color: "hover:text-[hsl(200_100%_50%)]" },
];
import { summarizeActivity } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SocialHub AI" },
      { name: "description", content: "Your unified social activity at a glance: AI summaries, notifications, and engagement across X and LinkedIn." },
    ],
  }),
  component: Dashboard,
});

const typeIcon = {
  like: Heart,
  comment: MessageCircle,
  mention: AtSign,
  repost: Repeat2,
  follow: UserPlus,
} as const;

function Dashboard() {
  const fnSummary = useServerFn(summarizeActivity);
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const generate = async () => {
    setLoadingSummary(true);
    try {
      const res = await fnSummary({ data: { notifications: notifications.map(({ platform, type, user, text, time }) => ({ platform, type, user, text, time })) } });
      setSummary(res.summary);
    } catch {
      toast.error("AI summary failed");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Good morning 👋</h1>
        <p className="text-muted-foreground">Here's what's happening across your accounts.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 bg-card/60 backdrop-blur transition hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
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

      <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-primary)] opacity-80" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">AI summary — what you missed</CardTitle>
          </div>
          <Button size="sm" variant="ghost" onClick={generate} disabled={loadingSummary} className="gap-2">
            {loadingSummary ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Regenerate
          </Button>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          {loadingSummary && !summary ? (
            <span className="inline-flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…</span>
          ) : (
            summary || "Click Regenerate to get an AI summary of your recent activity."
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/60 backdrop-blur lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent notifications</CardTitle>
            <Button size="sm" variant="ghost">View all</Button>
          </CardHeader>
          <CardContent className="flex flex-col">
            {notifications.map((n) => {
              const Icon = typeIcon[n.type];
              return (
                <div key={n.id} className="flex items-start gap-3 border-t border-border/60 py-3 first:border-t-0 first:pt-0">
                  <PlatformIcon platform={n.platform} />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{n.user}</span>
                      <span className="text-xs text-muted-foreground">{n.handle}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{n.time}</span>
                    </div>
                    <div className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{n.text}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="relative overflow-hidden border-border/60 bg-card/60 backdrop-blur">
            <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-primary)] opacity-[0.08]" />
            <CardHeader>
              <CardTitle className="text-base">Quick compose</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <p className="text-muted-foreground">Draft a cross-platform post with AI assistance.</p>
              <Button asChild className="gap-2 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
                <Link to="/compose"><PenSquare className="h-4 w-4" /> Open composer</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" /> Top post
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2">
                <PlatformIcon platform="twitter" />
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
              <p className="leading-relaxed">"The best dashboards don't show you everything — they show you the next thing to do."</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> 482</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 41</span>
                <span className="flex items-center gap-1"><Repeat2 className="h-3 w-3" /> 96</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Jump to your social platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {socialLinks.map(({ name, url, Icon, color }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${name}`}
                className={`group flex flex-col items-center gap-2 rounded-lg border border-border/60 bg-background/40 p-4 text-muted-foreground transition hover:border-primary/40 hover:bg-background/80 hover:shadow-[var(--shadow-elegant)] ${color}`}
              >
                <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span className="text-xs font-medium text-foreground">{name}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
