import Link from 'next/link';
import { getLinks } from '@/lib/wp';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Favicon from '@/components/Favicon';

export const revalidate = 900;

type Links = Awaited<ReturnType<typeof getLinks>>;

const BRAND_STYLES: Record<string, { label: string; icon?: string }> = {
  'github.com': { label: 'text-neutral-900', icon: 'text-neutral-500' },
  'linkedin.com': { label: 'text-sky-700', icon: 'text-sky-500' },
  'x.com': { label: 'text-neutral-900', icon: 'text-neutral-500' },
  'twitter.com': { label: 'text-neutral-900', icon: 'text-neutral-500' },
  'youtube.com': { label: 'text-red-600', icon: 'text-red-500' },
  'instagram.com': { label: 'text-fuchsia-600', icon: 'text-fuchsia-500' },
  'facebook.com': { label: 'text-blue-600', icon: 'text-blue-500' },
  'dev.to': { label: 'text-neutral-900', icon: 'text-neutral-500' },
  'medium.com': { label: 'text-emerald-700', icon: 'text-emerald-500' },
  'npmjs.com': { label: 'text-red-600', icon: 'text-red-500' },
  'vercel.com': { label: 'text-neutral-900', icon: 'text-neutral-500' },
  'netlify.com': { label: 'text-emerald-700', icon: 'text-emerald-500' },
  'cloudflare.com': { label: 'text-orange-600', icon: 'text-orange-500' },
  'notion.so': { label: 'text-neutral-900', icon: 'text-neutral-500' },
  'figma.com': { label: 'text-rose-600', icon: 'text-rose-500' },
  'dribbble.com': { label: 'text-pink-600', icon: 'text-pink-500' },
  'behance.net': { label: 'text-blue-600', icon: 'text-blue-500' },
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

export default async function LinksPage() {
  const links: Links = await getLinks();

  if (!links?.length) {
    return (
      <div className="space-y-2">
        <div className="pt-2">
             <Link href="/" className="link text-sm">← Back home</Link>
            </div>
        <h1 className="h1">Links</h1>
        <p className="muted">No links available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-6">
        <div className="pt-2">
             <Link href="/" className="link text-sm">← Back home</Link>
            </div>
        <h1 className="h1">Links</h1>
        <p className="muted">A collection of useful resources & profiles.</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {links.map((l) => {
          const brand = getBrand(l.url);
          return (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                title={l.url}
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

                {/* Description (if present), otherwise show hostname */}
                {l.description ? (
                  <p className="muted text-sm mt-1">{l.description}</p>
                ) : (
                  <span className="block text-sm muted truncate mt-1">{hostname(l.url)}</span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
