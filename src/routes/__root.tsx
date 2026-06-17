import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Bell, Search } from "lucide-react";
import logoUrl from "@/assets/logo.png";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SocialHub AI — Unified social media dashboard" },
      { name: "description", content: "Manage X and LinkedIn from one fast, minimal dashboard. Compose, schedule, and get AI summaries of your activity." },
      { name: "author", content: "SocialHub AI" },
      { property: "og:title", content: "SocialHub AI — Unified social media dashboard" },
      { property: "og:description", content: "Manage X and LinkedIn from one fast, minimal dashboard. Compose, schedule, and get AI summaries of your activity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "SocialHub AI — Unified social media dashboard" },
      { name: "twitter:description", content: "Manage X and LinkedIn from one fast, minimal dashboard. Compose, schedule, and get AI summaries of your activity." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bc943d4e-a6d2-45fe-b52f-e659ff14fcdd/id-preview-350f21cc--db85d6e4-a19f-4dda-8e81-6be99ba3572e.lovable.app-1781669981762.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bc943d4e-a6d2-45fe-b52f-e659ff14fcdd/id-preview-350f21cc--db85d6e4-a19f-4dda-8e81-6be99ba3572e.lovable.app-1781669981762.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: logoUrl },
      { rel: "apple-touch-icon", href: logoUrl },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="hidden flex-1 items-center gap-2 rounded-md border border-border bg-card/50 px-3 py-1.5 text-sm text-muted-foreground md:flex md:max-w-md">
              <Search className="h-4 w-4" />
              <span>Search posts, mentions, accounts…</span>
            </div>
            <div className="flex flex-1 justify-end md:flex-none">
              <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card/50 text-muted-foreground transition hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
          <Toaster />
        </div>
      </div>
    </SidebarProvider>
  );
}
