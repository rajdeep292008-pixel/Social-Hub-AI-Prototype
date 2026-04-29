import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformIcon, type Platform } from "@/components/PlatformIcon";
import { accounts } from "@/lib/mock";
import { Plus, Check } from "lucide-react";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — SocialHub AI" },
      { name: "description", content: "Connect and manage your X and LinkedIn accounts." },
    ],
  }),
  component: Accounts,
});

const available: { platform: Platform; name: string }[] = [
  { platform: "twitter", name: "X (Twitter)" },
  { platform: "linkedin", name: "LinkedIn" },
];

function Accounts() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Accounts</h1>
        <p className="text-muted-foreground">Securely connect the platforms you want to manage.</p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Connected</h2>
        {accounts.map((a) => (
          <Card key={a.id} className="border-border/60 bg-card/60 backdrop-blur">
            <CardContent className="flex items-center gap-4 p-4">
              <PlatformIcon platform={a.platform} className="h-10 w-10" />
              <div className="flex flex-1 flex-col">
                <span className="font-medium">{a.name}</span>
                <span className="text-xs text-muted-foreground">{a.handle} · {a.followers.toLocaleString()} followers</span>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-xs text-success">
                <Check className="h-3 w-3" /> Connected
              </span>
              <Button size="sm" variant="ghost">Disconnect</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Add another</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {available.map((a) => (
            <Card key={a.platform} className="border-dashed border-border/60 bg-card/40 transition hover:border-primary/50">
              <CardContent className="flex items-center gap-3 p-4">
                <PlatformIcon platform={a.platform} className="h-10 w-10" />
                <span className="flex-1 text-sm font-medium">{a.name}</span>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="h-3.5 w-3.5" /> Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
