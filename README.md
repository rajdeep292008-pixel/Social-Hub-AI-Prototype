# SocialHub AI

A unified social media control dashboard to manage multiple platforms (X/Twitter, LinkedIn, and more) from a single, clean interface — powered by AI.

🌐 **Live demo:** https://social-media-hub-ai.lovable.app.

## ✨ Features

- 📊 **Unified dashboard** — view activity across all connected platforms
- ✍️ **AI-powered compose** — generate, rewrite, and improve posts with Lovable AI (Gemini)
- 🧠 **AI summaries** — get smart digests of your notifications and activity
- 📅 **Scheduling** — queue posts for later across multiple platforms
- 📈 **Analytics** — engagement insights at a glance
- 🔗 **Quick launcher** — open X, LinkedIn, Facebook, Instagram, YouTube, TikTok, and Telegram in one click
- 🌓 **Dark/light mode** with smooth animations
- 💾 **Persistent state** via Lovable Cloud

## 🧱 Tech Stack

- **Framework:** TanStack Start (React 19 + Vite 7)
- **Styling:** Tailwind CSS v4 with semantic design tokens
- **UI:** shadcn/ui + Lucide icons
- **AI:** Lovable AI Gateway (`google/gemini-3-flash-preview`) via the Vercel AI SDK
- **Backend:** TanStack server functions (`createServerFn`)
- **Deploy:** Lovable (Cloudflare Workers edge runtime)

---

## 📁 Project structure

```
src/
├── routes/              # File-based routes (TanStack Router)
│   ├── __root.tsx       # Root layout, head meta
│   ├── index.tsx        # Dashboard + social launcher
│   ├── compose.tsx      # AI-powered post composer
│   ├── schedule.tsx     # Scheduled posts queue
│   ├── analytics.tsx    # Engagement analytics
│   ├── accounts.tsx     # Connected accounts
│   └── settings.tsx     # App settings
├── components/          # Reusable UI (sidebar, logo, icons)
├── lib/
│   ├── ai.functions.ts        # createServerFn — AI endpoints
│   ├── ai-gateway.server.ts   # Lovable AI Gateway provider
│   └── mock.ts                # Demo data
└── styles.css           # Tailwind v4 + design tokens
```

## 🚢 Deploy

Click **Publish** in the Lovable editor to deploy to `your-app.lovable.app`. Custom domains are available under Project Settings → Domains.


