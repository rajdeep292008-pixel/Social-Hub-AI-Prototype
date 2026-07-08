import { Linkedin, Twitter, Facebook, Instagram, Youtube, Music2, Send, MessageCircle, Github, Twitch, Rss, type LucideIcon } from "lucide-react";

export type SocialPlatform = {
  key: string;
  name: string;
  url: string;
  Icon: LucideIcon;
  accent: string; // tailwind text color class
  bg: string; // tailwind bg color class (subtle)
  // Optional deep-link builder for pre-filling a share/compose intent
  shareUrl?: (text: string) => string;
};

export const platforms: SocialPlatform[] = [
  {
    key: "x",
    name: "X (Twitter)",
    url: "https://twitter.com",
    Icon: Twitter,
    accent: "text-[hsl(203_89%_53%)]",
    bg: "bg-[hsl(203_89%_53%)]/10",
    shareUrl: (t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}`,
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com",
    Icon: Linkedin,
    accent: "text-[hsl(201_100%_35%)]",
    bg: "bg-[hsl(201_100%_35%)]/10",
    shareUrl: (t) => `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(t)}`,
  },
  {
    key: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com",
    Icon: Facebook,
    accent: "text-[hsl(221_44%_51%)]",
    bg: "bg-[hsl(221_44%_51%)]/10",
    shareUrl: (t) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://facebook.com")}&quote=${encodeURIComponent(t)}`,
  },
  { key: "instagram", name: "Instagram", url: "https://www.instagram.com", Icon: Instagram, accent: "text-[hsl(330_81%_60%)]", bg: "bg-[hsl(330_81%_60%)]/10" },
  { key: "youtube", name: "YouTube", url: "https://www.youtube.com", Icon: Youtube, accent: "text-[hsl(0_100%_60%)]", bg: "bg-[hsl(0_100%_60%)]/10" },
  { key: "tiktok", name: "TikTok", url: "https://www.tiktok.com", Icon: Music2, accent: "text-foreground", bg: "bg-foreground/10" },
  {
    key: "telegram",
    name: "Telegram",
    url: "https://web.telegram.org",
    Icon: Send,
    accent: "text-[hsl(200_100%_50%)]",
    bg: "bg-[hsl(200_100%_50%)]/10",
    shareUrl: (t) => `https://t.me/share/url?url=${encodeURIComponent("https://t.me")}&text=${encodeURIComponent(t)}`,
  },
  {
    key: "whatsapp",
    name: "WhatsApp",
    url: "https://web.whatsapp.com",
    Icon: MessageCircle,
    accent: "text-[hsl(142_70%_45%)]",
    bg: "bg-[hsl(142_70%_45%)]/10",
    shareUrl: (t) => `https://wa.me/?text=${encodeURIComponent(t)}`,
  },
  {
    key: "reddit",
    name: "Reddit",
    url: "https://www.reddit.com",
    Icon: Rss,
    accent: "text-[hsl(16_100%_55%)]",
    bg: "bg-[hsl(16_100%_55%)]/10",
    shareUrl: (t) => `https://www.reddit.com/submit?title=${encodeURIComponent(t)}`,
  },
  { key: "github", name: "GitHub", url: "https://github.com", Icon: Github, accent: "text-foreground", bg: "bg-foreground/10" },
  { key: "twitch", name: "Twitch", url: "https://www.twitch.tv", Icon: Twitch, accent: "text-[hsl(264_100%_64%)]", bg: "bg-[hsl(264_100%_64%)]/10" },
  { key: "discord", name: "Discord", url: "https://discord.com/channels/@me", Icon: MessageCircle, accent: "text-[hsl(235_86%_65%)]", bg: "bg-[hsl(235_86%_65%)]/10" },
];

export const platformMap = Object.fromEntries(platforms.map((p) => [p.key, p]));
