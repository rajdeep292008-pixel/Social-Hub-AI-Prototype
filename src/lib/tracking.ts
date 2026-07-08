// Client-side tracking of time spent on external social platforms.
// Uses tab visibility: when the user clicks a tile, we mark them "away" and
// start a timer for that platform. When they return to this tab, we stop it.

export type PlatformKey = string;

export type VisitStats = {
  totals: Record<PlatformKey, { seconds: number; visits: number; lastVisit: string }>;
};

const KEY = "socialhub.tracking.v1";
const PENDING_KEY = "socialhub.tracking.pending.v1";

export function loadStats(): VisitStats {
  if (typeof window === "undefined") return { totals: {} };
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{"totals":{}}');
  } catch {
    return { totals: {} };
  }
}

function save(stats: VisitStats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}

export function resetStats() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  localStorage.removeItem(PENDING_KEY);
}

// Called when a user clicks a platform tile
export function startVisit(platform: PlatformKey) {
  if (typeof window === "undefined") return;
  const pending = { platform, startedAt: Date.now() };
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  const stats = loadStats();
  const cur = stats.totals[platform] || { seconds: 0, visits: 0, lastVisit: "" };
  cur.visits += 1;
  cur.lastVisit = new Date().toISOString();
  stats.totals[platform] = cur;
  save(stats);
}

// Called when tab becomes visible again — closes any pending visit
export function endPendingVisit(): { platform: PlatformKey; seconds: number } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    const { platform, startedAt } = JSON.parse(raw) as { platform: string; startedAt: number };
    const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    // Cap absurdly long sessions (e.g. tab left open overnight) at 2 hours
    const capped = Math.min(seconds, 60 * 60 * 2);
    const stats = loadStats();
    const cur = stats.totals[platform] || { seconds: 0, visits: 0, lastVisit: "" };
    cur.seconds += capped;
    stats.totals[platform] = cur;
    save(stats);
    localStorage.removeItem(PENDING_KEY);
    return { platform, seconds: capped };
  } catch {
    localStorage.removeItem(PENDING_KEY);
    return null;
  }
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}h ${rm}m` : `${h}h`;
}
