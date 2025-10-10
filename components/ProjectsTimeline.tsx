// app/components/ProjectsTimeline.tsx
import Link from "next/link";
import { listRecentProjects } from "@/lib/wp";
import FormattedDate from "@/components/FormattedDate";
import { Badge } from "@/components/components/ui/badge";
import { TypographyH2, TypographyMuted } from "@/components/components/ui/typography";

// ---------- Types ----------
export type ExtraEvent = {
  id: string;
  title: string;
  summary?: string;
  href?: string;
  accent?: "blue" | "amber" | "green" | "rose" | "gray";
  startDate?: string | number | Date;
  endDate?: string | number | Date | null;
  year?: number | string; // optional convenience for manual events
};

export type TimelineItem = {
  kind: "project" | "extra";
  id: string;
  title: string;
  summary?: string;
  href?: string;
  slug?: string;
  accent: "blue" | "amber" | "green" | "rose" | "gray";
  role?: string;
  tech?: string[];
  startDate?: string | number | Date;
  endDate?: string | number | Date | null;
  yearLabel?: string; // only used by extras (or legacy)
};

// ---------- Helpers ----------
function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function truncate(s: string, n = 140): string {
  if (!s) return s;
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}
function dotColor(accent: TimelineItem["accent"]) {
  switch (accent) {
    case "amber": return "bg-amber-500";
    case "green": return "bg-green-500";
    case "rose":  return "bg-rose-500";
    case "gray":  return "bg-muted";
    default:      return "bg-blue-500";
  }
}
function yearOf(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "number") return String(val);
  const s = String(val);
  const m = s.match(/\d{4}/);
  return m ? m[0] : s;
}
function toTime(d?: string | number | Date | null) {
  if (d == null) return NaN;
  const t = new Date(d).getTime();
  return Number.isNaN(t) ? NaN : t;
}

// ---------- Component ----------
export default async function ProjectsTimeline({
  limitProjects = 8,
  extraEvents = [],
}: {
  limitProjects?: number;
  extraEvents?: ExtraEvent[];
}) {
  const projects = await listRecentProjects(limitProjects);

  // Projects -> TimelineItems (no year field anymore)
  const projectItems: TimelineItem[] = (projects || []).map((p: any) => ({
    kind: "project",
    id: `project-${p.slug}`,
    title: p.title,
    summary: "", // or truncate(stripHtml(p.summary)) if you add one
    slug: p.slug,
    accent: "blue",
    role: p.role,
    tech: Array.isArray(p.techStack) ? p.techStack.slice(0, 4) : [],
    startDate: p.startDate ?? undefined,
    endDate: p.endDate ?? undefined,
  }));

  // Extras can use dates or a simple year label
  const extraItems: TimelineItem[] = (extraEvents || []).map((e) => ({
    kind: "extra",
    id: `extra-${e.id}`,
    title: e.title,
    summary: e.summary,
    href: e.href,
    accent: e.accent ?? "amber",
    startDate: e.startDate,
    endDate: e.endDate,
    yearLabel: e.year !== undefined ? String(e.year) : undefined,
  }));

  // Sort: prefer startDate desc; else yearLabel desc
  const merged: TimelineItem[] = [...projectItems, ...extraItems].sort((a, b) => {
    const at = toTime(a.startDate);
    const bt = toTime(b.startDate);
    if (!Number.isNaN(at) && !Number.isNaN(bt)) return bt - at;
    if (!Number.isNaN(at)) return -1;
    if (!Number.isNaN(bt)) return 1;
    const ay = parseInt((a.yearLabel ?? "").slice(0, 4), 10);
    const by = parseInt((b.yearLabel ?? "").slice(0, 4), 10);
    if (!Number.isNaN(ay) && !Number.isNaN(by)) return by - ay;
    return (b.yearLabel ?? "").localeCompare(a.yearLabel ?? "");
  });

  return (
    <section className="space-y-4">
      <TypographyH2 className="text-2xl">Timeline</TypographyH2>

      <ol className="relative space-y-6 border-l border-border pl-10">
        {merged.map((item) => (
          <li key={item.id} className="relative">
            <div className={`absolute -left-6 top-1 h-3 w-3 rounded-full ${dotColor(item.accent)}`} />
            {/* Date range or fallback year */}
            {(item.startDate || item.yearLabel) ? (
              <div className="mb-0.5 text-sm text-muted-foreground">
                {item.startDate ? (
                  <>
                    <FormattedDate date={item.startDate} className="!m-0 !p-0 !text-inherit" />
                    {" — "}
                    {item.endDate ? (
                      <FormattedDate date={item.endDate} className="!m-0 !p-0 !text-inherit" />
                    ) : (
                      <span>Current</span>
                    )}
                  </>
                ) : (
                  <time className="text-sm text-muted-foreground">{yearOf(item.yearLabel)}</time>
                )}
              </div>
            ) : null}

            {/* Title / Link */}
            {item.kind === "project" ? (
              <Link href={`/projects/${item.slug}`} className="font-medium underline-offset-4 hover:underline">
                {item.title}
              </Link>
            ) : item.href ? (
              <a
                href={item.href}
                className="font-medium underline-offset-4 hover:underline"
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer noopener" : undefined}
              >
                {item.title}
              </a>
            ) : (
              <p className="font-medium">{item.title}</p>
            )}

            {/* Role + Tech badges */}
            {item.role || (item.tech && item.tech.length > 0) ? (
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                {item.role && (
                  <Badge variant="outline" className="rounded-full border-border/70 bg-transparent px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {item.role}
                  </Badge>
                )}
                {item.tech?.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="rounded-full border-border/70 bg-transparent px-2.5 py-0.5 text-xs font-medium text-foreground"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            ) : null}

            {item.summary && (
              <TypographyMuted className="mt-1">{item.summary}</TypographyMuted>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
