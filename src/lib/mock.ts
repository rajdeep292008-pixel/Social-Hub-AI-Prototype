import type { Platform } from "@/components/PlatformIcon";

export type Notification = {
  id: string;
  platform: Platform;
  type: "like" | "comment" | "mention" | "follow" | "repost";
  user: string;
  handle: string;
  text: string;
  time: string;
};

export const notifications: Notification[] = [
  { id: "1", platform: "twitter", type: "mention", user: "Alex Rivera", handle: "@alexr", text: "Mentioned you in a thread about AI tooling.", time: "2m" },
  { id: "2", platform: "linkedin", type: "comment", user: "Priya Shah", handle: "priya-shah", text: "Loved your post on shipping fast — added a thought.", time: "14m" },
  { id: "3", platform: "twitter", type: "like", user: "Marco Liu", handle: "@marcoliu", text: "Liked your post: \"Ship small, ship often\".", time: "1h" },
  { id: "4", platform: "linkedin", type: "follow", user: "Stripe", handle: "stripe", text: "Started following your page.", time: "3h" },
  { id: "5", platform: "twitter", type: "repost", user: "Hana Kim", handle: "@hanak", text: "Reposted your thread on dashboards.", time: "5h" },
  { id: "6", platform: "linkedin", type: "comment", user: "Diego Romero", handle: "diego-r", text: "Great breakdown — would love a follow-up.", time: "1d" },
];

export type Account = {
  id: string;
  platform: Platform;
  name: string;
  handle: string;
  connected: boolean;
  followers: number;
};

export const accounts: Account[] = [
  { id: "a1", platform: "twitter", name: "Your X", handle: "@yourhandle", connected: true, followers: 12480 },
  { id: "a2", platform: "linkedin", name: "Your LinkedIn", handle: "your-name", connected: true, followers: 4321 },
];

export const stats = [
  { label: "Posts this week", value: "12", delta: "+24%" },
  { label: "New followers", value: "318", delta: "+8%" },
  { label: "Engagements", value: "2.4k", delta: "+12%" },
  { label: "Scheduled", value: "5", delta: "next 24h" },
];
