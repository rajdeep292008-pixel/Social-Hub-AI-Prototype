# SocialHub AI

A unified social media control dashboard to manage multiple platforms (X/Twitter, LinkedIn, Facebook, Instagram, YouTube, TikTok, Telegram) from a single, clean interface — powered by AI.

**Live URL:** [https://social-media-hub-ai.lovable.app](https://social-media-hub-ai.lovable.app)

---

## ✨ Features

- **Unified Dashboard** — view activity, stats, and notifications across all connected platforms at a glance
- **AI-Powered Compose** — generate posts from ideas, improve drafts, and suggest hashtags using Gemini AI
- **AI Summaries** — get smart digests of your recent social activity with action highlights
- **Scheduling** — queue posts for later with date/time picker
- **Analytics** — engagement insights with charts and trend tracking
- **Quick Launcher** — one-click access to X, LinkedIn, Facebook, Instagram, YouTube, TikTok, and Telegram
- **Dark / Light Mode** — smooth theme toggle with persistent preference
- **Responsive Design** — works on desktop, tablet, and mobile
- **Persistent State** — user preferences and data stored via Lovable Cloud

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7) |
| Styling | Tailwind CSS v4 with semantic design tokens |
| UI Components | shadcn/ui + Lucide icons |
| Charts | Recharts |
| AI | Lovable AI Gateway (`google/gemini-3-flash-preview`) via Vercel AI SDK |
| Backend | TanStack server functions (`createServerFn`) |
| Deploy | Lovable (Cloudflare Workers edge runtime) |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (or Node.js 20+)
- A Lovable account with AI Gateway access

### Installation

```bash
# Clone the repo (after connecting GitHub in Lovable)
git clone <your-github-repo-url>
cd <repo-name>

# Install dependencies
bun install
```

### Environment Variables

Create a `.env` file in the project root:

```env
LOVABLE_API_KEY=your_lovable_api_key_here
```

> Get your API key from your Lovable project settings under **AI Gateway**.

### Run Locally

```bash
# Start the dev server
bun run dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

---

## 📁 Project Structure

```
src/
├── routes/                   # File-based routes (TanStack Router)
│   ├── __root.tsx            # Root layout, head meta, theme provider
│   ├── index.tsx             # Dashboard + social media quick launcher
│   ├── compose.tsx           # AI-powered post composer
│   ├── schedule.tsx          # Scheduled posts queue
│   ├── analytics.tsx         # Engagement analytics & charts
│   ├── accounts.tsx          # Connected accounts management
│   └── settings.tsx          # App settings & preferences
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── AppSidebar.tsx        # Navigation sidebar
│   ├── Logo.tsx              # Custom SocialHub AI logo
│   └── PlatformIcon.tsx      # Social platform icon mapper
├── lib/
│   ├── ai.functions.ts       # Server functions — AI endpoints
│   ├── ai-gateway.server.ts  # Lovable AI Gateway provider setup
│   └── mock.ts               # Demo data (notifications, stats, posts)
├── assets/
│   └── logo.png              # App logo asset
└── styles.css                # Tailwind v4 imports + design tokens
```

---

## 🤖 AI Features

All AI features are powered by server-side functions calling the Lovable AI Gateway:

| Feature | Endpoint | Description |
|---------|----------|-------------|
| `generatePost` | `POST` | Generate a social post from a topic/idea |
| `improvePost` | `POST` | Rewrite and enhance an existing draft |
| `suggestHashtags` | `POST` | Suggest 4-6 relevant hashtags for a post |
| `summarizeActivity` | `POST` | Summarize recent notifications into actionable insights |
| `bestTimeToPost` | `POST` | AI-suggested optimal posting times per platform |

---

## 🚢 Deployment

### Publish via Lovable

1. Open your project in the [Lovable editor](https://lovable.dev)
2. Click **Publish** (top right)
3. Your app will be live at `https://your-app-name.lovable.app`

### Connect to GitHub

1. In the Lovable editor, click the **+** menu → **GitHub** → **Connect project**
2. Authorize the Lovable GitHub App
3. Select your account/organization
4. Click **Create Repository**
5. Changes sync bidirectionally between Lovable and GitHub automatically

### Custom Domain

After publishing, add a custom domain under **Project Settings → Domains**.

---

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |

---

## 📸 Screenshots

*(Add screenshots of the dashboard, compose page, and analytics here after publishing)*

---

## 📜 License

MIT — built with [Lovable](https://lovable.dev).

---

**Built by the community, powered by AI.**
