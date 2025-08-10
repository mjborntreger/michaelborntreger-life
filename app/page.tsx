import Link from 'next/link';
import FormattedDate from '@/components/FormattedDate';
import { listRecentPosts } from '@/lib/wp';
import ProjectsTimeline from '@/components/ProjectsTimeline';

export const revalidate = 300;

type Posts = Awaited<ReturnType<typeof listRecentPosts>>;

export default async function HomePage() {
  const posts: Posts = await listRecentPosts(1); // only latest

  const latest = posts[0] ?? null;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="space-y-3">
        <h1 className="h1">Hi, I’m Michael.</h1>
        <p className="muted max-w-2xl">
          SEO-minded developer and digital marketer. Here's what I'm working on.
        </p>
        <div className="flex gap-3 pt-1">
          <Link href="/projects" className="btn-primary ring-focus">Browse Projects</Link>
        </div>
      </section>
<ProjectsTimeline
  limitProjects={50}
  extraEvents={[
    {
      id: "portfolio-launch",
      year: 2025,
      title: "Launched this portfolio",
      summary: "Migrated from a traditional WP theme to a Next.js + headless WordPress stack.",
      accent: "green",
    },
    {
      id: "sonshine-seo",
      year: 2024,
      title: "SonShine Roofing SEO overhaul",
      summary: "Implemented performance optimizations, structured data, and backlink strategy.",
      accent: "amber",
    },
    {
      id: "learning-phase",
      year: 2023,
      title: "Full‑stack learning phase",
      summary: "Many late nights with JS/TS and modern tooling.",
      accent: "rose",
    },
  ]}
/>
      {/* Latest Post */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="h2">Latest Post</h2>
          <Link href="/blog" className="link text-sm">View all</Link>
        </div>

        {!latest ? (
          <p className="muted">No posts yet.</p>
        ) : (
          <article className="card shadow-hover p-5">
            <h3 className="text-base md:text-lg font-semibold">
              <Link href={`/blog/${latest.slug}`} className="link">
                {latest.title}
              </Link>
            </h3>
            <FormattedDate date={latest.date} />
          </article>
        )}
      </section>
    </div>
  );
}
