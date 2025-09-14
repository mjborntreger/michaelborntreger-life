// app/projects/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProjectBySlug, listProjectSlugs, listAllTechStackTerms } from '@/lib/wp';
import { buildTechTree, pruneTreeToSelection } from '@/lib/techTree';
import TechStackTree from '@/components/TechStackTree';
import FormattedDate from '@/components/FormattedDate';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Favicon from '@/components/Favicon';

const BRAND_STYLES: Record<string, { label: string; icon?: string }> = {
  'github.com': { label: 'text-neutral-900', icon: 'text-neutral-500' },
  'linkedin.com': { label: 'text-sky-700', icon: 'text-sky-500' },
  'x.com': { label: 'text-neutral-900', icon: 'text-neutral-500' },
  'twitter.com': { label: 'text-neutral-900', icon: 'text-neutral-500' },
  'youtube.com': { label: 'text-red-600', icon: 'text-red-500' },
  'instagram.com': { label: 'text-fuchsia-600', icon: 'text-fuchsia-500' },
  'facebook.com': { label: 'text-blue-600', icon: 'text-blue-500' },
};

type OGType =
  | 'website'
  | 'article'
  | 'book'
  | 'profile'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'music.radio_station'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other';

function getBrand(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return BRAND_STYLES[host] ?? { label: 'text-blue-600', icon: 'text-neutral-400' };
  } catch {
    return { label: 'text-blue-600', icon: 'text-neutral-400' };
  }
}
function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export const revalidate = 600;

// Prebuild project pages
export async function generateStaticParams() {
  const slugs = await listProjectSlugs(200);
  return slugs.map((slug) => ({ slug }));
}

// Rank Math → Next.js SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return {};

  const s = p.seo ?? {};
  const og = s.openGraph ?? {};
  const img = og.image ?? {};

  const title = s.title || p.title;
  const description = s.description || undefined;
  const canonical = s.canonicalUrl || undefined;

  // Allowed union for Next's Metadata openGraph.type
const mapOgType = (t?: string): OGType => {
  switch ((t || '').toLowerCase()) {
    case 'website':
    case 'article':
    case 'book':
    case 'profile':
    case 'music.song':
    case 'music.album':
    case 'music.playlist':
    case 'music.radio_station':
    case 'video.movie':
    case 'video.episode':
    case 'video.tv_show':
    case 'video.other':
      return t as OGType;
    default:
      return 'website';
  }
};

  const ogImages =
    img?.url || img?.secureUrl
      ? [
          {
            url: (img.secureUrl || img.url) as string,
            width: img.width as number | undefined,
            height: img.height as number | undefined,
            type: img.type as string | undefined,
          },
        ]
      : p.heroImage?.url
      ? [{ url: p.heroImage.url }]
      : undefined;

  return {
    title,
    description,
    keywords: Array.isArray(s.focusKeywords) ? s.focusKeywords : undefined,
    alternates: { canonical },
    openGraph: {
      title: og.title || title,
      description: og.description || description,
      url: og.url || canonical,
      type: mapOgType(og.type),
      siteName: og.siteName,
      locale: og.locale,
      images: ogImages,
      publishedTime: og.articleMeta?.publishedTime || undefined,
      modifiedTime: og.articleMeta?.modifiedTime || undefined,
      section: og.articleMeta?.section || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: og.title || title,
      description: og.description || description,
      images: ogImages?.length ? [ogImages[0]!.url as string] : undefined,
    },
  };
}


type PageProps = { params: Promise<{ slug: string }> };

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return notFound();

  // Project Schema
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${BASE_URL}/projects/${slug}`;

  const ogImg =
    project.seo?.openGraph?.image?.secureUrl ||
    project.seo?.openGraph?.image?.url ||
    project.heroImage?.url ||
    undefined;

  const sameAs = (project.links || []).map(l => l.url).filter(Boolean);

  const techKeywords = (project.techStack || []).map(t => t.name);
  const aboutThings = techKeywords.map(name => ({ '@type': 'Thing', name }));

  const strip = (html: string) =>
    html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const description =
    project.seo?.description ||
    (project.contentHtml ? strip(project.contentHtml).slice(0, 300) : undefined);

  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.seo?.title || project.title,
    description,
    url,
    image: ogImg,
    inLanguage: 'en',
    datePublished: project.startDate || project.date || undefined,
    dateModified: project.date || undefined,
    author: { '@type': 'Person', name: 'Michael Borntreger', url: BASE_URL },
    publisher: { '@type': 'Person', name: 'Michael Borntreger', url: BASE_URL },
    isPartOf: { '@type': 'CollectionPage', name: 'Projects', url: `${BASE_URL}/projects` },
    keywords: techKeywords.length ? techKeywords : undefined,
    about: aboutThings.length ? aboutThings : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };

  const {
    title,
    heroImage,
    role,
    contentHtml,
    techStack,
    links = [],
    startDate,
    endDate,
  } = project;

  // Build taxonomy tree and prune to this project's selected terms
  let tree: ReturnType<typeof buildTechTree> = [];
  const selectedIds = (techStack ?? []).map((t) => t.dbId).filter(Boolean);
  if (selectedIds.length) {
    const allTerms = await listAllTechStackTerms();
    if (allTerms.length) {
      const fullTree = buildTechTree(allTerms);
      tree = pruneTreeToSelection(fullTree, selectedIds);
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectJsonLd, (_k, v) => (v ?? undefined)),
        }}
      />
      <article className="mx-auto max-w-3xl space-y-6">
        <div className="pt-2">
          <Link href="/projects" className="link text-sm">← Back to Projects</Link>
        </div>

        <h1 className="h1">{title}</h1>

        {/* Meta line: Date range + role */}
        {(startDate || role) && (
          <p className="text-sm text-neutral-600">
            {startDate ? (
              <>
                <FormattedDate
                  date={startDate}
                  className="!m-0 !p-0 !text-inherit"
                  format={{ month: 'short', year: 'numeric' }}
                />
                {' — '}
                {endDate ? (
                  <FormattedDate
                    date={endDate}
                    className="!m-0 !p-0 !text-inherit"
                    format={{ month: 'short', year: 'numeric' }}
                  />
                ) : (
                  <span>Current</span>
                )}
                {role ? ' · ' : null}
              </>
            ) : null}
            {role}
          </p>
        )}

        {heroImage?.url && (
          <img
            src={heroImage.url}
            alt={heroImage.altText || title}
            className="w-full rounded-2xl bg-neutral-50"
          />
        )}

        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {tree.length > 0 && (
          <section className="mt-4">
            <h3 className="font-semibold mb-2">Tech Stack</h3>
            <TechStackTree tree={tree} />
          </section>
        )}

        {links.length > 0 ? (
          <section className="mt-4">
            <h3 className="font-semibold mb-2">Links</h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              {links.map((l) => {
                const brand = getBrand(l.url);
                return (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${l.label} (opens in new tab)`}
                      className="card p-4 shadow-hover flex flex-col justify-between h-full hover:bg-neutral-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Favicon url={l.url} className="rounded" size={16} />
                          <span className={`font-medium ${brand.label}`}>{l.label}</span>
                        </span>
                        <ArrowTopRightOnSquareIcon className={`w-4 h-4 ${brand.icon}`} aria-hidden="true" />
                      </div>

                      {/* Repeater doesn't have descriptions, so show hostname */}
                      <span className="block text-sm muted truncate mt-1">{hostname(l.url)}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

      <footer className="pt-6">
        <Link href="/projects" className="link text-sm">
          ← Back to Projects
        </Link>
      </footer>
    </article>
    </>
  );
}
