import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SocialHub AI" },
      { name: "description", content: "Manage your profile, notifications, and AI preferences." },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Personalize your SocialHub experience.</p>
      </div>

      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input defaultValue="Jane Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input defaultValue="jane@example.com" type="email" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {[
            { label: "Daily AI summary email", desc: "Get a recap of your activity each morning.", on: true },
            { label: "Browser notifications", desc: "Be alerted when something needs attention.", on: false },
            { label: "Auto-suggest hashtags", desc: "AI proposes hashtags as you write.", on: true },
            { label: "Reduced motion", desc: "Minimize transitions and animations.", on: false },
          ].map((p, i) => (
            <div key={p.label} className={`flex items-center justify-between py-4 ${i > 0 ? "border-t border-border/60" : ""}`}>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{p.label}</span>
                <span className="text-xs text-muted-foreground">{p.desc}</span>
              </div>
              <Switch defaultChecked={p.on} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
