import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/PlatformIcon";
import { notifications, stats } from "@/lib/mock";
import { Sparkles, TrendingUp, AtSign, Heart, MessageCircle, Repeat2, UserPlus } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SocialHub AI" },
      { name: "description", content: "Your unified social activity at a glance: notifications, summary, and engagement across X and LinkedIn." },
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
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Good morning 👋</h1>
        <p className="text-muted-foreground">Here's what's happening across your accounts.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 bg-card/60 backdrop-blur transition hover:border-border">
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

      <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-primary)] opacity-60" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">AI summary — what you missed today</CardTitle>
          </div>
          <Button size="sm" variant="ghost">Regenerate</Button>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Engagement is trending up <span className="text-success">12%</span> week-over-week, driven mostly by your X thread on
          minimal dashboards. Priya Shah commented on your latest LinkedIn post, and Stripe started following your page —
          consider replying to keep the momentum.
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
                <div
                  key={n.id}
                  className="flex items-start gap-3 border-t border-border/60 py-3 first:border-t-0 first:pt-0"
                >
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

        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Top post
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <PlatformIcon platform="twitter" />
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </div>
            <p className="leading-relaxed">
              "The best dashboards don't show you everything — they show you the next thing to do."
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> 482</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> 41</span>
              <span className="flex items-center gap-1"><Repeat2 className="h-3 w-3" /> 96</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
