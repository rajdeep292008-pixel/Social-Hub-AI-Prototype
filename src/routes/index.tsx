import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, Twitter, Facebook, Instagram, Youtube, Music2, Send, MessageCircle, Github, Twitch, Rss } from "lucide-react";

const socialLinks = [
  { name: "X (Twitter)", url: "https://twitter.com", Icon: Twitter, color: "hover:text-[hsl(203_89%_53%)]" },
  { name: "LinkedIn", url: "https://www.linkedin.com", Icon: Linkedin, color: "hover:text-[hsl(201_100%_35%)]" },
  { name: "Facebook", url: "https://www.facebook.com", Icon: Facebook, color: "hover:text-[hsl(221_44%_41%)]" },
  { name: "Instagram", url: "https://www.instagram.com", Icon: Instagram, color: "hover:text-[hsl(330_81%_60%)]" },
  { name: "YouTube", url: "https://www.youtube.com", Icon: Youtube, color: "hover:text-[hsl(0_100%_50%)]" },
  { name: "TikTok", url: "https://www.tiktok.com", Icon: Music2, color: "hover:text-foreground" },
  { name: "Telegram", url: "https://web.telegram.org", Icon: Send, color: "hover:text-[hsl(200_100%_50%)]" },
  { name: "WhatsApp", url: "https://web.whatsapp.com", Icon: MessageCircle, color: "hover:text-[hsl(142_70%_45%)]" },
  { name: "Reddit", url: "https://www.reddit.com", Icon: Rss, color: "hover:text-[hsl(16_100%_50%)]" },
  { name: "GitHub", url: "https://github.com", Icon: Github, color: "hover:text-foreground" },
  { name: "Twitch", url: "https://www.twitch.tv", Icon: Twitch, color: "hover:text-[hsl(264_100%_64%)]" },
  { name: "Discord", url: "https://discord.com/channels/@me", Icon: MessageCircle, color: "hover:text-[hsl(235_86%_65%)]" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SocialHub — All your social media in one tap" },
      { name: "description", content: "Open X, LinkedIn, Facebook, Instagram, YouTube, TikTok, Telegram, WhatsApp and more from a single hub." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Your social hub</h1>
        <p className="text-muted-foreground">Tap any platform to open it in a new tab. All your networks, one place.</p>
      </div>

      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Jump to your social platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
