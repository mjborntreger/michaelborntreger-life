import Link from 'next/link';
import { notFound } from 'next/navigation';
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
// export const dynamicParams = false; // optional

export async function generateStaticParams() {
  const slugs = await listProjectSlugs(200);
  return slugs.map((slug) => ({ slug }));
}

type PageProps = { params: { slug: string } };

export default async function ProjectPage({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return notFound();

  const {
    title,
    heroImage,
    role,
    contentHtml,
    techStack,
    links,
    startDate,
    endDate,
  } = project;

  // Build taxonomy tree and prune to this project's selected terms
  let tree: ReturnType<typeof buildTechTree> = [];
  const selectedIds = techStack.map(t => t.dbId);
  if (selectedIds.length) {
    const allTerms = await listAllTechStackTerms();
    if (allTerms.length) {
      const fullTree = buildTechTree(allTerms);
      tree = pruneTreeToSelection(fullTree, selectedIds);
    }
  }

  return (
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
  );
}
